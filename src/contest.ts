import { json as parseBodyJson } from 'body-parser';
import { Express, NextFunction, Request, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';

import { ClientContest, ClientProblem, ClientProblemCompletionState, ClientRound, ClientSubmission, ClientSubmissionFull } from './api';
import ClientAuth from './auth';
import config, { ContestConfiguration } from './config';
import { Database, DatabaseOpCode, ScoreState, Submission } from './database';
import Grader from './grader';
import Logger, { defaultLogger, NamedLogger } from './log';
import { LongPollEventEmitter, NamespacedLongPollEventEmitter, rateLimitWithTrigger, sendDatabaseResponse, validateRequestBody } from './netUtil';
import Scorer, { ClientScoreSolveStatus } from './scorer';
import { FilterComparison, isUUID, reverse_enum, TypedEventEmitter, UUID } from './util';

/**
 * `ContestManager` handles automatic contest running and interfacing with clients through HTTP.
 * It will automatically start and stop contests, advance rounds, and process submissions and leaderboards.
 */
export class ContestManager {
    private static instance: ContestManager | null = null;

    readonly db: Database;
    readonly app: Express;
    private readonly longPollingGlobal: LongPollEventEmitter<{
        contests: string[]
    }>;
    private readonly longPollingUsers: NamespacedLongPollEventEmitter<{
        contestData: ClientContest
        contestScoreboards: { scores: ({ team: number } & ClientScoreSolveStatus)[], frozen: boolean }
        contestNotifications: never
        submissionData: ClientSubmission[]
    }>;
    readonly grader: Grader;
    readonly logger: NamedLogger;

    private readonly contests: Map<string, ContestHost> = new Map();
    private readonly updateLoop: NodeJS.Timeout;
    private readonly eventEmitter: TypedEventEmitter<{
        contestStart: [ContestHost],
        contestEnd: [ContestHost]
    }> = new TypedEventEmitter();

    private constructor(db: Database, app: Express, grader: Grader) {
        this.db = db;
        this.app = app;
        this.grader = grader;
        this.logger = new NamedLogger(defaultLogger, 'ContestManager');
        this.longPollingGlobal = new LongPollEventEmitter(this.logger);
        this.longPollingUsers = new NamespacedLongPollEventEmitter(this.logger)
        this.createEndpoints();
        // auto-start contests
        this.updateLoop = setInterval(() => this.checkNewContests(), 60000);
        this.checkNewContests();
    }

    /**
     * Initialize the ContestManager system.
     * @param db Database connection
     * @param app Express app (HTTP server) to attach API to
     * @param grader Grading system to use
     */
    static init(db: Database, app: Express, grader: Grader): ContestManager {
        return this.instance = this.instance ?? new ContestManager(db, app, grader);
    }

    /**
     * Get the ContestManager system.
     */
    static use(): ContestManager {
        if (this.instance === null) throw new TypeError('ContestManager init() must be called before use()');
        return this.instance;
    }

    /**
     * Checks for new contests and automatically starts them.
     */
    private async checkNewContests(): Promise<void> {
        // start any contests that haven't been started
        const contests = await this.db.readContests({
            startTime: { op: '<=', v: Date.now() },
            endTime: { op: '>', v: Date.now() },
        });
        if (contests == DatabaseOpCode.ERROR) {
            this.logger.error('Could not read contest list!');
            return;
        }
        let hasNew = false;
        for (const contest of contests) {
            if (!this.contests.has(contest.id)) {
                // check here so no crash
                if (config.contests[contest.type] === undefined) {
                    this.logger.error(`Could not load contest "${contest.id}", unconfigured contest type "${contest.type}"!`);
                    continue;
                }
                hasNew = true;
                const host = new ContestHost(contest.type, contest.id, this.db, this.grader, this.logger.logger);
                this.contests.set(contest.id, host);
                host.on('data', (data) => {
                    this.longPollingUsers.emit(host.id, 'contestData', data);
                });
                host.on('scoreboards', (scores, frozen) => {
                    this.longPollingUsers.emit(host.id, 'contestScoreboards', {
                        scores: Array.from(scores, ([team, score]) => ({ team, ...score })),
                        frozen: frozen
                    });
                });
                host.on('submissionUpdate', async (team, problemId) => {
                    // could run into issues with excessive amounts of this event
                    // ... but it's still better than whatever the Socket.IO codebase did
                    const submissions = await this.db.readSubmissions({
                        team: team,
                        problemId: problemId,
                        time: host.getTimeRange(),
                        analysis: false
                    });
                    if (Array.isArray(submissions)) {
                        if (config.debugMode) this.logger.debug(`Updating submissions for ${team}, ${problemId}`);
                        this.longPollingUsers.emit(`${host.id}:${team}:${problemId}`, 'submissionData', submissions.map<ClientSubmission>((sub) => ({
                            id: sub.id,
                            time: sub.time,
                            language: sub.language,
                            scores: sub.scores,
                            status: host.calculateCompletionState(sub),
                            analysis: false
                        })));
                    } else this.logger.warn(`Failed to update submissions for ${team}, ${problemId}: ${reverse_enum(DatabaseOpCode, submissions)}`);
                });
                host.on('end', () => {
                    this.contests.delete(contest.id);
                    this.longPollingGlobal.emit('contests', [...this.contests.keys()]);
                    this.eventEmitter.emit('contestEnd', host);
                });
                this.eventEmitter.emit('contestStart', host);
            }
        }
        if (hasNew) this.longPollingGlobal.emit('contests', [...this.contests.keys()]);
    }

    /**
     * Create HTTP endpoints
     */
    private createEndpoints() {
        const auth = ClientAuth.use();
        // always public
        // upcoming = not started, however registering for running contests is still allowed
        this.app.get('/api/contest/upcoming', async (req, res) => {
            const data = await this.db.readContests({ startTime: { op: '>', v: Date.now() }, hidden: false });
            if (Array.isArray(data)) {
                if (config.debugMode) this.logger.debug(`${req.method} ${req.path}: SUCCESS (${req.ip})`);
                res.json(data.map((item) => item.id));
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.get('/api/contest/open', async (req, res) => {
            const data = await this.db.readContests({ endTime: { op: '>', v: Date.now() }, hidden: false });
            if (Array.isArray(data)) {
                if (config.debugMode) this.logger.debug(`${req.method} ${req.path}: SUCCESS (${req.ip})`);
                res.json(data.map((item) => item.id));
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.get('/api/contest/info/:contest', async (req, res) => {
            // don't hide hidden contests or bork things
            const data = await this.db.readContests({ id: req.params.contest });
            if (Array.isArray(data)) {
                if (data.length != 1) sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger);
                else {
                    if (config.debugMode) this.logger.debug(`${req.method} ${req.path}: SUCCESS (${req.ip})`);
                    // non-public contests lose archive visibility but this info is still visible
                    const contest: any = data[0];
                    // again remove internal data (max team size, exclusions are fine)
                    delete contest.public;
                    delete contest.rounds;
                    res.json(contest);
                }
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.get('/api/contest/running', async (req, res) => {
            if (req.query.init !== undefined) this.longPollingGlobal.addImmediate('contests', res);
            else this.longPollingGlobal.addWaiter('contests', res);
        });
        // contest access since "running" returns all contests regardless of registration
        this.app.get('/api/contest/access/:contest', async (req, res) => {
            if (auth.isTokenValid(req.cookies.sessionToken)) {
                // have to be on a team, or not authorized
                const username = auth.getTokenUsername(req.cookies.sessionToken)!;
                const team = await this.db.getAccountTeam(username);
                if (team !== null && typeof team != 'number') {
                    sendDatabaseResponse(req, res, team, {}, this.logger, username, 'Auth team');
                    return;
                }
                if (team === null) {
                    sendDatabaseResponse(req, res, DatabaseOpCode.UNAUTHORIZED, {}, this.logger, username, 'Auth team');
                    return;
                }
                const teamData = await this.db.getTeamData(team);
                if (typeof teamData != 'object') {
                    sendDatabaseResponse(req, res, teamData, {}, this.logger, username, 'Check team');
                    return;
                }
                if (!teamData.registrations.includes(req.params.contest))
                    sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, {}, this.logger, username, 'Check registration');
                else
                    sendDatabaseResponse(req, res, DatabaseOpCode.SUCCESS, {}, this.logger, username, 'Check registration');
            } else {
                sendDatabaseResponse(req, res, DatabaseOpCode.UNAUTHORIZED, {}, this.logger);
            }
        });
        // apply ratelimiting first
        this.app.use(['/api/contest/:a/submit/:b', '/api/contest/:a/submit/:b-:c'], rateLimitWithTrigger({
            windowMs: 10000,
            limit: 3,
            message: 'Too many submissions'
        }, (req, res) => this.logger.warn(`Submission rate limit triggered by ${req.ip}`)));
        // apply authentication + registration for contest + contest is running
        const sessionUsername = Symbol('username');
        const sessionTeam = Symbol('team');
        this.app.use('/api/contest/:contest/*', async (req, res, next) => {
            if (auth.isTokenValid(req.cookies.sessionToken)) {
                // have to be on a team, or not authorized
                const username = auth.getTokenUsername(req.cookies.sessionToken)!;
                const team = await this.db.getAccountTeam(username);
                if (team !== null && typeof team != 'number') {
                    sendDatabaseResponse(req, res, team, {}, this.logger, username, 'Auth team');
                    return;
                }
                if (team === null) {
                    sendDatabaseResponse(req, res, DatabaseOpCode.UNAUTHORIZED, {}, this.logger, username, 'Auth team');
                    return;
                }
                // save username so don't have to check if token disappeared between this and later handlers
                req.cookies[sessionUsername] = username;
                req.cookies[sessionTeam] = team;
                // check is registered for contest
                if (!this.contests.has(req.params.contest)) {
                    // this check is repeated later because of edge case where contest ends between this and the handler
                    sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Check contest');
                    return;
                }
                const teamData = await this.db.getTeamData(team);
                if (typeof teamData != 'object') {
                    sendDatabaseResponse(req, res, teamData, {}, this.logger, username, 'Check registration');
                    return;
                }
                if (!teamData.registrations.includes(req.params.contest)) {
                    sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, `Cannot ${req.method} ${req.method} ${req.path} when not registered for ${req.params.contest}`, this.logger, username, 'Check registration');
                    return;
                }
                next();
            } else {
                sendDatabaseResponse(req, res, DatabaseOpCode.UNAUTHORIZED, {}, this.logger);
            }
        });
        // contest data
        this.app.get('/api/contest/:contest/data', (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            if (!this.contests.has(req.params.contest)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Check contest');
                return;
            }
            if (req.query.init) this.longPollingUsers.addImmediate(req.params.contest, 'contestData', res);
            else this.longPollingUsers.addWaiter(req.params.contest, 'contestData', res);
        });
        const respondGetProblemData = async (req: Request, res: Response, problemId: UUID) => {
            const username = req.cookies[sessionUsername as any] as string;
            const contestHost = this.contests.get(req.params.contest)!;
            if (!isUUID(problemId)) {
                if (config.debugMode) this.logger.warn(`${req.method} ${req.path} malformed: Invalid problem UUID (${req.ip})`);
                res.status(400).send('Invalid problem UUID');
                return;
            }
            const [pRound, pNumber] = contestHost.getProblemRoundAndNumber(problemId);
            if (pRound === undefined || pRound > contestHost.round) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Read problem');
                return;
            }
            const problemRes = await this.db.readProblems({ id: problemId });
            if (!Array.isArray(problemRes)) {
                sendDatabaseResponse(req, res, problemRes, {}, this.logger, username, 'Read problem');
                return;
            }
            if (problemRes.length != 1) {
                // just in case somehow its gone from the database
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Read problem');
                return;
            }
            res.json({
                id: problemRes[0].id,
                contest: req.params.contest,
                round: pRound,
                number: pNumber,
                name: problemRes[0].name,
                author: problemRes[0].author,
                content: problemRes[0].content,
                constraints: problemRes[0].constraints
            } satisfies ClientProblem);
        };
        this.app.get('/api/contest/:contest/problem/:pId', async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            if (!this.contests.has(req.params.contest)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Check contest');
                return;
            }
            respondGetProblemData(req, res, req.params.pId);
        });
        this.app.get('/api/contest/:contest/problem/:pRound-:pNumber', async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            if (!this.contests.has(req.params.contest)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Check contest');
                return;
            }
            const contestHost = this.contests.get(req.params.contest)!;
            const pRound = Number(req.params.pRound);
            const pNumber = Number(req.params.pNumber);
            if (!Number.isInteger(pRound) || pRound < 0 || !Number.isInteger(pNumber) || pNumber < 0) {
                if (config.debugMode) this.logger.warn(`${req.method} ${req.path} malformed: Invalid round or problem number (${req.ip})`);
                res.status(400).send('Invalid round or problem number');
                return;
            }
            // get problem ID, will respond with 404 if not found (undefined -> empty string)
            respondGetProblemData(req, res, contestHost.getProblemId(pRound, pNumber) ?? '');
        });
        const validateUploadSubmission = async (req: Request, res: Response, next: NextFunction) => {
            const contestHost = this.contests.get(req.params.contest)!;
            validateRequestBody({
                file: `required|string|length:${contestHost.contestConfig.maxSubmissionSize}`,
                language: contestHost.contestConfig.submitSolver ? `required|string|in:${contestHost.contestConfig.acceptedSolverLanguages.join(',')}` : undefined
            }, this.logger, 422)(req, res, next);
        };
        const respondUploadSubmission = async (req: Request, res: Response, problemId: UUID, file: string, language?: string) => {
            const username = req.cookies[sessionUsername as any] as string;
            const team = req.cookies[sessionTeam as any] as number;
            const contestHost = this.contests.get(req.params.contest)!;
            if (!isUUID(problemId)) {
                if (config.debugMode) this.logger.warn(`${req.method} ${req.path} malformed: Invalid problem UUID (${req.ip})`);
                res.status(400).send('Invalid problem UUID');
                return;
            }
            if (!contestHost.problemSubmittable(problemId)) {
                sendDatabaseResponse(req, res, 404, {}, this.logger, username, 'Queue submission');
                return;
            }
            const submission: Submission = {
                id: uuidV4(),
                username: username,
                team: team,
                problemId: problemId,
                time: Date.now(),
                file: file,
                language: language ?? 'none',
                scores: [],
                analysis: false
            };
            const processRes = await contestHost.processSubmission(submission);
            sendDatabaseResponse(req, res, processRes, {
                [DatabaseOpCode.SUCCESS]: 'Uploaded submission',
                [DatabaseOpCode.NOT_FOUND]: 'Problem not found',
                [DatabaseOpCode.FORBIDDEN]: 'Cannot submit to this problem',
                [DatabaseOpCode.CONFLICT]: 'Cannot submit with ungraded submissions',
                [DatabaseOpCode.ERROR]: 'Internal server error'
            }, this.logger, username, 'Queue submission');
        };
        this.app.post('/api/contest/:contest/submit/:pId', parseBodyJson(), validateUploadSubmission, async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            if (!this.contests.has(req.params.contest)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Check contest');
                return;
            }
            respondUploadSubmission(req, res, req.params.pId, req.body.file, req.body.language);
        });
        this.app.post('/api/contest/:contest/submit/:pRound-:pNumber', parseBodyJson(), validateUploadSubmission, async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            if (!this.contests.has(req.params.contest)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Check contest');
                return;
            }
            const contestHost = this.contests.get(req.params.contest)!;
            const pRound = Number(req.params.pRound);
            const pNumber = Number(req.params.pNumber);
            if (!Number.isInteger(pRound) || pRound < 0 || !Number.isInteger(pNumber) || pNumber < 0) {
                if (config.debugMode) this.logger.warn(`${req.method} ${req.path} malformed: Invalid round or problem number (${req.ip})`);
                res.status(400).send('Invalid round or problem number');
                return;
            }
            respondUploadSubmission(req, res, contestHost.getProblemId(pRound, pNumber) ?? '', req.body.file, req.body.language)
        });
        this.app.get('/api/contest/:contest/submissions/:pId', (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const team = req.cookies[sessionTeam] as number;
            if (!this.contests.has(req.params.contest)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Check contest');
                return;
            }
            const contestHost = this.contests.get(req.params.contest)!;
            if (!isUUID(req.params.pId)) {
                if (config.debugMode) this.logger.warn(`${req.method} ${req.path} malformed: Invalid problem UUID (${req.ip})`);
                res.status(400).send('Invalid problem UUID');
                return;
            }
            if (!contestHost.containsProblem(req.params.pId)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Check problem');
                return;
            }
            if (req.query.init) this.longPollingUsers.addImmediate(`${req.params.contest}:${team}:${req.params.pId}`, 'submissionData', res);
            else this.longPollingUsers.addWaiter(`${req.params.contest}:${team}:${req.params.pId}`, 'submissionData', res);
        });
        this.app.get('/api/contest/:contest/submission/:sId', async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const team = req.cookies[sessionTeam] as number;
            const contestHost = this.contests.get(req.params.contest)!;
            if (!isUUID(req.params.sId)) {
                if (config.debugMode) this.logger.warn(`${req.method} ${req.path} malformed: Invalid submission UUID (${req.ip})`);
                res.status(400).send('Invalid submission UUID');
                return;
            }
            // ensure only can read within this contest by the current team
            const submissions = await this.db.readSubmissions({
                contest: { contest: req.params.contest },
                id: req.params.sId,
                team: team,
                time: contestHost.getTimeRange(),
                analysis: false
            });
            if (!Array.isArray(submissions)) {
                sendDatabaseResponse(req, res, submissions, {}, this.logger, username, 'Read submission');
                return;
            }
            if (submissions.length == 0) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Read submission');
                return;
            }
            const submission = submissions[0];
            res.json({
                ...submission,
                status: contestHost.calculateCompletionState(submission)
            } satisfies ClientSubmissionFull);
        });
        this.app.get('/api/contest/:contest/scoreboards', (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            if (!this.contests.has(req.params.contest)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Check contest');
                return;
            }
            if (req.query.init) this.longPollingUsers.addImmediate(req.params.contest, 'contestScoreboards', res);
            else this.longPollingUsers.addWaiter(req.params.contest, 'contestScoreboards', res);
        });
        // not implemented but it's still here
        this.app.get('/api/contest/:contest/notifications', (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            if (!this.contests.has(req.params.contest)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Check contest');
                return;
            }
            if (req.query.init) this.longPollingUsers.addImmediate(req.params.contest, 'contestNotifications', res);
            else this.longPollingUsers.addWaiter(req.params.contest, 'contestNotifications', res);
        });
    }

    /**
     * Get a list of running contests
     * @returns  the contests
     */
    getRunningContests(): ContestHost[] {
        return Array.from(this.contests.values());
    }

    /**
     * Add an event listener.
     * @param ev Event name
     * @param cb Callback function
     */
    on: ContestManager['eventEmitter']['on'] = (ev, cb) => this.eventEmitter.on(ev, cb);
    /**
     * Remove an event listener.
     * @param ev Event name
     * @param cb Callback function
     */
    off: ContestManager['eventEmitter']['off'] = (ev, cb) => this.eventEmitter.off(ev, cb);

    /**
     * Stops all contests and closes the contest manager
     */
    close() {
        this.longPollingGlobal.close();
        this.longPollingUsers.close();
        this.contests.forEach((contest) => contest.end());
        this.grader.close();
        clearInterval(this.updateLoop);
    }
}

