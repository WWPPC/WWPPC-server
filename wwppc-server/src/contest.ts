import { Express } from 'express';
import { Server as SocketIOServer } from 'socket.io';

import config from './config';
import {
    AccountOpResult, AdminPerms, Database, isUUID, reverse_enum, Round, Score, ScoreState, Submission,
    TeamOpResult, UUID
} from './database';
import Grader from './grader';
import WwppcGrader from './graders/wwppcGrader';
import Logger, { NamedLogger } from './log';
import { validateRecaptcha } from './recaptcha';
import { ServerSocket } from './socket';

/**
 * `ContestManager` handles all contest interfacing with clients.
 */
export class ContestManager {
    readonly #grader: Grader;

    readonly #sockets: Set<ServerSocket> = new Set();
    readonly #contests: Map<string, ContestHost> = new Map();
    readonly #updateLoop: NodeJS.Timeout;

    readonly db: Database;
    readonly app: Express;
    readonly io: SocketIOServer;
    readonly logger: NamedLogger;

    /**
     * @param {Database} db Database connection
     * @param {express} app Express app (HTTP server) to attach API to
     * @param {SocketIOServer} io Socket.IO server to use for client broadcasting
     * @param {Logger} logger Logger instance
     */
    constructor(db: Database, app: Express, io: SocketIOServer, logger: Logger) {
        this.db = db;
        this.app = app;
        this.io = io;
        this.logger = new NamedLogger(logger, 'ContestManager');
        this.#grader = new WwppcGrader(app, logger, db);
        this.#updateLoop = setInterval(async () => {
            // start any contests that haven't been started
            const contests = await this.db.readContests();
            if (contests == null) {
                this.logger.error('Could not read contest list!');
                return;
            }
            for (const contest of contests) {
                if (contest.startTime <= Date.now() && contest.endTime > Date.now() && !this.#contests.has(contest.id)) {
                    const host = new ContestHost(contest.id, this.io, this.db, this.#grader, this.logger.logger);
                    this.#contests.set(contest.id, host);
                    host.onended(() => this.#contests.delete(contest.id));
                }
            }
        }, 10000);
    }

    /**
     * Fetch a list of upcoming contest IDs.
     * @returns {string[] | null} List of unique contest IDs or null if an error occured
     */
    async getContestList(): Promise<string[] | null> {
        const contests = await this.db.readContests();
        if (contests === null) return null;
        return contests.filter(c => c.startTime > Date.now()).map(c => c.id);
    }

    /**
     * Add a username-linked SocketIO connection to the user list.
     * @param {ServerSocket} s SocketIO connection (with modifications)
     * @returns {number} The number of sockets linked to `username`. If 0, then adding the user was unsuccessful.
     */
    async addUser(s: ServerSocket): Promise<void> {
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
            const contestData = await this.db.readContests(data.contest);
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
                const contest = await this.db.readContests(r);
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

        this.#sockets.add(socket);
    }

    /**
     * Stops all contests and closes the contest manager
     */
    close() {
        this.#contests.forEach((contest) => contest.end());
        this.#sockets.forEach((socket) => {
            socket.removeAllListeners('registerContest');
            socket.removeAllListeners('unregisterContest');
        });
        clearInterval(this.#updateLoop);
    }
}

export interface ContestContest {
    readonly id: string
    rounds: ContestRound[]
    startTime: number
    endTime: number
}
export interface ContestRound {
    readonly id: UUID
    readonly contest: string
    readonly number: number
    problems: UUID[]
    startTime: number
    endTime: number
}
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
interface ClientContest {
    readonly id: string
    rounds: ClientRound[]
    startTime: number
    endTime: number
}
interface ClientRound {
    readonly contest: string
    readonly number: number
    problems: ClientProblem[]
    startTime: number
    endTime: number
}
interface ClientProblem {
    readonly id: string
    readonly contest: string
    readonly round: number
    readonly number: number
    name: string
    author: string
    content: string
    constraints: { memory: number, time: number }
    submissions: ClientSubmission[]
    status: ClientProblemCompletionState
}
interface ClientSubmission {
    time: number
    scores: Score[]
    status: ClientProblemCompletionState
}
enum ClientProblemCompletionState {
    NOT_UPLOADED = 0,
    UPLOADED = 1,
    SUBMITTED = 2,
    GRADED_PASS = 3,
    GRADED_FAIL = 4,
    GRADED_PARTIAL = 5,
    ERROR = 6
}

/**Response codes for submitting to a problem in contest */
export enum ContestUpdateSubmissionResult {
    /**The submission was accepted */
    SUCCESS = 0,
    /**The submission was rejected because the file size was exceeded */
    FILE_TOO_LARGE = 1,
    /**The submission was rejected because the submission language is not acceptable */
    LANGUAGE_NOT_ACCEPTABLE = 2,
    /**The submission was rejected because the target problem is not open to submissions */
    PROBLEM_NOT_SUBMITTABLE = 3,
    /**The submission was rejected because an error occured */
    ERROR = 4
}

