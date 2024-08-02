import { Express } from 'express';
import { Namespace as SocketIONamespace, Server as SocketIOServer, Socket as SocketIOSocket } from 'socket.io';

import { ClientContest, ClientProblem, ClientProblemCompletionState, ClientRound, ClientSubmission, ContestUpdateSubmissionResult, ServerSocket } from './clients';
import config from './config';
import { AccountOpResult, Database, Score, ScoreState, Submission, TeamOpResult } from './database';
import Grader from './grader';
import Logger, { NamedLogger } from './log';
import { validateRecaptcha } from './recaptcha';
import Scorer from './scorer';
import { isUUID, reverse_enum, UUID } from './util';
import 'crypto';

/**
 * `ContestManager` handles automatic contest running and interfacing with clients.
 * It will automatically start and stop contests, advance rounds, and process submissions and leaderboards.
 */
export class ContestManager {
    readonly #sockets: Set<ServerSocket> = new Set();
    readonly #contests: Map<string, ContestHost> = new Map();
    readonly #updateLoop: NodeJS.Timeout;

    readonly db: Database;
    readonly app: Express;
    readonly io: SocketIOServer;
    readonly logger: NamedLogger;
    readonly #grader: Grader;

    #open = true;

    /**
     * @param {Database} db Database connection
     * @param {express} app Express app (HTTP server) to attach API to
     * @param {SocketIOServer} io Socket.IO server
     * @param {Grader} grader Grading system to use
     * @param {Logger} logger Logger instance
     */
    constructor(db: Database, app: Express, io: SocketIOServer, grader: Grader, logger: Logger) {
        this.db = db;
        this.app = app;
        this.io = io;
        this.logger = new NamedLogger(logger, 'ContestManager');
        this.#grader = grader;
        this.app.get('/api/contestList', async (req, res) => {
            const data = await this.db.readContests({ startTime: { op: '>', v: Date.now() } });
            if (data === null) res.sendStatus(500);
            else res.json(data.map((item) => item.id));
        });

        // auto-starting contest
        let reading = false;
        this.#updateLoop = setInterval(async () => {
            if (reading) return;
            reading = true;
            // start any contests that haven't been started
            const contests = await this.db.readContests({
                startTime: { op: '>=', v: Date.now() },
                endTime: { op: '<', v: Date.now() },
            });
            if (contests == null) {
                this.logger.error('Could not read contest list!');
                return;
            }
            for (const contest of contests) {
                if (!this.#contests.has(contest.id)) {
                    // check here so no crash
                    if (config.contests[contest.type] === undefined) {
                        this.logger.error(`Could not load contest "${contest.id}", unconfigured contest type "${contest.type}"!`);
                        continue;
                    }
                    const host = new ContestHost(contest.type, contest.id, this.io, this.db, this.#grader, this.logger.logger);
                    this.#contests.set(contest.id, host);
                    host.onended(() => this.#contests.delete(contest.id));
                    this.#sockets.forEach(async (socket) => {
                        const userData = await this.db.getAccountData(socket.username);
                        if (userData == AccountOpResult.NOT_EXISTS || userData == AccountOpResult.ERROR) {
                            this.logger.warn(`Could not fetch data for ${socket.username}`);
                            return;
                        }
                        if (userData.registrations.includes(contest.id)) host.addSocket(socket);
                    });
                }
            }
            reading = false;
        }, 60000);
    }

    /**
     * Add a username-linked SocketIO connection to the user list.
     * @param {ServerSocket} s SocketIO connection (with modifications)
     */
    async addUser(s: ServerSocket): Promise<void> {
        if (!this.#open) return;
        const socket = s;

        // make sure the user actually exists (otherwise bork)
        const userData = await this.db.getAccountData(socket.username);
        if (userData == AccountOpResult.NOT_EXISTS || userData == AccountOpResult.ERROR) return;

        // new event handlers
        socket.removeAllListeners('registerContest');
        socket.removeAllListeners('unregisterContest');
        socket.on('registerContest', async (data: { contest: string, token: string }, cb: (res: TeamOpResult) => any) => {
            if (data == null || typeof data.contest != 'string' || typeof data.token != 'string' || typeof cb != 'function') {
                socket.kick('invalid registerContest payload');
                return;
            }
            if (config.debugMode) socket.logWithId(this.logger.logger.info, 'Registering contest: ' + data.contest);
            const recaptchaResponse = await validateRecaptcha(data.token, socket.ip);
            if (recaptchaResponse instanceof Error) {
                this.logger.error('reCAPTCHA verification failed:');
                this.logger.error(recaptchaResponse.message);
                if (recaptchaResponse.stack) this.logger.error(recaptchaResponse.stack);
                cb(TeamOpResult.INCORRECT_CREDENTIALS);
                return;
            } else if (recaptchaResponse == undefined || recaptchaResponse.success !== true || recaptchaResponse.score < 0.8) {
                if (config.debugMode) socket.logWithId(this.logger.logger.debug, `reCAPTCHA verification failed:\n${JSON.stringify(recaptchaResponse)}`);
                cb(TeamOpResult.INCORRECT_CREDENTIALS);
                return;
            } else if (config.debugMode) socket.logWithId(this.logger.logger.debug, `reCAPTCHA verification successful:\n${JSON.stringify(recaptchaResponse)}`);
            // check valid team size and exclusion lists
            const contestData = await this.db.readContests({ id: data.contest });
            const teamData = await this.db.getTeamData(socket.username);
            const userData = await this.db.getAccountData(socket.username);
            if (contestData == null || contestData.length != 1) {
                cb(TeamOpResult.ERROR);
                return;
            }
            if (typeof teamData != 'object') {
                cb(teamData);
                return;
            }
            if (typeof userData != 'object') {
                cb(userData == AccountOpResult.NOT_EXISTS ? TeamOpResult.NOT_EXISTS : TeamOpResult.ERROR);
                return;
            }
            if (contestData[0].maxTeamSize < teamData.members.length) {
                cb(TeamOpResult.CONTEST_MEMBER_LIMIT);
                return;
            }
            // very long code to check for conflicts
            for (const r of userData.registrations) {
                const contest = await this.db.readContests({ id: r });
                if (contest == null || contest.length != 1) {
                    cb(TeamOpResult.ERROR);
                    return;
                }
                if (contest[0].exclusions.includes(data.contest)) {
                    cb(TeamOpResult.CONTEST_CONFLICT);
                    return;
                }
            }
            const res = await this.db.registerContest(socket.username, data.contest);
            cb(res);
            if (config.debugMode) socket.logWithId(this.logger.logger.debug, 'Register contest: ' + reverse_enum(AccountOpResult, res));
        });
        socket.on('unregisterContest', async (data: { contest: string }, cb: (res: TeamOpResult) => any) => {
            if (data == null || typeof data.contest != 'string' || typeof cb != 'function') {
                socket.kick('invalid unregisterContest payload');
                return;
            }
            if (config.debugMode) socket.logWithId(this.logger.logger.info, 'Unregistering contest: ' + data.contest);
            const res = await this.db.unregisterContest(socket.username, data.contest);
            cb(res);
            if (config.debugMode) socket.logWithId(this.logger.logger.debug, 'Unregister contest: ' + reverse_enum(AccountOpResult, res));
        });

        // add to contests
        this.#contests.forEach((host, id) => {
            if (userData.registrations.includes(id)) host.addSocket(socket);
        });

        const removeSocket = () => {
            socket.removeAllListeners('registerContest');
            socket.removeAllListeners('unregisterContest');
            socket.removeAllListeners('getSubmissionCode');
            this.#sockets.delete(socket);
        };
        this.#sockets.add(socket);
        socket.on('disconnect', removeSocket);
        socket.on('timeout', removeSocket);
        socket.on('error', removeSocket);
    }

    /**
     * Stops all contests and closes the contest manager
     */
    close() {
        this.#open = false;
        this.#contests.forEach((contest) => contest.end());
        this.#grader.close();
        this.#sockets.forEach((socket) => {
            socket.removeAllListeners('registerContest');
            socket.removeAllListeners('unregisterContest');
        });
        clearInterval(this.#updateLoop);
    }
}

