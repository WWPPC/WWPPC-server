import { Express } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { validate as uuidValidate } from 'uuid';

import config from './config';
import { AccountOpResult, Database, Registration, Round, ScoreState } from './database';
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
    registrations: Registration[]
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
        socket.on('getProblemList', async (request: { contest: string, token: number }) => {
            //check valid contest first
            if (request == null || typeof request.contest !== 'string') {
                socket.kick('invalid getProblemList payload');
                return;
            }
            const rounds = await this.db.readRounds({ contest: request.contest });
            const packet: Array<Object> = [];
            for (let i of rounds) {
                if (i.startTime > Date.now()) {
                    continue;
                }
                const roundProblems = await this.db.readProblems({ contest: { contest: request.contest, round: i.round } });
                let problems: Array<Object> = [];
                for (let p in roundProblems) {
                    problems.push({
                        id: roundProblems[p].id,
                        contest: request.contest,
                        round: 100,
                        number: p,
                        name: roundProblems[p].name,
                        author: roundProblems[p].author,
                    });
                }
                packet.push({
                    contest: request.contest,
                    number: i.round,
                    time: 0,
                    problems: problems
                });
            }
            socket.emit('problemList', { data: packet, token: request.token });
        });
        socket.on('getProblemData', async (request: { contest: string, round: number, number: number, token: number, id: string }) => {
            if (request == null || ((typeof request.contest !== 'string' || typeof request.round !== 'number' || typeof request.number !== 'number') && (typeof request.id !== 'string' || !uuidValidate(request.id)))) {
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
            let problems;
            if (typeof request.id === 'string') {
                //getProblemDataId
                problems = await this.db.readProblems({ id: request.id });
            } else {
                //getProblemData
                problems = await this.db.readProblems({ contest: { contest: request.contest, round: request.round, number: request.number } });
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
            let submission : Object | null = null;
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
                },
                submission: submission,
                token: request.token
            });
        });
        socket.on('updateSubmission', async (request: { file: string, problemId: string, lang: string }) => {
            //also need to check valid language, valid problem id
            if (request == null || typeof request.problemId !== 'string' || typeof request.file !== 'string' || typeof request.lang !== 'string') {
                socket.kick('invalid updateSubmission payload');
                return;
            }
            const problems = await this.db.readProblems({ id: request.problemId });
            if (problems.length !== 1) {
                socket.kick('invalid updateSubmission problem ID');
                return;
            }
            if (request.file.length > 10240) {
                socket.kick('updateSubmission file too large');
                return;
            }
            this.#grader.queueSubmission({
                username: socket.username,
                problemId: request.problemId,
                time: Date.now(),
                file: request.file,
                lang: request.lang,
                scores: [],
            });
        });

        // add to user list and return after attaching listeners
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