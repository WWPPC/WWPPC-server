import { randomUUID } from 'crypto';
import { Express } from 'express';

import { ClientContest, ClientProblem, ClientProblemCompletionState, ClientRound, ClientSubmission } from './api';
import ClientAuth from './auth';
import config from './config';
import { Database, DatabaseOpCode, Score, ScoreState, Submission } from './database';
import Grader from './grader';
import Logger, { defaultLogger, NamedLogger } from './log';
import { NamespacedLongPollEventEmitter } from './netUtil';
import Scorer, { UserScore } from './scorer';
import { isUUID, reverse_enum, sendDatabaseResponse, UUID } from './util';

/**
 * `ContestManager` handles automatic contest running and interfacing with clients through HTTP.
 * It will automatically start and stop contests, advance rounds, and process submissions and leaderboards.
 */
export class ContestManager {
    private static instance: ContestManager | null = null;

    readonly db: Database;
    readonly app: Express;
    readonly eventEmitter: NamespacedLongPollEventEmitter<['data', 'submissionData']>;
    readonly grader: Grader;
    readonly logger: NamedLogger;

    private readonly contests: Map<string, ContestHost> = new Map();
    private readonly updateLoop: NodeJS.Timeout;

    private constructor(db: Database, app: Express, grader: Grader) {
        this.db = db;
        this.app = app;
        this.grader = grader;
        this.logger = new NamedLogger(defaultLogger, 'ContestManager');
        // this order is very important!! createEndpoints has contest registration checks that block event access if not registered
        this.createEndpoints();
        this.eventEmitter = new NamespacedLongPollEventEmitter(app, '/api/contest/', ['data', 'submissionData'] as const, []);
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

    private async checkNewContests() {
        // start any contests that haven't been started
        const contests = await this.db.readContests({
            startTime: { op: '<=', v: Date.now() },
            endTime: { op: '>', v: Date.now() },
        });
        if (contests == DatabaseOpCode.ERROR) {
            this.logger.error('Could not read contest list!');
            return;
        }
        for (const contest of contests) {
            if (!this.contests.has(contest.id)) {
                // check here so no crash
                if (config.contests[contest.type] === undefined) {
                    this.logger.error(`Could not load contest "${contest.id}", unconfigured contest type "${contest.type}"!`);
                    continue;
                }
                const host = new ContestHost(contest.type, contest.id, this.db, this.grader, this.logger.logger);
                this.contests.set(contest.id, host);
                host.onended(() => this.contests.delete(contest.id));
            }
        }
    }

    private createEndpoints() {
        // always public
        // upcoming = not started, however registering for running contests is still allowed
        this.app.get('/api/contest/upcoming', async (req, res) => {
            const data = await this.db.readContests({ startTime: { op: '>', v: Date.now() } });
            if (Array.isArray(data)) {
                if (config.debugMode) this.logger.debug(`${req.path}: SUCCESS (${req.ip})`);
                res.json(data.map((item) => item.id));
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.get('/api/contest/openRegistrations', async (req, res) => {
            const data = await this.db.readContests({ endTime: { op: '>', v: Date.now() } });
            if (Array.isArray(data)) {
                if (config.debugMode) this.logger.debug(`${req.path}: SUCCESS (${req.ip})`);
                res.json(data.map((item) => item.id));
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.get('/api/contest/info/:contest', async (req, res) => {
            const data = await this.db.readContests({ id: req.params.contest });
            if (Array.isArray(data)) {
                if (data.length != 1) sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger);
                else {
                    if (config.debugMode) this.logger.debug(`${req.path}: SUCCESS (${req.ip})`);
                    // non-public contests lose archive visibility but this info is still visible
                    const contest: any = data[0];
                    // again remove internal data (max team size, exclusions are fine)
                    delete contest.public;
                    delete contest.rounds;
                    res.json(contest);
                }
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        // registrations - requires authentication
        const auth = ClientAuth.use();
        const sessionUsername = Symbol('username');
        const sessionTeam = Symbol('team');
        this.app.use('/api/contest/:contest/*', async (req, res, next) => {
            if (auth.isTokenValid(req.cookies.sessionToken)) {
                // save username so don't have to check if token disappeared between this and later handlers
                const username = auth.getTokenUsername(req.cookies.sessionToken)!;
                const team = await this.db.getAccountTeam(username);
                if (team !== null && typeof team != 'string') {
                    sendDatabaseResponse(req, res, team, {}, this.logger, username, 'Auth team');
                    return;
                }
                req.cookies[sessionUsername] = username;
                req.cookies[sessionTeam] = team;
                next();
            } else {
                sendDatabaseResponse(req, res, DatabaseOpCode.UNAUTHORIZED, {}, this.logger);
            }
        });
        this.app.post('/api/contest/:contest/register', async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const team = req.cookies[sessionTeam] as string;
            if (team === null) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, { [DatabaseOpCode.FORBIDDEN]: 'Cannot register without a team' }, this.logger, username);
                return;
            }
            const contestRes = await this.db.readContests({ id: req.params.contest });
            if (!Array.isArray(contestRes)) {
                sendDatabaseResponse(req, res, contestRes, {}, this.logger, username, 'Fetch contest');
                return;
            }
            if (contestRes.length != 1) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Fetch contest');
                return;
            }
            const contest = contestRes[0];
            const teamData = await this.db.getTeamData(team);
            if (typeof teamData != 'object') {
                sendDatabaseResponse(req, res, teamData, {}, this.logger, username, 'Check contest');
                return;
            }
            if (teamData.members.length > contest.maxTeamSize) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, { [DatabaseOpCode.FORBIDDEN]: 'Too many team members; max size ' + contest.maxTeamSize }, this.logger, username, 'Check contest');
                return;
            }
            const restrictedContestRes = await this.db.readContests({ id: contest.exclusions });
            if (!Array.isArray(restrictedContestRes)) {
                sendDatabaseResponse(req, res, restrictedContestRes, {}, this.logger, username, 'Check contest');
                return;
            }
            if (restrictedContestRes.some((contest) => teamData.registrations.includes(contest.id))) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, { [DatabaseOpCode.FORBIDDEN]: 'Conflict with existing registrations' }, this.logger, username, 'Check contest');
                return;
            }
            const check = await this.db.registerContest(team, contest.id);
            sendDatabaseResponse(req, res, check, {}, this.logger, username, 'Set registration');
        });
        this.app.delete('/api/contest/:contest/register', async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const team = req.cookies[sessionTeam] as string;
            if (team === null) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, { [DatabaseOpCode.FORBIDDEN]: 'Cannot unregister without a team' }, this.logger, username);
                return;
            }
            const teamData = await this.db.getTeamData(team);
            if (typeof teamData != 'object') {
                sendDatabaseResponse(req, res, teamData, {}, this.logger, username, 'Check team');
                return;
            }
            if (!teamData.registrations.includes(req.params.contest)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, { [DatabaseOpCode.NOT_FOUND]: 'Not registered' }, this.logger, username, 'Check team');
                return;
            }
            const check = await this.db.unregisterContest(team, req.params.contest);
            sendDatabaseResponse(req, res, check, {}, this.logger, username, 'Set registration');

        });
        // requires registration for contest
        this.app.use('/api/contest/:contest/*', async (req, res, next) => {
            const username = req.cookies[sessionUsername] as string;
            const team = req.cookies[sessionTeam] as string;
            const teamData = await this.db.getTeamData(team);
            if (typeof teamData != 'object') {
                sendDatabaseResponse(req, res, teamData, {}, this.logger, username, 'Check registration');
                return;
            }
            if (!teamData.registrations.includes(req.params.contest)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, {
                    [DatabaseOpCode.FORBIDDEN]: `Cannot ${req.method} ${req.path} when not registered for ${req.params.contest}`
                }, this.logger, username, 'Check registration');
                return;
            }
            next();
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
     * Stops all contests and closes the contest manager
     */
    close() {
        this.eventEmitter.close();
        this.contests.forEach((contest) => contest.end());
        this.grader.close();
        clearInterval(this.updateLoop);
    }
}