/**
 * Module of {@link ContestManager} containing hosting for individual contests, including handling submissions.
 * Communication with clients is handled through ContestManager.
 */
export class ContestHost {
    readonly contestType: string;
    readonly contestConfig: ContestConfiguration;
    readonly id: string;
    readonly db: Database;
    readonly grader: Grader;
    readonly scorer: Scorer;
    readonly logger: NamedLogger;

    private readonly contest: ClientContest;
    private index: number = 0;
    private active: boolean = false;
    private ended: boolean = false;
    private updateLoop: NodeJS.Timeout | undefined = undefined;
    private readonly eventEmitter: TypedEventEmitter<{
        // [Contest data]
        data: [ClientContest]
        // [Current client scoreboards, frozen]
        scoreboards: [Map<number, ClientScoreSolveStatus>, boolean]
        // [team ID, problem UUID]
        submissionUpdate: [number, UUID]
        // []
        end: []
    }> = new TypedEventEmitter();

    private scoreboard: Map<number, ClientScoreSolveStatus> = new Map();
    private clientScoreboard: Map<number, ClientScoreSolveStatus> = new Map();

    /**
     * @param type Contest type ID
     * @param id Contest ID of contest
     * @param db Database connection
     * @param grader Grader management instance to use for grading
     * @param logger Logger instance
     */
    constructor(type: string, id: string, db: Database, grader: Grader, logger: Logger) {
        if (config.contests[type] === undefined) throw new ReferenceError(`Contest type "${type}" does not exist in configuration`);
        this.contestType = type;
        this.contestConfig = config.contests[type]!;
        this.id = id;
        this.db = db;
        this.grader = grader;
        this.scorer = new Scorer([], logger);
        this.logger = new NamedLogger(logger, `ContestHost-${this.id}`);
        this.contest = {
            id: id,
            type: this.contestType,
            rounds: [],
            startTime: Infinity,
            endTime: Infinity
        };
        this.logger.info('Starting contest');
        setTimeout(() => this.reload());
    }

