import { Express } from 'express';
import { Server as SocketIOServer } from 'socket.io';

import config from './config';
import { AccountOpResult, AdminPerms, Database, isUUID, reverse_enum, Round, Submission, TeamOpResult, UUID } from './database';
import Grader from './grader';
import DomjudgeGrader from './domjudgeGrader';
import Logger from './log';
import { validateRecaptcha } from './recaptcha';
import { ServerSocket } from './socket';

/**User info */
interface ContestUser {
    /**username */
    username: string
    /**email address */
    email: string
    /**display name*/
    displayName: string
    /**contests they are registered for */
    registrations: string[]
    /**set of connections (since multiple users may use the same account(maybe)) */
    sockets: Set<ServerSocket>
}

//user-facing contest manager
//actual grading is done with the Grader class
export class ContestManager {
    readonly #users: Map<string, ContestUser> = new Map();
    readonly #grader: Grader;

    readonly #contests: Map<string, RunningContest> = new Map();

    readonly db: Database;
    readonly app: Express;
    readonly io: SocketIOServer;
    readonly logger: Logger;

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
        this.logger = logger;
        this.#grader = new DomjudgeGrader(app, logger, db);

        // split individual contests to running contest class

        // SEE NETWORK DOCUMENTATION
        // SEE NETWORK DOCUMENTATION

        // cache the contests too

