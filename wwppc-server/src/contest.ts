import { Express } from 'express';
import { Server as SocketIOServer } from 'socket.io';

import config from './config';
import { AccountOpResult, AdminPerms, Database, isUUID, Problem, reverse_enum, Round, Score } from './database';
import { DomjudgeGrader, Grader } from './grader';
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
        const rounds = await this.db.readRounds({});
        if (rounds === null) return null;
        const contests = new Map<string, number>();
        for (const r of rounds) contests.set(r.contest, Math.min(contests.get(r.contest) ?? Infinity, r.startTime));
        contests.forEach((value, key) => {
            if (value < Date.now()) contests.delete(key);
        });
        return Array.from(contests.keys());
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
                socket.emit('registerContestResponse', AccountOpResult.ERROR);
                return;
            } else if (recaptchaResponse == undefined || recaptchaResponse.success !== true || recaptchaResponse.score < 0.8) {
                if (config.debugMode) socket.logWithId(this.logger.debug, `reCAPTCHA verification failed:\n${JSON.stringify(recaptchaResponse)}`);
                socket.emit('registerContestResponse', AccountOpResult.INCORRECT_CREDENTIALS);
                return;
            } else if (config.debugMode) socket.logWithId(this.logger.debug, `reCAPTCHA verification successful:\n${JSON.stringify(recaptchaResponse)}`);
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
            socket.emit('unregisterContestResponse', res);
            if (config.debugMode) socket.logWithId(this.logger.debug, 'Unregister contest: ' + reverse_enum(AccountOpResult, res));
        });

        // REPLACE THESE WITH SERVER-INITIATED BROADCAST (instead of using socket.io as bad fetch)

        //get problem list for running contest
        socket.on('getProblemList', async (request: { contest: string, token: number }) => {
            //check valid contest first
            if (request == null || typeof request.contest !== 'string') {
                socket.kick('invalid getProblemList payload');
                return;
            }
            const rounds = await this.db.readRounds({ contest: request.contest });
            if (rounds == null) {
                socket.emit('contestList', { data: [], token: request.token });
                return;
            }
            const packet: Array<Object> = [];
            const canViewAllRounds = await this.db.hasPerms(socket.username, AdminPerms.VIEW_PROBLEMS);
            for (const round of rounds) {
                if (round.startTime > Date.now() && !canViewAllRounds) {
                    continue;
                }
                // make sure to check submission status for the problems
                const roundProblems = await this.db.readProblems({ contest: { contest: request.contest, round: round.round } });
                const problems: Array<Object> = [];
                for (let p in roundProblems) {
                    if (roundProblems[p].hidden && !canViewAllRounds) {
                        continue;
                    }
                    problems.push({
                        id: roundProblems[p].id,
                        contest: request.contest,
                        round: round.round,
                        number: p,
                        name: roundProblems[p].name,
                        author: roundProblems[p].author,
                        status: 0
                    });
                }
                packet.push({
                    contest: request.contest,
                    number: round.round,
                    problems: problems,
                    startTime: round.startTime,
                    endTime: round.endTime,
                });
            }
            socket.emit('problemList', { data: packet, token: request.token });
        });
        socket.on('getProblemData', async (request: { id: undefined, contest: string, round: number, number: number, token: number } | { id: string, contest: undefined, round: undefined, number: undefined, token: number }) => {
            if (request == null || ((typeof request.contest !== 'string' || typeof request.round !== 'number' || typeof request.number !== 'number') && (typeof request.id !== 'string' || !isUUID(request.id)))) {
                socket.kick('invalid getProblemData payload');
                return;
            }
            let problems: Problem[] | null;
            if (typeof request.id === 'string') problems = await this.db.readProblems({ id: request.id });
            else problems = await this.db.readProblems({ contest: { contest: request.contest, round: request.round, number: request.number } });
            // oopsies, database error
            if (problems === null) {
                socket.emit('problemData', {
                    problem: null,
                    submission: null,
                    token: request.token
                });
                return;
            }
            // note that a hidden problem will override a visible contest
            if (!(await this.db.hasPerms(socket.username, AdminPerms.VIEW_PROBLEMS))) {
                //remove all hidden problems
                problems = problems.filter((p) => !p.hidden);
            }
            if (problems.length !== 1) {
                // problem does not exist or some sort of error and multiple problems matched
                socket.emit('problemData', {
                    problem: null,
                    submission: null,
                    token: request.token
                });
                return;
            }
            const problem = problems[0];
            const userSubmissions = await this.db.readSubmissions({ id: problem.id, username: socket.username });
            let submission: { time: number, scores: Score[] } | null = null;
            if (userSubmissions !== null && userSubmissions.length === 1) {
                submission = {
                    time: userSubmissions[0].time,
                    scores: userSubmissions[0].scores
                };
            }
            socket.emit('problemData', {
                problem: {
                    id: problem.id,
                    contest: request.contest,
                    round: request.round,
                    number: request.number,
                    name: problem.name,
                    author: problem.author,
                    content: problem.content,
                    constraints: problem.constraints,
                    hidden: problem.hidden
                },
                submission: submission,
                token: request.token
            });
        });

        //submit a solution
        socket.on('updateSubmission', async (request: { file: string, contest: string, round: number, number: number, lang: string }) => {
            // needs response event

            // also need to check valid language, valid problem id
            if (request == null || typeof request.contest !== 'string' || typeof request.round !== 'number' || typeof request.number !== 'number' || typeof request.file !== 'string' || typeof request.lang !== 'string') {
                socket.kick('invalid updateSubmission payload');
                return;
            }
            if (request.file.length > 10240) {
                socket.kick('updateSubmission file too large');
                return;
            }
            const problems = await this.db.readProblems({ contest: { contest: request.contest, round: request.round, number: request.number } });
            if (problems === null) return;
            if (problems.length !== 1) {
                socket.kick('invalid updateSubmission contest, round, or problem ID');
                return;
            }
            const canViewAllProblems = await this.db.hasPerms(socket.username, AdminPerms.VIEW_PROBLEMS);
            if (problems[0].hidden && !canViewAllProblems) {
                socket.kick('invalid updateSubmission contest, round, or problem ID');
                return;
            }
            const rounds = await this.db.readRounds({ contest: request.contest, round: request.round });
            if (rounds === null) return;
            //note that we are guaranteed to have a valid round, since we just checked valid problem
            if (rounds[0].startTime > Date.now() || rounds[0].endTime < Date.now()) {
                socket.kick('updateSubmission outside of contest window');
                return;
            }
            this.#grader.queueSubmission({
                username: socket.username,
                problemId: problems[0].id,
                time: Date.now(),
                file: request.file,
                lang: request.lang,
                scores: [],
            });
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

class RunningContest {
    readonly id;
    readonly rounds: Round[];
    #index = 0;

    readonly #users: Map<string, ContestUser> = new Map();

    constructor(id: string, roundsRaw: Round[]) {
        this.id = id;
        this.rounds = roundsRaw.filter(r => r.contest === this.id);
        // timer to step through rounds
    }

    addUser(user: ContestUser): void {
        this.#users.set(user.username, user);
    }
    removeUser(user: ContestUser): boolean {
        return this.#users.delete(user.username);
    }
}

export default ContestManager;