    /**
     * Reload the contest data from the database, also updating clients.
     * Will re-calculate the current round as well.
     */
    async reload(): Promise<void> {
        this.logger.info(`Reloading contest data "${this.id}"`);
        clearInterval(this.updateLoop);
        const contest = await this.db.readContests({ id: this.id });
        const rounds = await this.db.readRounds({ contest: this.id });
        const problems = await this.db.readProblems({ contest: { contest: this.id } })
        if (contest == DatabaseOpCode.ERROR || contest.length == 0 || rounds == DatabaseOpCode.ERROR || problems == DatabaseOpCode.ERROR) {
            if (contest != DatabaseOpCode.ERROR) this.logger.error(`Contest "${this.id}" does not exist`);
            else this.logger.error(`Database error`);
            this.end();
            return;
        }
        if (!this.contestConfig.rounds && rounds.length != 1) {
            this.logger.error('Contest rounds are disabled, but contest contains multiple rounds');
            this.end();
            return;
        }
        if (rounds.length == 0) {
            this.logger.error('Contest has no rounds');
            this.end();
            return;
        }
        this.scorer.setRounds(rounds);
        this.scorer.clearScores();
        // ensure ordering & existence of rounds & problems
        const mapped: ClientRound[] = [];
        for (let i in contest[0].rounds) {
            const round = rounds.find((r) => r.id == contest[0].rounds[i]);
            if (round === undefined) {
                this.logger.error(`Contest "${this.id}" missing round: ${contest[0].rounds[i]}`);
                this.end();
                return;
            }
            for (let j in round.problems) {
                const problem = problems.find((p) => p.id == round.problems[j]);
                if (problem === undefined) {
                    this.logger.error(`Contest "${this.id}" missing problem: ${round.problems[j]}`);
                    this.end();
                    return;
                }
            }
            mapped.push({
                contest: this.id,
                round: Number(i),
                problems: round.problems,
                startTime: round.startTime,
                endTime: round.endTime
            });
        }
        this.contest.rounds = mapped;
        this.contest.startTime = contest[0].startTime;
        this.contest.endTime = contest[0].endTime;
        this.eventEmitter.emit('data', {
            ...this.contestData,
            rounds: this.contestData.rounds.map(round => ({
                ...round,
                problems: Date.now() >= round.startTime ? round.problems : []
            }))
        });

        // reload the scoreboard too
        const teams = await this.db.getAllRegisteredTeams(this.id);
        if (teams == DatabaseOpCode.ERROR) {
            this.logger.error(`Database error`);
            this.end();
            return;
        }
        const submissions = await this.db.readSubmissions({
            contest: { contest: this.id },
            team: teams,
            time: this.getTimeRange(),
            analysis: false
        });
        if (submissions == DatabaseOpCode.ERROR) {
            this.logger.error(`Database error`);
            this.end();
            return;
        }
        for (const sub of submissions) {
            this.eventEmitter.emit('submissionUpdate', sub.team!, sub.problemId);
        }
        // maintain consistency with score freeze time
        const scoreFreezeCutoffTime = this.contest.rounds[this.contest.rounds.length - 1].endTime - (this.contestConfig.scoreFreezeTime * 60000);
        const frozenSubmissions: Submission[] = [];
        const regradeSubmissions: Submission[] = [];
        for (const sub of submissions) {
            if (sub.scores.length > 0) {
                if (sub.time < scoreFreezeCutoffTime) this.scorer.addSubmission(sub);
                else frozenSubmissions.push(sub);
            } else regradeSubmissions.push(sub);
        }
        this.clientScoreboard = this.scorer.getScoreSolveStatus();
        for (const sub of frozenSubmissions) {
            this.scorer.addSubmission(sub);
        }
        this.scoreboard = this.scorer.getScoreSolveStatus();
        // regrade submissions in order of submission
        regradeSubmissions.sort((a, b) => a.time - b.time);
        for (const sub of regradeSubmissions) {
            this.gradeSubmission(sub);
        }
        this.eventEmitter.emit('scoreboards', new Map(this.clientScoreboard.entries()), Date.now() >= scoreFreezeCutoffTime);

        // re-index the contest
        this.index = -1;
        this.active = false;
        const now = Date.now();
        if (this.contest.startTime > now || this.contest.endTime <= now) {
            this.end();
            return;
        }
        for (let i = 0; i < this.contest.rounds.length; i++) {
            if (this.contest.rounds[i].startTime <= now) {
                this.index = i;
                this.active = this.contest.rounds[i].endTime > now;
            } else break;
        }
        this.logger.info(`Contest ${this.contest.id} - Indexed to round ${this.index}`);
        // advancing to next round
        let updateIndex = -1;
        this.updateLoop = setInterval(() => {
            // index is from start of round to start of next round; -1 means before round 0
            // active means round is active (index 0 active false means between round 0 and round 1/end of contest)
            const now = Date.now();
            if (this.index >= 0 && this.contest.rounds[this.index].endTime <= now && this.active) {
                this.active = false;
                this.logger.info(`Contest ${this.contest.id} - Round ${this.index} end`);
            }
            if (this.contest.rounds[this.index + 1] !== undefined && this.contest.rounds[this.index + 1].startTime <= now) {
                this.index++;
                this.active = true;
                this.logger.info(`Contest ${this.contest.id} - Round ${this.index} start`);
                this.eventEmitter.emit('data', {
                    ...this.contestData,
                    rounds: this.contestData.rounds.map(round => ({
                        ...round,
                        problems: now >= round.startTime ? round.problems : []
                    }))
                });
            }
            if (this.contest.endTime <= now) this.end(true);
            // also updating the scorer occasionally
            updateIndex++;
            if (updateIndex % 1200 == 0) {
                if (now < scoreFreezeCutoffTime) this.clientScoreboard = this.scoreboard = this.scorer.getScoreSolveStatus();
                else this.scoreboard = this.scorer.getScoreSolveStatus();
                this.eventEmitter.emit('scoreboards', new Map(this.clientScoreboard.entries()), Date.now() >= scoreFreezeCutoffTime);
            }
        }, 50);
    }