/**
 * Subclass of `ContestManager` containing hosting for individual contests, including handling submissions.
 */
export class ContestHost {
    readonly id: string;
    readonly io: SocketIOServer;
    readonly db: Database;
    readonly grader: Grader;
    readonly logger: NamedLogger;
    #data: ContestContest;
    #index: number = 0;
    #active: boolean = false;
    readonly #sid: string;
    #updateLoop: NodeJS.Timeout | undefined = undefined;

    readonly #users: Map<string, Set<ServerSocket>> = new Map();

    /**
     * @param {string} id Contest id of contest
     * @param {SocketIOServer} io Socket.IO server to use for client broadcasting
     * @param {Database} db Database connection
     * @param {Grader} grader Grader management instance to use for grading
     * @param {Logger} logger Logger instance
     */
    constructor(id: string, io: SocketIOServer, db: Database, grader: Grader, logger: Logger) {
        this.id = id;
        this.io = io;
        this.db = db;
        this.grader = grader;
        this.logger = new NamedLogger(logger, 'ContestHost');
        this.#data = {
            id: id,
            rounds: [],
            startTime: Infinity,
            endTime: Infinity
        };
        this.#sid = Math.random().toString();
        this.reload();
    }

    /**
     * Get a copy of the internal data.
     */
    get data(): ContestContest {
        return structuredClone(this.data);
    }
    /**
     * Reload the contest data from the database, also updating clients.
     * Will re-calculate the current round as well.
     */
    async reload(): Promise<void> {
        this.logger.info(`Reloading contest data "${this.id}"`);
        clearInterval(this.#updateLoop);
        const contest = await this.db.readContests(this.id);
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
        this.#data = {
            id: this.id,
            rounds: mapped,
            startTime: contest[0].startTime,
            endTime: contest[0].endTime
        };
        this.updateAllUsers();
        // re-index the contest
        this.#index = -1;
        this.#active = false;
        const now = Date.now();
        if (this.#data.startTime > now || this.#data.endTime <= now) {
            this.end();
            return;
        }
        for (let i = 0; i < this.#data.rounds.length; i++) {
            if (this.#data.rounds[i].startTime <= now) {
                this.#index = i;
                this.#active = this.#data.rounds[i].endTime > now;
            } else break;
        }
        this.logger.info(`Contest ${this.#data.id} - Indexed to round ${this.#index}`)
        this.#updateLoop = setInterval(() => {
            const now = Date.now();
            let updated = false;
            if (this.#index >= 0 && this.#data.rounds[this.#index].endTime <= now && this.#active) {
                updated = true;
                this.#active = false;
                this.logger.info(`Contest ${this.#data.id} - Round ${this.#index} end`);
            }
            if (this.#data.rounds[this.#index + 1] != undefined && this.#data.rounds[this.#index + 1].startTime <= now) {
                updated = true;
                this.#index++;
                this.#active = true;
                this.logger.info(`Contest ${this.#data.id} - Round ${this.#index} start`);
            }
            if (updated) this.updateAllUsers();
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
        return this.#active && this.#data.rounds[this.#index].problems.includes(id);
    }
    /**
     * Update all users in contest with latest contest data.
     */
    async updateAllUsers(): Promise<void> {
        await Promise.all(Array.from(this.#users.keys()).map((username) => this.updateUser(username)));
    }
    /**
     * Only update users under a username with the latest contest data.
     * @param {string} username Username
     */
    async updateUser(username: string): Promise<void> {
        if (this.#users.has(username)) {
            try {
                const userRounds: ClientRound[] = await Promise.all(this.#data.rounds.map(async (round): Promise<ClientRound> => {
                    if (round.number <= this.#index) {
                        const userProblems: ClientProblem[] = await Promise.all(round.problems.map(async (id, i): Promise<ClientProblem> => {
                            const problemData = await this.db.readProblems({ id: id });
                            const submissionData = await this.db.readSubmissions({ id: id, username: username });
                            if (problemData == null || submissionData == null) throw new Error(`Database error (Round ${round.id} Problem ${id})`);
                            if (problemData.length == 0) throw new Error(`Problem not found (Round ${round.id} Problem ${id})`);
                            // mapping submissions is messy, submissions empty of there are no past submissions
                            // otherwise concatenate history behind most recent submission
                            return {
                                id: problemData[0].id,
                                contest: this.#data.id,
                                round: round.number,
                                number: i,
                                name: problemData[0].name,
                                author: problemData[0].author,
                                content: problemData[0].content,
                                constraints: problemData[0].constraints,
                                submissions: (submissionData.length > 0) ? [{
                                    time: submissionData[0].time,
                                    scores: submissionData[0].scores,
                                    status: this.#getCompletionState(round.number, submissionData[0].scores)
                                }, ...submissionData[0].history.map((sub): ClientSubmission => ({
                                    time: sub.time,
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
                    id: this.#data.id,
                    rounds: userRounds,
                    startTime: this.#data.startTime,
                    endTime: this.#data.endTime
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
        if (scores == undefined) return ClientProblemCompletionState.NOT_UPLOADED;
        if (scores.length == 0) return round < this.#index ? ClientProblemCompletionState.SUBMITTED : ClientProblemCompletionState.UPLOADED;
        const hasPass = scores.some((score) => score.state == ScoreState.CORRECT);
        const hasFail = scores.some((score) => score.state != ScoreState.CORRECT);
        if (hasPass && !hasFail) return ClientProblemCompletionState.GRADED_PASS;
        if (hasPass) return ClientProblemCompletionState.GRADED_PARTIAL;
        return ClientProblemCompletionState.GRADED_FAIL;
    }

    /**
     * Add a username-linked SocketIO connection to the user list.
     * @param {ServerSocket} socket SocketIO connection (with modifications)
     */
    addSocket(socket: ServerSocket): void {
        if (this.#users.has(socket.username)) this.#users.get(socket.username)!.add(socket);
        else this.#users.set(socket.username, new Set([socket]));
        socket.join(this.#sid);
        socket.on('disconnect', () => this.removeSocket(socket));
        socket.on('timeout', () => this.removeSocket(socket));
        socket.on('error', () => this.removeSocket(socket));

        // make sure no accidental duping
        socket.removeAllListeners('updateSubmission');
        socket.on('updateSubmission', async (data: { id: string, file: string, lang: string }, cb: (res: ContestUpdateSubmissionResult) => any) => {
            if (data == null || typeof data.id != 'string' || typeof data.file != 'string' || typeof data.lang != 'string' || !isUUID(data.id)) {
                socket.kick('invalid updateSubmission payload');
                return;
            }
            if (config.debugMode) socket.logWithId(this.logger.logger.debug, 'Update submission: ' + data.id);
            const respond = (res: ContestUpdateSubmissionResult) => {
                if (config.debugMode) socket.logWithId(this.logger.logger.debug, `Update submission: ${data.id} - ${reverse_enum(ContestUpdateSubmissionResult, res)}`);
                cb(res);
            };
            if (data.file.length > 10240) {
                respond(ContestUpdateSubmissionResult.FILE_TOO_LARGE);
                return;
            }
            if (!config.acceptedLanguages.includes(data.lang)) {
                respond(ContestUpdateSubmissionResult.LANGUAGE_NOT_ACCEPTABLE);
                return;
            }
            const problems = await this.db.readProblems({ id: data.id });
            if (problems === null) {
                respond(ContestUpdateSubmissionResult.PROBLEM_NOT_SUBMITTABLE);
                return;
            }
            // const userData = await this.db.getAccountData(socket.username);
            const canViewAllProblems = await this.db.hasPerms(socket.username, AdminPerms.VIEW_PROBLEMS);
            if (problems[0].hidden && !canViewAllProblems) {
                socket.kick('attempt to view hidden problem');
                return;
            }
            if (!this.problemSubmittable(data.id)) {
                respond(ContestUpdateSubmissionResult.PROBLEM_NOT_SUBMITTABLE);
                return;
            }
            const submission: Submission = {
                username: socket.username,
                problemId: data.id,
                file: data.file,
                scores: [],
                history: [],
                lang: data.lang,
                time: Date.now()
            };
            this.grader.queueUngraded(submission);            
            if (!(await this.db.writeSubmission(submission))) {
                respond(ContestUpdateSubmissionResult.ERROR);
                return;
            }
            respond(ContestUpdateSubmissionResult.SUCCESS);
        });

        this.updateUser(socket.username);
    }
    removeSocket(socket: ServerSocket): boolean {
        if (this.#users.has(socket.username) && this.#users.get(socket.username)!.has(socket)) {
            socket.leave(this.#sid);
            socket.removeAllListeners('updateSubmission');
            this.#users.get(socket.username)!.delete(socket);
            if (this.#users.get(socket.username)!.size == 0) this.#users.delete(socket.username);
            return true;
        }
        return false;
    }

    #endListeners: Set<() => any> = new Set();
    end() {
        this.logger.info(`Ending contest "${this.id}"`);
        this.#users.forEach((s) => s.forEach((u) => this.removeSocket(u)));
        this.#endListeners.forEach((cb) => cb());
    }
    onended(cb: () => any) {
        this.#endListeners.add(cb);
    }
}

export default ContestManager;