        //make sure this isn't accidentally left running when the object is deleted
        //make sure this isn't accidentally left running when the object is deleted
        //make sure this isn't accidentally left running when the object is deleted
        //make sure this isn't accidentally left running when the object is deleted
        //interval to check for new submissions from grader
        const interval = setInterval(() => {
            //new submissions
            const newSubmissions = this.#grader.getNewGradedSubmissions();
            for (const s of newSubmissions) {
                this.io.to(s.username).emit('submissionStatus', {
                    status: {
                        time: s.time,
                        scores: s.scores
                    }
                });
                this.db.writeSubmission(s);
            }
        }, 1000);
        //make sure this isn't accidentally left running when the object is deleted
        //make sure this isn't accidentally left running when the object is deleted
        //make sure this isn't accidentally left running when the object is deleted

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
    async addUser(s: ServerSocket): Promise<number> {
        const socket = s;

        // make sure the user actually exists (otherwise bork)
        const userData = await this.db.getAccountData(socket.username);
        if (userData == AccountOpResult.NOT_EXISTS || userData == AccountOpResult.ERROR) return 0;

        // new event handlers
        socket.on('registerContest', async (request: { contest: string, token: string }) => {
            if (request == null || typeof request.contest !== 'string' || typeof request.token !== 'string') {
                socket.kick('invalid registerContest payload');
                return;
            }
            if (config.debugMode) socket.logWithId(this.logger.info, 'Registering contest: ' + request.contest);
            const recaptchaResponse = await validateRecaptcha(request.token, socket.ip);
            if (recaptchaResponse instanceof Error) {
                this.logger.error('reCAPTCHA verification failed:');
                this.logger.error(recaptchaResponse.message);
                if (recaptchaResponse.stack) this.logger.error(recaptchaResponse.stack);
                socket.emit('registerContestResponse', TeamOpResult.INCORRECT_CREDENTIALS);
                return;
            } else if (recaptchaResponse == undefined || recaptchaResponse.success !== true || recaptchaResponse.score < 0.8) {
                if (config.debugMode) socket.logWithId(this.logger.debug, `reCAPTCHA verification failed:\n${JSON.stringify(recaptchaResponse)}`);
                socket.emit('registerContestResponse', TeamOpResult.INCORRECT_CREDENTIALS);
                return;
            } else if (config.debugMode) socket.logWithId(this.logger.debug, `reCAPTCHA verification successful:\n${JSON.stringify(recaptchaResponse)}`);
            // check valid team size and exclusion lists
            const contestData = await this.db.readContests(request.contest);
            const teamData = await this.db.getTeamData(socket.username);
            const userData = await this.db.getAccountData(socket.username);
            if (contestData == null || contestData.length != 1) {
                socket.emit('registerContestResponse', TeamOpResult.ERROR);
                return;
            }
            if (typeof teamData != 'object') {
                socket.emit('registerContestResponse', teamData);
                return;
            }
            if (typeof userData != 'object') {
                socket.emit('registerContestResponse', userData == AccountOpResult.NOT_EXISTS ? TeamOpResult.NOT_EXISTS : TeamOpResult.ERROR);
                return;
            }
            if (contestData[0].maxTeamSize < teamData.members.length) {
                socket.emit('registerContestResponse', TeamOpResult.CONTEST_MEMBER_LIMIT);
                return;
            }
            // very long code to check for conflicts
            for (const r of userData.registrations) {
                const contest = await this.db.readContests(r);
                if (contest == null || contest.length != 1) {
                    socket.emit('registerContestResponse', TeamOpResult.ERROR);
                    return;
                }
                if (contest[0].exclusions.includes(request.contest)) {
                    socket.emit('registerContestResponse', TeamOpResult.CONTEST_CONFLICT);
                    return;
                }
            }
            const res = await this.db.registerContest(socket.username, request.contest);
            socket.emit('registerContestResponse', res);
            if (config.debugMode) socket.logWithId(this.logger.debug, 'Register contest: ' + reverse_enum(AccountOpResult, res));
        });
        socket.on('unregisterContest', async (request: { contest: string }) => {
            if (request == null || typeof request.contest !== 'string') {
                socket.kick('invalid unregisterContest payload');
                return;
            }
            if (config.debugMode) socket.logWithId(this.logger.info, 'Unregistering contest: ' + request.contest);
            const res = await this.db.unregisterContest(socket.username, request.contest);
            socket.emit('registerContestResponse', res);
            if (config.debugMode) socket.logWithId(this.logger.debug, 'Unregister contest: ' + reverse_enum(AccountOpResult, res));
        });

        socket.on('updateSubmission', async (data: { id: string, file: string, lang: string }) => {
            // also need to check valid language, valid problem id
            if (data == null || typeof data.id !== 'string' || typeof data.file !== 'string' || typeof data.lang !== 'string' || isUUID(data.id)) {
                socket.kick('invalid updateSubmission payload');
                return;
            }
            if (config.debugMode) socket.logWithId(this.logger.debug, 'Update submission: ' + data.id);
            const respond = (success: boolean, message: string) => {
                if (config.debugMode) socket.logWithId(this.logger.debug, `Update submission: ${data.id} - ${success ? 'success' : 'fail'}: ${message}`);
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
            const canViewAllProblems = await this.db.hasPerms(socket.username, AdminPerms.VIEW_PROBLEMS);
            if (problems[0].hidden && !canViewAllProblems) {
                socket.kick('attempt to view hidden problem');
                return;
            }
            if (!Array.from(this.#contests.values()).some((contest) => contest.containsActiveProblem(data.id))) {
                respond(false, 'problem currently not submittable');
                return;
            }
            const submission: Submission = {
                username: socket.username,
                problemId: data.id,
                file: data.file,
                lang: data.lang,
                scores: [],
                history: [], // this doesn't matter
                time: Date.now()
            };
            this.#grader.queueSubmission(submission);
            if (!(await this.db.writeSubmission(submission))) {
                respond(false, 'database error');
                return;
            }
        });

        // add to user list and return after attaching listeners
        if (config.debugMode) this.logger.debug(`[ContestManager] Adding ${socket.username} to contest list`);
        socket.join(socket.username);
        // NOTE: ALIASES (teams) JOIN ROOM WITH TEAM CREATOR USERNAME
        const removeSelf = () => {
            socket.leave(socket.username);
            if (this.#users.has(socket.username)) {
                this.#users.get(socket.username)!.sockets.delete(socket);
                if (this.#users.get(socket.username)!.sockets.size == 0) this.#users.delete(socket.username);
            }
        };
        socket.on('disconnect', removeSelf);
        socket.on('timeout', removeSelf);
        socket.on('error', removeSelf);
        // note: always add user to running contest list no matter what to ensure socket.io room join
        if (this.#users.has(socket.username)) return this.#users.get(socket.username)!.sockets.add(socket).size;
        this.#users.set(socket.username, {
            username: socket.username,
            email: userData.email,
            displayName: userData.displayName,
            registrations: userData.registrations,
            sockets: new Set<ServerSocket>().add(socket)
        });
        return 1;
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
    problems: ContestProblem[]
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

class RunningContest {
    readonly id;
    readonly db: Database;
    readonly logger: Logger;
    #data: ContestContest;
    #index: number = 0;
    readonly #sid: string;

    readonly #users: Map<string, ContestUser> = new Map();

    constructor(id: string, db: Database, logger: Logger) {
        this.id = id;
        this.db = db;
        this.logger = logger;
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
        this.logger.info(`[RunningContest] Reloading contest data "${this.id}"`);
        const contest = await this.db.readContests(this.id);
        if (contest == null || contest.length == 0) {
            if (contest == null) this.logger.error(`[RunningContest] Database error`);
            else this.logger.error(`[RunningContest] Contest "${this.id}" does not exist`);
            this.end();
            return;
        }
        const rounds = await this.db.readRounds({ id: contest[0].rounds });
        if (rounds === null) {
            this.logger.error(`[RunningContest] Database error`);
            this.end();
            return;
        }
        const mappedRounds = await Promise.all(rounds.map(async (round, i): Promise<ContestRound | null> => {
            const problems = await this.db.readProblems({ id: round.problems });
            if (problems === null) {
                this.logger.error(`[RunningContest] Database error`);
                return null;
            }
            return {
                id: round.id,
                contest: this.id,
                number: i,
                problems: problems.map((problem, j): ContestProblem => ({
                    id: problem.id,
                    contest: this.id,
                    round: i,
                    number: j,
                    name: problem.name,
                    author: problem.author,
                    content: problem.author,
                    constraints: problem.constraints
                })),
                startTime: round.startTime,
                endTime: round.endTime
            };
        }));
        const stupidFix: ContestRound[] = [];
        for (const r of mappedRounds) {
            if (r != null) stupidFix.push(r);
            else {
                this.end();
                return;
            }
        }
        this.#data = {
            id: this.id,
            rounds: stupidFix,
            startTime: contest[0].startTime,
            endTime: contest[0].endTime
        }
    }

    activeRound(): Round {
        const r = this.#data.rounds[this.#index];
        return {
            id: r.id,
            problems: r.problems.map((p) => p.id),
            startTime: r.startTime,
            endTime: r.endTime
        };
    }
    containsActiveProblem(id: string): boolean {
        return this.#data.rounds[this.#index].problems.some((p) => p.id === id);
    }

    addUser(user: ContestUser): void {
        this.#users.set(user.username, user);
        user.sockets.forEach((socket) => socket.join(this.#sid))
    }
    removeUser(user: ContestUser): boolean {
        if (this.#users.has(user.username)) user.sockets.forEach((socket) => socket.leave(this.#sid));
        return this.#users.delete(user.username);
    }

    end() {
        this.#users.forEach((u) => this.removeUser(u));
    }
}

export default ContestManager;