    /**
     * Get current scoreboard
     */
    get scoreboards(): Map<number, ClientScoreSolveStatus> {
        return new Map(this.scoreboard);
    }
    /**
     * Get current scoreboard for clients, which could be "frozen"
     */
    get clientScoreboards(): Map<number, ClientScoreSolveStatus> {
        return new Map(this.clientScoreboard);
    }
    /**
     * The current contest data, in client format.
     */
    get contestData(): ClientContest {
        return structuredClone(this.contest);
    }
    /**
     * Index of the current round (zero-indexed).
     */
    get round(): number {
        return this.index;
    }
    /**
     * Get a {@link FilterComparison} for the time range of the entire contest or a specific round.
     * @param round Round number, if `undefined` entire contest
     * @returns `FilterComparison` for time range, or `-1` if an invalid round number supplied
     */
    getTimeRange(round?: number): FilterComparison<number> {
        if (round === undefined) {
            return {
                op: '=><',
                v1: this.contest.startTime,
                v2: this.contest.endTime
            };
        } else {
            if (this.contest.rounds[round] !== undefined) return {
                op: '=><',
                v1: this.contest.rounds[round].startTime,
                v2: this.contest.rounds[round].endTime,
            };
            else return -1;
        }
    }
    /**
     * Get the problem UUID by the round and number.
     * @param round Round number
     * @param problem Problem number
     * @returns Problem UUID, or undefined if the round/problem does not exist
     */
    getProblemId(round: number, problem: number): UUID | undefined {
        return this.contest.rounds[round]?.problems[problem];
    }
    /**
     * Get the problem round and problem number by the problem UUID.
     * @param id Problem ID
     * @returns Problem [round, number], or undefined if the problem is not in the contest
     */
    getProblemRoundAndNumber(id: UUID): [number, number] | [undefined, undefined] {
        for (let r = 0; r < this.contest.rounds.length; r++) {
            const p = this.contest.rounds[r].problems.indexOf(id);
            if (p != -1) return [r, p];
        }
        return [undefined, undefined]
    }
    /**
     * Check if a given problem is within this contest.
     * @param id Problem ID
     * @returns If the problem is in the contest
     */
    containsProblem(id: UUID): boolean {
        return this.contest.rounds.some((round) => round.problems.includes(id));
    }
    /**
     * Get if a particular problem ID is submittable.
     * Submissions for all rounds close in between rounds, regardless of {@link ContestConfiguration.restrictiveRounds}.
     * @param id Problem ID
     * @returns If the problem is in the contest and submittable
     */
    problemSubmittable(id: UUID): boolean {
        if (!this.active) return false;
        if (this.contestConfig.restrictiveRounds) return this.contest.rounds.slice(0, this.index + 1).some((r) => r.problems.includes(id));
        return this.contest.rounds[this.index].problems.includes(id);
    }