/**Slightly modified version of {@link database.Contest} */
export interface ContestContest {
    readonly id: string
    rounds: ContestRound[]
    startTime: number
    endTime: number
}
/**Slightly modified version of {@link database.Round} */
export interface ContestRound {
    readonly id: UUID
    readonly contest: string
    readonly number: number
    problems: UUID[]
    startTime: number
    endTime: number
}
/**Slightly modified version of {@link database.Problem} */
export interface ContestProblem {
    readonly id: string
    readonly contest: string
    readonly round: number
    readonly number: number
    name: string
    author: string
    content: string
    constraints: { memory: number, time: number }
}

/**
 * Socket.IO connection with a reference to the original "spawning" connection, similar to ServerSocket but within contest namespace.
 * @ignore
 */
export interface ContestSocket extends ServerSocket {
    linkedSocket: ServerSocket;
}

export function createContestSocket(socket: SocketIOSocket, linkedSocket: ServerSocket) {
    const s2 = socket as ContestSocket;
    s2.kick = function (reason) {
        linkedSocket.kick(reason);
        socket.removeAllListeners();
        socket.disconnect();
    };
    s2.logWithId = linkedSocket.logWithId;
    s2.ip = linkedSocket.ip;
    s2.username = linkedSocket.ip;
    return s2;
}

