import { Express } from 'express';
import { Server as SocketIOServer } from 'socket.io';

import config from './config';
import { AccountOpResult, AdminPerms, Database, Problem, Score, UUID, isUUID } from './database';
import { DomjudgeGrader, Grader } from './grader';
import Logger from './log';
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

    readonly db: Database;
    readonly app: Express;
    readonly io: SocketIOServer;
    readonly logger: Logger;

    // start/stop rounds, control which problems are visible (and where)
    // also only one contest page open per account
    // use socket.io rooms? put all sockets in contest in room?
    // the user must be signed in and registered for the contest and division of the round/problem AND THE ROUND HAS TO BE ACTIVE

    // make sure to also handle REGISTRATION (update the cached user data when a registration is made!) (call updateUserData)
    // also make sure to tell database to add registration

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
        this.#grader = new DomjudgeGrader(app, logger);

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
     * Add a username-linked SocketIO connection to the user list.
     * @param {ServerSocket} socket SocketIO connection (with modifications)
     * @returns {number} The number of sockets linked to `username`. If 0, then adding the user was unsuccessful.
     */
    async addUser(socket: ServerSocket): Promise<number> {
        // make sure the user actually exists (otherwise bork)
        const userData = await this.db.getAccountData(socket.username);
        if (userData == AccountOpResult.NOT_EXISTS || userData == AccountOpResult.ERROR) return 0;

        // new event handlers
        //toggle registration for a contest (maybe use the #users Map rather than reading from db each time)
        socket.on('registerContest', async (request: { contest: string }) => {
            if (request == null || typeof request.contest !== 'string') {
                socket.kick('invalid registerContest payload');
                return;
            }
            //check if it's a valid contest oof
            if (request.contest !== 'WWPITTEST') {
                return;
            }

            const user = await this.db.getAccountData(socket.username);
            if (user === AccountOpResult.NOT_EXISTS || user === AccountOpResult.ERROR) {
                socket.kick('invalid registerContest username');
                return;
                //this probably shouldnt happen since you signed in with the username
                //also how to handle AccountOpResult.ERROR
            }
            if (user.registrations.includes(request.contest)) {
                user.registrations.splice(user.registrations.indexOf(request.contest), 1);
            } else {
                user.registrations.push(request.contest);
            }
            const res = await this.db.updateAccountData(user.username, user);
            socket.emit('registerContestResponse', res);
        });
        //get problem list for running contest
        socket.on('getProblemList', async (request: { contest: string, token: number }) => {
            //check valid contest first
            if (request == null || typeof request.contest !== 'string') {
                socket.kick('invalid getProblemList payload');
                return;
            }
            const rounds = await this.db.readRounds({ contest: request.contest });
            const packet: Array<Object> = [];
            //I think it's the VIEW_PROBLEMS perm?
            const canViewAllRounds = await this.db.hasPerms(socket.username, AdminPerms.VIEW_PROBLEMS);
            for (const round of rounds) {
                if (round.startTime > Date.now() && !canViewAllRounds) {
                    continue;
                }
                // make sure to check submission status for the problems
                const roundProblems = await this.db.readProblems({ contest: { contest: request.contest, round: round.round } });
                let problems: Array<Object> = [];
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
        //get problem
        socket.on('getProblemData', async (request: { id: undefined, contest: string, round: number, number: number, token: number } | { id: string, contest: undefined, round: undefined, number: undefined, token: number }) => {
            if (request == null || ((typeof request.contest !== 'string' || typeof request.round !== 'number' || typeof request.number !== 'number') && (typeof request.id !== 'string' || !isUUID(request.id)))) {
                socket.kick('invalid getProblemData payload');
                return;
            }
            // const rounds = await this.db.readRounds({ contest: request.contest, round: request.round });
            // if (rounds.length !== 1) {
            //     socket.kick('invalid getProblemData round or contest id');
            //     return;
            // }
            // if (rounds.length < request.number) {
            //     socket.kick('invalid getProblemData problem index');
            //     return;
            // }
            let problems: Problem[];
            if (typeof request.id === 'string') {
                //getProblemDataId
                problems = await this.db.readProblems({ id: request.id });
            } else {
                //getProblemData
                problems = await this.db.readProblems({ contest: { contest: request.contest, round: request.round, number: request.number } });
            }
            //note that a hidden problem will override a visible contest
            if (!(await this.db.hasPerms(socket.username, AdminPerms.VIEW_PROBLEMS))) {
                //remove all hidden problems
                problems = problems.filter((p) => !p.hidden);
            }
            if (problems.length !== 1) {
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
            //also need to check valid language, valid problem id
            if (request == null || typeof request.contest !== 'string' || typeof request.round !== 'number' || typeof request.number !== 'number' || typeof request.file !== 'string' || typeof request.lang !== 'string') {
                socket.kick('invalid updateSubmission payload');
                return;
            }
            if (request.file.length > 10240) {
                socket.kick('updateSubmission file too large');
                return;
            }
            const problems = await this.db.readProblems({ contest: { contest: request.contest, round: request.round, number: request.number } });
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

export default ContestManager;