/**
 * Module of `ContestManager` containing hosting for individual contests, including handling submissions.
 * Communication with clients is handled through ContestManager.
 */
export class ContestHost {
    readonly contestType: string;
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

    private scoreboard: Map<string, UserScore> = new Map();
    private clientScoreboard: Map<string, UserScore> = new Map();

    readonly pendingDirectSubmissions: Map<string, NodeJS.Timeout> = new Map();

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
        this.id = id;
        this.db = db;
        this.grader = grader;
        this.scorer = new Scorer([], logger, (submission, problem, round) => {
            return {
                score: 1 / problem.numSubtasks,
                penalty: submission.time
            };
        });
        this.logger = new NamedLogger(logger, `ContestHost-${this.id}`);
        this.contest = {
            id: id,
            type: this.contestType,
            rounds: [],
            startTime: Infinity,
            endTime: Infinity
        };
        this.logger.info('Starting contest');
        this.reload();
    }

    /**
     * Reload the contest data from the database, also updating clients.
     * Will re-calculate the current round as well.
     */
    async reload(): Promise<void> {
        this.logger.info(`Reloading contest data "${this.id}"`);
        clearInterval(this.updateLoop);
        const contest = await this.db.readContests({ id: this.id });
        if (contest == DatabaseOpCode.ERROR || contest.length == 0) {
            if (contest == DatabaseOpCode.ERROR) this.logger.error(`Database error`);
            else this.logger.error(`Contest "${this.id}" does not exist`);
            this.end();
            return;
        }
        if (!config.contests[this.contestType]!.rounds && contest[0].rounds.length != 1) {
            this.logger.error('Contest rounds are disabled, but contest contains multiple rounds');
            this.end();
            return;
        }
        if (contest[0].rounds.length == 0) {
            this.logger.error('Contest has no rounds');
            this.end();
            return;
        }
        const rounds = await this.db.readRounds({ id: contest[0].rounds });
        if (rounds == DatabaseOpCode.ERROR) {
            this.logger.error(`Database error`);
            this.end();
            return;
        }
        this.scorer.setRounds(rounds);
        this.scorer.clearScores();
        const mapped: ClientRound[] = [];
        for (let i in contest[0].rounds) {
            const round = rounds.find((r) => r.id === contest[0].rounds[i]);
            if (round === undefined) {
                this.logger.error(`Contest "${this.id}" missing round: ${contest[0].rounds[i]}`);
                this.end();
                return;
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
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA
        // EMIT UPDATE FOR DATA

        // reload the scoreboard too
        const users = await this.db.getAllRegisteredUsers(this.id);
        if (users == DatabaseOpCode.ERROR) {
            this.logger.error(`Database error`);
            this.end();
            return;
        }
        const submissions = await this.db.readSubmissions({ contest: { contest: this.contest.id }, username: users, analysis: false });
        if (submissions == DatabaseOpCode.ERROR) {
            this.logger.error(`Database error`);
            this.end();
            return;
        }
        // maintain consistency with score freeze time
        const scoreFreezeCutoffTime = this.contest.rounds[this.contest.rounds.length - 1].endTime - (config.contests[this.contestType]!.scoreFreezeTime * 60000);
        const frozenSubmissions: Submission[] = [];
        for (const sub of submissions) {
            if (sub.time < scoreFreezeCutoffTime) {
                this.scorer.updateUser(sub);
            }
            else frozenSubmissions.push(sub);
        }
        this.scoreboard = this.scorer.getScores();
        for (const sub of frozenSubmissions) {
            this.scorer.updateUser(sub);
        }
        this.clientScoreboard = this.scorer.getScores();

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
        let scorerUpdateModulo = 0;
        this.updateLoop = setInterval(() => {
            const now = Date.now();
            let updated = false;
            if (this.index >= 0 && this.contest.rounds[this.index].endTime <= now && this.active) {
                updated = true;
                this.active = false;
                this.logger.info(`Contest ${this.contest.id} - Round ${this.index} end`);
            }
            if (this.contest.rounds[this.index + 1] != undefined && this.contest.rounds[this.index + 1].startTime <= now) {
                updated = true;
                this.index++;
                this.active = true;
                this.logger.info(`Contest ${this.contest.id} - Round ${this.index} start`);
            }
            // EMIT UPDATE FOR DATA
            // EMIT UPDATE FOR DATA
            // EMIT UPDATE FOR DATA
            // EMIT UPDATE FOR DATA
            // EMIT UPDATE FOR DATA
            // EMIT UPDATE FOR DATA
            // EMIT UPDATE FOR DATA
            // EMIT UPDATE FOR DATA
            // EMIT UPDATE FOR DATA
            // EMIT UPDATE FOR DATA
            // EMIT UPDATE FOR DATA
            if (this.contest.endTime <= Date.now()) this.end(true);
            // also updating the scorer occasionally
            scorerUpdateModulo++;
            if (scorerUpdateModulo % 200 == 0) {
                if (Date.now() < scoreFreezeCutoffTime) this.clientScoreboard = this.scoreboard = this.scorer.getScores();
                else this.scoreboard = this.scorer.getScores();
                // EMIT UPDATE FOR SCOREBOARDS
                // EMIT UPDATE FOR SCOREBOARDS
                // EMIT UPDATE FOR SCOREBOARDS
                // EMIT UPDATE FOR SCOREBOARDS
                // EMIT UPDATE FOR SCOREBOARDS
                // EMIT UPDATE FOR SCOREBOARDS
                // EMIT UPDATE FOR SCOREBOARDS
                // EMIT UPDATE FOR SCOREBOARDS
                // EMIT UPDATE FOR SCOREBOARDS
                // EMIT UPDATE FOR SCOREBOARDS
                // EMIT UPDATE FOR SCOREBOARDS
                // EMIT UPDATE FOR SCOREBOARDS
            }
        }, 50);
    }

    /**
     * Get (possibly frozen) scoreboards
     */
    get scoreboards(): Map<string, UserScore> {
        return new Map(this.scoreboard);
    }

    /**
     * Get (never frozen) scoreboards
     */
    get clientScoreboards(): Map<string, UserScore> {
        return new Map(this.clientScoreboard);
    }

    /**
     * Index of the current round (zero-indexed).
     */
    get round(): number {
        return this.index;
    }
    
    /**
     * Get if a particular problem ID is submittable.
     * @param id Problem ID
     * @returns 
     */
    problemSubmittable(id: UUID): boolean {
        return this.active && this.contest.rounds[this.index].problems.includes(id);
    }

    private getCompletionState(round: number, scores: Score[] | undefined): ClientProblemCompletionState {
        // will not reveal verdict until round ends
        if (scores == undefined) return ClientProblemCompletionState.NOT_UPLOADED;
        if (config.contests[this.contestType]!.withholdResults && round == this.index) return ClientProblemCompletionState.UPLOADED;
        if (scores.length == 0) return ClientProblemCompletionState.SUBMITTED;
        const subtasks = new Map<number, boolean>();
        for (const score of scores) {
            if (subtasks.get(score.subtask) !== false) subtasks.set(score.subtask, score.state == ScoreState.CORRECT);
        }
        scores.forEach((score) => {
        });
        const hasPass = Array.from(subtasks.keys()).some((subtask) => subtasks.get(subtask) === true);
        const hasFail = scores.some((score) => score.state != ScoreState.CORRECT);
        if (hasPass && !hasFail) return ClientProblemCompletionState.GRADED_PASS;
        if (hasPass) return ClientProblemCompletionState.GRADED_PARTIAL;
        return ClientProblemCompletionState.GRADED_FAIL;
    }

    /**
     * Add a username-linked SocketIO connection to the user list.
     * @param s SocketIO connection (with modifications)
     */
    addSocket(s: ServerSocket): void {
        const socket = s;

        if (this.users.has(socket.username)) this.users.get(socket.username)!.sockets.add(socket);
        else this.users.set(socket.username, { sockets: new Set([socket]), internalSockets: new Set() });
        socket.join(this.sid);
        socket.on('disconnect', () => this.removeSocket(socket));
        socket.on('timeout', () => this.removeSocket(socket));
        socket.on('error', () => this.removeSocket(socket));

        // prompt connection to namespace
        const authToken = randomUUID();
        this.pendingConnections.set(authToken, socket);
        this.pendingConnectionsInverse.set(socket, authToken);
        socket.emit('joinContestHost', { type: this.contestType, sid: this.sid, token: authToken });
        if (config.debugMode) socket.logWithId(this.logger.logger.debug, `Prompted to join ContestHost namespace "contest-${this.sid}"`);
    }
    /**
     * Add an internal SocketIO connection (within the contest namespace) to the user list.
     * @param s SocketIO connection within the namespace (with modifications)
     */
    addInternalSocket(s: ContestSocket): void {
        if (s.nsp.name !== this.io.name) throw new TypeError(`Socket supplied is not within the ContestHost namespace (expected "${this.io.name}", got"${s.nsp.name}`);

        const socket = s;

        socket.join(socket.username);
        if (this.users.has(socket.username)) this.users.get(socket.username)!.internalSockets.add(socket);
        else this.users.set(socket.username, { sockets: new Set(), internalSockets: new Set([socket]) });
        socket.on('disconnect', () => this.removeInternalSocket(socket));
        socket.on('timeout', () => this.removeInternalSocket(socket));
        socket.on('error', () => this.removeInternalSocket(socket));

        // make sure no accidental duping
        socket.removeAllListeners('updateSubmission');
        socket.removeAllListeners('getSubmissionCode');
        socket.on('updateSubmission', async (submission: { id: string, file: string, lang: string }, cb: (res: ContestUpdateSubmissionResult) => any) => {
            if (submission == null || typeof submission.id != 'string' || typeof submission.file != 'string' || typeof submission.lang != 'string' || !isUUID(submission.id) || typeof cb != 'function') {
                socket.kick('invalid updateSubmission payload');
                return;
            }
            if (config.debugMode) socket.logWithId(this.logger.logger.debug, 'Update submission: ' + submission.id);
            const respond = (res: ContestUpdateSubmissionResult) => {
                if (config.debugMode) socket.logWithId(this.logger.logger.debug, `Update submission: ${submission.id} - ${reverse_enum(ContestUpdateSubmissionResult, res)}`);
                cb(res);
            };
            if (Buffer.byteLength(submission.file, 'base64url') > config.contests[this.contestType]!.maxSubmissionSize) {
                respond(ContestUpdateSubmissionResult.FILE_TOO_LARGE);
                return;
            }
            if (config.contests[this.contestType]!.submitSolver && !config.contests[this.contestType]!.acceptedSolverLanguages.includes(submission.lang)) {
                respond(ContestUpdateSubmissionResult.LANGUAGE_NOT_ACCEPTABLE);
                return;
            }
            if (!this.problemSubmittable(submission.id)) {
                respond(ContestUpdateSubmissionResult.PROBLEM_NOT_SUBMITTABLE);
                return;
            }
            const problems = await this.db.readProblems({ id: submission.id });
            if (problems === null || problems.length != 1) {
                this.logger.handleError(`Could not load problem "${submission.id}"`, `Fetched ${problems?.length ?? 'null'} results`);
                respond(ContestUpdateSubmissionResult.ERROR);
                return;
            }
            const teamData = await this.db.getTeamData(socket.username);
            if (typeof teamData != 'object') {
                this.logger.handleError(`Could not fetch team data (for ${socket.username})!`, `Result ${reverse_enum(DatabaseOpCode, teamData)}`);
                respond(ContestUpdateSubmissionResult.ERROR);
                return;
            }
            const serverSubmission: Submission = {
                username: teamData.id,
                problemId: submission.id,
                file: submission.file,
                scores: [],
                history: [],
                lang: submission.lang,
                time: Date.now(),
                analysis: false
            };
            if (!(await this.db.writeSubmission(serverSubmission, config.contests[this.contestType]!.withholdResults))) {
                this.logger.error(`Failed to write submission for ${serverSubmission.problemId} by ${socket.username}`);
                respond(ContestUpdateSubmissionResult.ERROR);
                return;
            }
            /**
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             * PROBABY SHOULD DOCUMENT/EXPLAIN WHY BETTER
             */
            // submissions are stored under the team
            if (config.contests[this.contestType]!.graders) {
                const writeGraded = async (graded: Submission) => {
                    if (!(await this.db.writeSubmission(graded, config.contests[this.contestType]!.withholdResults))) {
                        this.logger.error(`Failed to write submission for ${graded.problemId} by ${socket.username}`);
                    }
                    // make sure it gets to all the team
                    const teamData = await this.db.getTeamData(socket.username);
                    if (typeof teamData != 'object') this.logger.error(`Could not fetch team data (for ${socket.username})! Was the account deleted?`);
                    else teamData.members.forEach((username) => this.updateUser(username));
                    // score it too (after grading)
                    this.scorer.updateUser(graded, this.contest.rounds[this.index].id);
                }
                if (config.contests[this.contestType]!.submitSolver) {
                    // use the grading system
                    this.grader.cancelUngraded(teamData.id, submission.id);
                    this.grader.queueUngraded(serverSubmission, async (graded) => {
                        if (graded == null) this.logger.warn(`Submission grading was canceled! (submitted by ${socket.username}, team ${teamData.id}, for ${submission.id})`);
                        else if (config.debugMode) this.logger.debug(`Submission was completed (by ${socket.username}, team ${teamData.id} for ${submission.id})`);
                        if (graded != null) writeGraded(graded);
                    });
                } else {
                    // direct comparison
                    // if the problem doesnt have a solution then whomp whomp
                    if (problems[0].solution === null) {
                        this.logger.error(`Failed to grade submission solution for "${problems[0].id}" because correct solution is null`);
                        return;
                    }
                    // cancel the previous submission in a weird way
                    const subId = serverSubmission.username + ':' + serverSubmission.problemId;
                    if (this.pendingDirectSubmissions.has(subId)) clearTimeout(this.pendingDirectSubmissions.get(subId));
                    const timeout = setTimeout(() => {
                        serverSubmission.scores.push({
                            state: submission.file === problems[0].solution ? ScoreState.CORRECT : ScoreState.INCORRECT,
                            time: 0,
                            memory: 0,
                            subtask: 0
                        });
                        writeGraded(serverSubmission);
                        this.pendingDirectSubmissions.delete(subId);
                    }, config.contests[this.contestType]!.directSubmissionDelay * 1000);
                    this.pendingDirectSubmissions.set(subId, timeout);
                }
            } else {
                // idk what to do here
                this.logger.error(`Could not grade submission for ${submission.id} (from ${socket.username}):\nUnimplemented manual grading system used`);
            }
            respond(ContestUpdateSubmissionResult.SUCCESS);
            // update whole team
            teamData.members.forEach((username) => this.updateUser(username));
            this.logger.info(`Accepted submission for ${submission.id} by ${socket.username} (team ${teamData.id})`);
        });
        socket.on('getSubmissionCode', async (data: { id: string }, cb: (res: string) => any) => {
            if (data == null || typeof data.id != 'string' || !isUUID(data.id) || typeof cb != 'function') {
                socket.kick('invalid getSubmissionCode payload');
                return;
            }
            if (config.debugMode) socket.logWithId(this.logger.logger.info, 'Fetch submission code: ' + data.id);
            const teamData = await this.db.getTeamData(socket.username);
            if (typeof teamData != 'object') {
                cb('');
                return;
            }
            // same as having null checks
            const submission = await this.db.readSubmissions({ username: teamData.id, id: data.id, analysis: false });
            cb(submission?.at(0)?.file ?? '');
        });
        this.updateUser(socket.username);
    }
    /**
     * Remove a previously-added username-linked SocketIO connection from the user list.
     * @param socket SocketIO connection (with modifications)
     * @returns  If the socket was previously within the list of connections
     */
    removeSocket(socket: ServerSocket): boolean {
        if (!this.users.has(socket.username)) return false;
        const user = this.users.get(socket.username)!;
        if (user.sockets.has(socket)) {
            socket.leave(this.sid);
            user.sockets.delete(socket);
            if (this.pendingConnectionsInverse.has(socket)) {
                this.pendingConnections.delete(this.pendingConnectionsInverse.get(socket)!);
                this.pendingConnectionsInverse.delete(socket);
            }
            if (user.sockets.size == 0) {
                // there shouldn't be extra internal sockets, but delete anyway
                user.internalSockets.forEach((s) => this.removeInternalSocket(s));
                this.users.delete(socket.username);
            }
            return true;
        }
        return false;
    }
    /**
     * Remove a previously-added internal SocketIO connection from the user list.
     * @param socket SocketIO connection (with modifications)
     * @returns  If the socket was previously within the list of connections
     */
    removeInternalSocket(socket: ContestSocket): boolean {
        if (!this.users.has(socket.username)) return false;
        const user = this.users.get(socket.username)!;
        if (user.internalSockets.has(socket)) {
            socket.removeAllListeners('updateSubmission');
            socket.removeAllListeners('getSubmissionCode');
            socket.leave(socket.username);
            user.internalSockets.delete(socket);
            return true;
        }
        return false;
    }

    private readonly endListeners: Set<() => any> = new Set();
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
        this.users.forEach((s) => s.sockets.forEach((u) => this.removeSocket(u)));
        this.endListeners.forEach((cb) => cb());
    }
    /**
     * Add a listener for when the contest ends.
     * @param cb Callback listener
     */
    onended(cb: () => any) {
        this.endListeners.add(cb);
    }
}

export default ContestManager;