/**
 * Module of `ContestManager` containing hosting for individual contests, including handling submissions.
 * Creates a SocketIO namespace for client contest managers to connect to on top of the default namespace connection.
 */
export class ContestHost {
    readonly sid: string;
    readonly contestType: string;
    readonly id: string;
    readonly io: SocketIONamespace;
    readonly db: Database;
    readonly grader: Grader;
    readonly scorer: Scorer;
    readonly logger: NamedLogger;
    #contest: ContestContest;
    #index: number = 0;
    #active: boolean = false;
    #ended: boolean = false;
    #updateLoop: NodeJS.Timeout | undefined = undefined;

    readonly #users: Map<string, { sockets: Set<ServerSocket>, internalSockets: Set<ContestSocket> }> = new Map();
    readonly #pendingConnections: Map<string, ServerSocket> = new Map();
    readonly #pendingConnectionsInverse: Map<ServerSocket, string> = new Map();

    /**
     * @param {string} type Contest type Id
     * @param {string} id Contest id of contest
     * @param {SocketIOServer} io Socket.IO server to use for client broadcasting
     * @param {Database} db Database connection
     * @param {Grader} grader Grader management instance to use for grading
     * @param {Logger} logger Logger instance
     */
    constructor(type: string, id: string, io: SocketIOServer, db: Database, grader: Grader, logger: Logger) {
        this.sid = Array.from(new Array(8), () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 36))).join('');
        if (config.contests[type] === undefined) throw new ReferenceError(`Contest type "${type}" does not exist in configuration`);
        this.contestType = type;
        this.id = id;
        this.io = io.of(`contest-${this.sid}/`);
        this.db = db;
        this.grader = grader;
        this.scorer = new Scorer([], logger);
        this.logger = new NamedLogger(logger, `ContestHost-${this.contestType}-${this.sid}`);
        this.#contest = {
            id: id,
            rounds: [],
            startTime: Infinity,
            endTime: Infinity
        };
        this.io.on('connection', async (s) => {
            s.handshake.headers['x-forwarded-for'] ??= '127.0.0.1';
            const ip = typeof s.handshake.headers['x-forwarded-for'] == 'string' ? s.handshake.headers['x-forwarded-for'].split(',')[0].trim() : s.handshake.headers['x-forwarded-for'][0].trim();
            console.log('contest ocnncetion');
            s.once('auth', (auth: { username: string, token: string }, cb: (res: boolean) => any) => {
                if (auth == null || typeof auth.username != 'string' || typeof auth.token != 'string' || !this.#pendingConnections.has(auth.token)
                    || auth.username !== this.#pendingConnections.get(auth.token)!.username || typeof cb != 'function') {
                    this.logger.logger.warn(`${auth?.username} @ ${ip} | Kicked for violating restrictions: invalid ContestHost namespace authentication`);
                    s.removeAllListeners();
                    s.disconnect();
                    return;
                }
                const socket = createContestSocket(s, this.#pendingConnections.get(auth.token)!);
                this.#pendingConnectionsInverse.delete(this.#pendingConnections.get(auth.token)!);
                this.#pendingConnections.delete(auth.token);

                this.#addInternalSocket(socket);
                cb(true);
            });
        });
        this.reload();
    }

    /**
     * Get a copy of the internal data.
     */
    get data(): ContestContest {
        return structuredClone(this.#contest);
    }
    /**
     * Reload the contest data from the database, also updating clients.
     * Will re-calculate the current round as well.
     */
    async reload(): Promise<void> {
        this.logger.info(`Reloading contest data "${this.id}"`);
        clearInterval(this.#updateLoop);
        const contest = await this.db.readContests({ id: this.id });
        if (contest == null || contest.length == 0) {
            if (contest == null) this.logger.error(`Database error`);
            else this.logger.error(`Contest "${this.id}" does not exist`);
            this.end();
            return;
        }
        const rounds = await this.db.readRounds({ id: contest[0].rounds });
        if (rounds === null) {
            this.logger.error(`Database error`);
            this.end();
            return;
        }
        this.scorer.setRounds(rounds);
        const mapped: ContestRound[] = [];
        for (let i in contest[0].rounds) {
            const round = rounds.find((r) => r.id === contest[0].rounds[i]);
            if (round === undefined) {
                this.logger.error(`Contest "${this.id}" missing round: ${contest[0].rounds[i]}`);
                this.end();
                return;
            }
            mapped.push({
                id: round.id,
                contest: this.id,
                number: Number(i),
                problems: round.problems,
                startTime: round.startTime,
                endTime: round.endTime
            });
        }
        this.#contest = {
            id: this.id,
            rounds: mapped,
            startTime: contest[0].startTime,
            endTime: contest[0].endTime
        };
        this.updateAllUsers();
        // reload the scoreboard too
        const users = await this.db.getAllRegisteredUsers(this.id);
        if (users == null) {
            this.logger.error(`Database error`);
            this.end();
            return;
        }
        const submissions = await this.db.readSubmissions({ contest: { contest: this.#contest.id }, username: users, analysis: false });
        if (submissions === null) {
            this.logger.error(`Database error`);
            this.end();
            return;
        }
        for (const sub of submissions) {
            this.scorer.updateUser(sub);
        }
        // re-index the contest
        this.#index = -1;
        this.#active = false;
        const now = Date.now();
        if (this.#contest.startTime > now || this.#contest.endTime <= now) {
            this.end();
            return;
        }
        for (let i = 0; i < this.#contest.rounds.length; i++) {
            if (this.#contest.rounds[i].startTime <= now) {
                this.#index = i;
                this.#active = this.#contest.rounds[i].endTime > now;
            } else break;
        }
        this.logger.info(`Contest ${this.#contest.id} - Indexed to round ${this.#index}`);
        let scorerUpdateModulo = 0;
        let lastScores: Map<string, number> | undefined = undefined;
        this.#updateLoop = setInterval(() => {
            const now = Date.now();
            let updated = false;
            if (this.#index >= 0 && this.#contest.rounds[this.#index].endTime <= now && this.#active) {
                updated = true;
                this.#active = false;
                this.logger.info(`Contest ${this.#contest.id} - Round ${this.#index} end`);
            }
            if (this.#contest.rounds[this.#index + 1] != undefined && this.#contest.rounds[this.#index + 1].startTime <= now) {
                updated = true;
                this.#index++;
                this.#active = true;
                this.logger.info(`Contest ${this.#contest.id} - Round ${this.#index} start`);
            }
            if (updated) this.updateAllUsers();
            if (this.#contest.endTime <= Date.now()) this.end(true);
            // also updating the scorer occasionally
            scorerUpdateModulo++;
            if (scorerUpdateModulo % 200 == 0) {
                if (Date.now() + (config.contests[this.contestType].scoreFreezeTime * 60000) < this.#contest.endTime) lastScores = this.scorer.getScores();
                if (lastScores != undefined) this.io.to(this.sid).emit('scoreboard', Array.from(lastScores.entries()).map((([u, s]) => ({ username: u, score: s }))).sort((a, b) => b.score - a.score));
            }
        }, 50);
    }

    /**
     * Index of the current round (zero-indexed).
     */
    get round(): number {
        return this.#index;
    }
    /**
     * Get if a particular problem ID is submittable.
     * @param {UUID} id Problem ID
     * @returns 
     */
    problemSubmittable(id: UUID): boolean {
        return this.#active && this.#contest.rounds[this.#index].problems.includes(id);
    }
    /**
     * Update all users in contest with latest contest data.
     */
    async updateAllUsers(): Promise<void> {
        await Promise.all(Array.from(this.#users.keys()).map((username) => this.updateUser(username)));
    }
    /**
     * Only update users under a team with the latest contest data.
     * @param {string} username Username
     */
    async updateUser(username: string): Promise<void> {
        if (this.#users.has(username)) {
            try {
                const team = await this.db.getAccountTeam(username);
                if (typeof team != 'string') throw new Error(`Database error while reading team data (${username})`);
                const userRounds: ClientRound[] = await Promise.all(this.#contest.rounds.map(async (round): Promise<ClientRound> => {
                    if (round.number <= this.#index) {
                        const userProblems: ClientProblem[] = await Promise.all(round.problems.map(async (id, i): Promise<ClientProblem> => {
                            // submissions go under team names
                            const problemData = await this.db.readProblems({ id: id });
                            const submissionData = await this.db.readSubmissions({ id: id, username: team, analysis: false });
                            if (problemData == null || submissionData == null) throw new Error(`Database error while reading problems and submissions (Round ${round.id} Problem ${id})`);
                            if (problemData.length == 0) throw new Error(`Problem not found (Round ${round.id} Problem ${id})`);
                            // mapping submissions is messy, submissions empty of there are no past submissions
                            // otherwise concatenate with reverse history array
                            return {
                                id: problemData[0].id,
                                contest: this.#contest.id,
                                round: round.number,
                                number: i,
                                name: problemData[0].name,
                                author: problemData[0].author,
                                content: problemData[0].content,
                                constraints: problemData[0].constraints,
                                submissions: (submissionData.length > 0) ? [{
                                    time: submissionData[0].time,
                                    lang: submissionData[0].lang,
                                    scores: submissionData[0].scores,
                                    status: this.#getCompletionState(round.number, submissionData[0].scores)
                                }, ...submissionData[0].history.reverse().map((sub): ClientSubmission => ({
                                    time: sub.time,
                                    lang: sub.lang,
                                    scores: sub.scores,
                                    status: this.#getCompletionState(round.number, sub.scores)
                                }))] : [],
                                status: this.#getCompletionState(round.number, submissionData[0]?.scores)
                            };
                        }));
                        return {
                            contest: round.contest,
                            number: round.number,
                            problems: userProblems,
                            startTime: round.startTime,
                            endTime: round.endTime
                        };
                    } else {
                        return {
                            contest: round.contest,
                            number: round.number,
                            problems: [],
                            startTime: round.startTime,
                            endTime: round.endTime
                        };
                    }
                }));
                const userContest: ClientContest = {
                    id: this.#contest.id,
                    rounds: userRounds,
                    startTime: this.#contest.startTime,
                    endTime: this.#contest.endTime
                };
                this.io.to(username).emit('contestData', userContest);
                try {
                    if (global.gc) global.gc();
                } catch { }
            } catch (err) {
                this.logger.handleError('Error while sending updated contest data to client', err);
            }
        }
    }
    #getCompletionState(round: number, scores: Score[] | undefined): ClientProblemCompletionState {
        // will not reveal verdict until round ends!
        if (scores == undefined) return ClientProblemCompletionState.NOT_UPLOADED;
        if (config.contests[this.contestType].withholdResults && round == this.#index) return ClientProblemCompletionState.UPLOADED;
        if (scores.length == 0) return ClientProblemCompletionState.SUBMITTED;
        const subtasks = new Map<number, boolean>();
        scores.forEach((score) => {
            if (subtasks.get(score.subtask) !== false) {
                subtasks.set(score.subtask, score.state == ScoreState.CORRECT);
            }
        });
        const hasPass = Array.from(subtasks.keys()).some((subtask) => subtasks.get(subtask) === true);
        const hasFail = scores.some((score) => score.state != ScoreState.CORRECT);
        if (hasPass && !hasFail) return ClientProblemCompletionState.GRADED_PASS;
        if (hasPass) return ClientProblemCompletionState.GRADED_PARTIAL;
        return ClientProblemCompletionState.GRADED_FAIL;
    }

    /**
     * Add a username-linked SocketIO connection to the user list.
     * @param {ServerSocket} s SocketIO connection (with modifications)
     */
    addSocket(s: ServerSocket): void {
        const socket = s;

        if (this.#users.has(socket.username)) this.#users.get(socket.username)!.sockets.add(socket);
        else this.#users.set(socket.username, { sockets: new Set([socket]), internalSockets: new Set() });
        socket.join(this.sid);
        socket.on('disconnect', () => this.removeSocket(socket));
        socket.on('timeout', () => this.removeSocket(socket));
        socket.on('error', () => this.removeSocket(socket));

        // prompt connection to namespace
        const authToken = crypto.randomUUID();
        this.#pendingConnections.set(authToken, socket);
        this.#pendingConnectionsInverse.set(socket, authToken);
        socket.emit('joinContestHost', { type: this.contestType, sid: this.sid, token: authToken });
        if (config.debugMode) socket.logWithId(this.logger.debug, `Prompted to join ContestHost namespace "contest-${this.sid}"`, true);
    }
    /**
     * Add an internal SocketIO connection (within the contest namespace) to the user list.
     * @param {ContestSocket} s SocketIO connection within the namespace (with modifications)
     */
    #addInternalSocket(s: ContestSocket): void {
        if (s.nsp.name !== this.io.name) throw new TypeError(`Socket supplied is not within the ContestHost namespace (expected "${this.io.name}", got"${s.nsp.name}`);

        const socket = s;

        if (this.#users.has(socket.username)) this.#users.get(socket.username)!.internalSockets.add(socket);
        else this.#users.set(socket.username, { sockets: new Set(), internalSockets: new Set([socket]) });
        socket.on('disconnect', () => this.#removeInternalSocket(socket));
        socket.on('timeout', () => this.#removeInternalSocket(socket));
        socket.on('error', () => this.#removeInternalSocket(socket));

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
            if (Buffer.byteLength(submission.file, 'utf8') > config.contests[this.contestType].maxSubmissionSize) {
                respond(ContestUpdateSubmissionResult.FILE_TOO_LARGE);
                return;
            }
            if (!config.contests[this.contestType].acceptedSolverLanguages.includes(submission.lang)) {
                respond(ContestUpdateSubmissionResult.LANGUAGE_NOT_ACCEPTABLE);
                return;
            }
            const problems = await this.db.readProblems({ id: submission.id });
            if (problems === null) {
                respond(ContestUpdateSubmissionResult.PROBLEM_NOT_SUBMITTABLE);
                return;
            }
            if (!this.problemSubmittable(submission.id)) {
                respond(ContestUpdateSubmissionResult.PROBLEM_NOT_SUBMITTABLE);
                return;
            }
            const teamData = await this.db.getTeamData(socket.username);
            if (typeof teamData != 'object') {
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
            if (!(await this.db.writeSubmission(serverSubmission, config.contests[this.contestType].withholdResults))) {
                respond(ContestUpdateSubmissionResult.ERROR);
                return;
            }
            // submissions are stored under the team
            this.grader.cancelUngraded(teamData.id, submission.id);
            this.grader.queueUngraded(serverSubmission, async (graded) => {
                if (config.debugMode) this.logger.debug(`Submission was returned: ${graded == null ? 'Canceled' : 'Complete'} (by ${socket.username}, team ${teamData.id} for ${submission.id})`);
                if (graded != null) {
                    await this.db.writeSubmission(graded, config.contests[this.contestType].withholdResults);
                    // make sure it gets to all the team
                    const teamData = await this.db.getTeamData(socket.username);
                    if (typeof teamData == 'object') teamData.members.forEach((username) => this.updateUser(username));
                    // score it too (after grading)
                    this.scorer.updateUser(graded, this.#contest.rounds[this.#index].id);
                }
            });
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
            const submission = await this.db.readSubmissions({ username: teamData.id, id: data.id, analysis: false });
            cb(submission?.at(0)?.file ?? '');
        });

        this.updateUser(socket.username);
    }
    /**
     * Remove a previously-added username-linked SocketIO connection from the user list.
     * @param {ServerSocket} socket SocketIO connection (with modifications)
     * @returns {boolean} If the socket was previously within the list of connections
     */
    removeSocket(socket: ServerSocket): boolean {
        if (!this.#users.has(socket.username)) return false;
        const user = this.#users.get(socket.username)!;
        if (user.sockets.has(socket)) {
            socket.leave(this.sid);
            user.sockets.delete(socket);
            if (this.#pendingConnectionsInverse.has(socket)) {
                this.#pendingConnections.delete(this.#pendingConnectionsInverse.get(socket)!);
                this.#pendingConnectionsInverse.delete(socket);
            }
            if (user.sockets.size == 0) {
                // there shouldn't be extra internal sockets, but delete anyway
                user.internalSockets.forEach((s) => this.#removeInternalSocket(s));
                this.#users.delete(socket.username);
            }
            return true;
        }
        return false;
    }
    /**
     * Remove a previously-added internal SocketIO connection from the user list.
     * @param {ContestSocket} socket SocketIO connection (with modifications)
     * @returns {boolean} If the socket was previously within the list of connections
     */
    #removeInternalSocket(socket: ContestSocket): boolean {
        if (!this.#users.has(socket.username)) return false;
        const user = this.#users.get(socket.username)!;
        if (user.internalSockets.has(socket)) {
            socket.removeAllListeners('updateSubmission');
            user.internalSockets.delete(socket);
            return true;
        }
        return false;
    }

    #endListeners: Set<() => any> = new Set();
    /**
     * Stop the running contest and remove all users.
     * @param {boolean} complete Mark the contest as ended in database (contest cannot be restarted)
     */
    end(complete?: boolean) {
        if (this.#ended) return;
        this.#ended = true;
        if (complete) {
            this.logger.info(`Ending contest "${this.id}"`);
            this.db.finishContest(this.id);
        }
        this.#users.forEach((s) => s.sockets.forEach((u) => this.removeSocket(u)));
        this.#endListeners.forEach((cb) => cb());
    }
    /**
     * Add a listener for when the contest ends.
     * @param {() => any} cb Callback listener
     */
    onended(cb: () => any) {
        this.#endListeners.add(cb);
    }
}

export default ContestManager;