    private readonly pendingDirectSubmissions: Map<string, NodeJS.Timeout> = new Map();

    /**
     * Submit a solution to the contest. Will automatically grade and associate the submission with the correct team.
     * @param submission Submission
     * @returns Status code
     */
    async processSubmission(submission: Submission): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.FORBIDDEN | DatabaseOpCode.CONFLICT | DatabaseOpCode.ERROR> {
        if (!this.containsProblem(submission.problemId))
            return DatabaseOpCode.NOT_FOUND;
        if (!this.problemSubmittable(submission.problemId)
            || !this.contestConfig.acceptedSolverLanguages.includes(submission.language)
            || submission.file.length > this.contestConfig.maxSubmissionSize)
            return DatabaseOpCode.FORBIDDEN;
        if (submission.team === null) {
            this.logger.error('Cannot grade contest submission without team');
            return DatabaseOpCode.ERROR;
        }
        if (this.grader.hasUngraded(submission.team, submission.problemId))
            return DatabaseOpCode.CONFLICT;
        return await this.gradeSubmission(submission);
    }
    /**
     * Submit a solution to the contest, however does not check round restrictions.
     * @param submission Submission
     * @returns Status code
     */
    private async gradeSubmission(submission: Submission): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        if (submission.team === null) {
            this.logger.error('Cannot grade contest submission without team');
            return DatabaseOpCode.ERROR;
        }
        const writeRes = await this.db.writeSubmission(submission);
        if (writeRes != DatabaseOpCode.SUCCESS) return writeRes;
        this.eventEmitter.emit('submissionUpdate', submission.team!, submission.problemId);
        if (this.contestConfig.graders) {
            // server grades submission instead of manual grading
            const writeGraded = async (graded: Submission) => {
                const res = await this.db.writeSubmission(graded);
                if (res != DatabaseOpCode.SUCCESS) this.logger.error(`Failed to write submission ${graded.username}-${graded.problemId}`);
                // submission must have team in contest (verified when passed in as parameter)
                this.eventEmitter.emit('submissionUpdate', graded.team!, graded.problemId);
                this.scorer.addSubmission(graded);
            };
            if (this.contestConfig.submitSolver) {
                // submit solution code
                this.grader.queueUngraded(submission, async (graded) => {
                    if (graded === null) this.logger.warn(`Grading for submission ${submission.username}-${submission.problemId} was cancelled!`);
                    else {
                        if (config.debugMode) this.logger.debug(`Grading for submission ${submission.username}-${submission.problemId} complete`);
                        writeGraded(graded);
                    }
                });
            } else {
                // submit answer
                const problemRes = await this.db.readProblems({ id: submission.problemId });
                if (!Array.isArray(problemRes)) {
                    this.logger.error(`Failed to read problem solution for ${submission.problemId}: ${reverse_enum(DatabaseOpCode, problemRes)}`);
                    return problemRes;
                }
                if (problemRes.length != 1) {
                    this.logger.error(`Failed to read problem solution for ${submission.problemId}: NOT_FOUND`);
                    return DatabaseOpCode.NOT_FOUND;
                }
                const problem = problemRes[0];
                if (problem.solution === null) {
                    this.logger.error(`Failed to read problem solution for ${submission.problemId}: solution is null`);
                    return DatabaseOpCode.ERROR;
                }
                // odd way of doing this but it works
                const subId = submission.team + ':' + submission.problemId;
                if (this.pendingDirectSubmissions.has(subId)) clearTimeout(this.pendingDirectSubmissions.get(subId));
                const timeout = setTimeout(() => {
                    const sub2 = structuredClone(submission);
                    sub2.scores.push({
                        state: sub2.file === problem.solution ? ScoreState.PASS : ScoreState.INCORRECT,
                        time: 0,
                        memory: 0,
                        subtask: 0
                    });
                    writeGraded(sub2);
                    this.pendingDirectSubmissions.delete(subId);
                }, this.contestConfig.directSubmissionDelay * 1000);
                this.pendingDirectSubmissions.set(subId, timeout);
            }
        } else {
            // manual grading
            this.logger.error(`Manual grading is not supported (contest ${this.id}, type ${this.contestType})`);
            return DatabaseOpCode.ERROR;
        }
        return DatabaseOpCode.SUCCESS;
    }

    /**
     * Get the completion state to be displayed by the client for a given submission.
     * @param submission Submission to assign completion state to
     * @returns Completion state of submission
     */
    calculateCompletionState(submission?: Submission): ClientProblemCompletionState {
        if (submission === undefined) return ClientProblemCompletionState.NOT_UPLOADED;
        // will not reveal verdict until round ends
        if (this.contestConfig.withholdResults && this.problemSubmittable(submission.problemId)) return ClientProblemCompletionState.UPLOADED;
        if (submission.scores.length == 0) return ClientProblemCompletionState.SUBMITTED;
        // all cases in subtask must be solved to be correct
        const subtasks = new Map<number, boolean>();
        for (const score of submission.scores) {
            if (subtasks.get(score.subtask) !== false) subtasks.set(score.subtask, score.state == ScoreState.PASS);
        }
        const hasPass = Array.from(subtasks.keys()).some((subtask) => subtasks.get(subtask));
        const hasFail = submission.scores.some((score) => score.state != ScoreState.PASS);
        if (hasPass && !hasFail) return ClientProblemCompletionState.GRADED_PASS;
        if (hasPass) return ClientProblemCompletionState.GRADED_PARTIAL;
        return ClientProblemCompletionState.GRADED_FAIL;
    }

    /**
     * Add an event listener.
     * @param ev Event name
     * @param cb Callback function
     */
    on: ContestHost['eventEmitter']['on'] = (ev, cb) => this.eventEmitter.on(ev, cb);
    /**
     * Remove an event listener.
     * @param ev Event name
     * @param cb Callback function
     */
    off: ContestHost['eventEmitter']['off'] = (ev, cb) => this.eventEmitter.off(ev, cb);

    /**
     * Stop the running contest and remove all users.
     * @param complete Mark the contest as ended in database (contest cannot be restarted)
     */
    end(complete: boolean = false) {
        if (this.ended) return;
        this.ended = true;
        if (complete) {
            this.logger.info(`Ending contest "${this.id}"`);
            this.db.finishContest(this.id);
        }
        this.eventEmitter.emit('end');
    }
}

export default ContestManager;