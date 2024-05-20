import { Express } from 'express';
import { Server as SocketIOServer } from 'socket.io';

import config from './config';
import { AccountOpResult, AdminPerms, Database, isUUID, reverse_enum, Round, Submission, TeamOpResult, UUID } from './database';
import Grader, { GraderSubmission } from './grader';
import DomjudgeGrader from './graders/domjudgeGrader';
import Logger, { NamedLogger } from './log';
import { validateRecaptcha } from './recaptcha';
import { ServerSocket } from './socket';
import WwppcGrader from './graders/wwppcGrader';

//user-facing contest manager
//actual grading is done with the Grader class
export class ContestManager {
    readonly #grader: Grader;

    readonly #contests: Map<string, ContestHost> = new Map();

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
    async getContestData(participantView: boolean) {

    }
    // stuff to modify contest stuff too
    // setting round start/end

    /**
     * Add a username-linked SocketIO connection to the user list.
     * @param {ServerSocket} socket SocketIO connection (with modifications)
     * @returns {number} The number of sockets linked to `username`. If 0, then adding the user was unsuccessful.
     */
    async addUser(s: ServerSocket): Promise<void> {
        const socket = s;

        // make sure the user actually exists (otherwise bork)
        const userData = await this.db.getAccountData(socket.username);
        if (userData == AccountOpResult.NOT_EXISTS || userData == AccountOpResult.ERROR) return;

        // new event handlers
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


        // move to running contest
        socket.on('updateSubmission', async (data: { id: string, file: string, lang: string }) => {
            // also need to check valid language, valid problem id
            if (data == null || typeof data.id != 'string' || typeof data.file != 'string' || typeof data.lang != 'string' || isUUID(data.id)) {
                socket.kick('invalid updateSubmission payload');
                return;
            }
            if (config.debugMode) socket.logWithId(this.logger.logger.debug, 'Update submission: ' + data.id);
            const respond = (success: boolean, message: string) => {
                if (config.debugMode) socket.logWithId(this.logger.logger.debug, `Update submission: ${data.id} - ${success ? 'success' : 'fail'}: ${message}`);
                socket.emit('submissionStatus', success);
            };
            if (data.file.length > 10240) {
                respond(false, 'file too large');
                return;
            }
            const problems = await this.db.readProblems({ id: data.id });
            if (problems === null) {
                respond(false, 'nonexistent problem');
                return;
            }
            const userData = await this.db.getAccountData(socket.username);
            const canViewAllProblems = await this.db.hasPerms(socket.username, AdminPerms.VIEW_PROBLEMS);
            if (problems[0].hidden && !canViewAllProblems) {
                socket.kick('attempt to view hidden problem');
                return;
            }
            if (!Array.from(this.#contests.values()).some((contest) => contest.containsActiveProblem(data.id))) {
                respond(false, 'problem currently not submittable');
                return;
            }
            const submission: GraderSubmission = {
                username: socket.username,
                problemId: data.id,
                file: data.file,
                lang: data.lang,
                time: Date.now(),
                deadline: Date.now() + config.graderTimeout + problems[0].constraints.time * problems[0].cases.length
            };
            const databaseSubmission: Submission = {
                username: socket.username,
                problemId: data.id,
                file: data.file,
                scores: [],
                history: [],
                lang: data.lang,
                time: Date.now()
            };
            this.#grader.queueUngraded(submission);
            if (!(await this.db.writeSubmission(databaseSubmission))) {
                respond(false, 'database error');
                return;
            }
        });

        // get contest list
        // create contest hosts if not exists
        // add user to contest host if registered
        // basically handing off the work
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
    id: string
    contest: string
    round: number
    number: number
    name: string
    author: string
    content: string
    constraints: { memory: number, time: number }
}

class ContestHost {
    readonly id: string;
    readonly io: SocketIOServer;
    readonly db: Database;
    readonly grader: Grader;
    readonly logger: Logger;
    #data: ContestContest;
    #index: number = 0;
    readonly #sid: string;

    readonly #sockets: Set<ServerSocket> = new Set();

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

    get data(): ContestContest {
        return structuredClone(this.data);
    }
    async reload(): Promise<void> {
        this.logger.info(`Reloading contest data "${this.id}"`);
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
        const mapped: ContestRound[] = rounds.map((r, i) => ({
            id: r.id,
            contest: this.id,
            number: i,
            problems: r.problems,
            startTime: r.startTime,
            endTime: r.endTime
        }));
        this.#data = {
            id: this.id,
            rounds: mapped,
            startTime: contest[0].startTime,
            endTime: contest[0].endTime
        };
        // this.io.to(this.#sid).emit()
    }

    get round(): number {
        return this.#index;
    }
    activeRound(): Round {
        const r = this.#data.rounds[this.#index];
        return {
            id: r.id,
            problems: r.problems,
            startTime: r.startTime,
            endTime: r.endTime
        };
    }
    containsActiveProblem(id: string): boolean {
        return this.#data.rounds[this.#index].problems.includes(id);
    }

    async processSubmission(data: { id: string, file: string, lang: string }): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        return 0;
    }

    addSocket(socket: ServerSocket): void {
        this.#sockets.add(socket);
        socket.join(this.#sid);
        socket.on('disconnect', () => this.removeSocket(socket));
        socket.on('timeout', () => this.removeSocket(socket));
        socket.on('error', () => this.removeSocket(socket));

        socket.on('updateSubmission', (data: { id: string, file: string, lang: string }, cb: (res: TeamOpResult) => any) => {

        });

        // send contest data once
    }
    removeSocket(socket: ServerSocket): boolean {
        if (this.#sockets.has(socket)) {
            socket.leave(this.#sid);
            socket.removeAllListeners('updateSubmission');
        }
        return this.#sockets.delete(socket);
    }

    end() {
        this.#sockets.forEach((u) => this.removeSocket(u));
    }
}

export default ContestManager;