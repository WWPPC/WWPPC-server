import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { uuidValidate } from 'uuid';

import { AccountOpResult, Database, Registration, Round } from './database';
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
    readonly app: express;
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
    constructor(db: Database, app: express, io: SocketIOServer, logger: Logger) {
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
                for (const socket of this.#users[s.username]) {
                    socket.emit('submissionStatus', s);
                }
                this.db.writeSubmission(s);
            }
        }, 1000);
        //make sure this isn't accidentally left running when the object is deleted
        //make sure this isn't accidentally left running when the object is deleted
        //make sure this isn't accidentally left running when the object is deleted
    }

    /**
     * Add a username-linked SocketIO connection to the user list.
     * @param {string} username Username to link this socket to
     * @param {ServerSocket} socket SocketIO connection (with modifications)
     * @returns {number} The number of sockets linked to `username`. If 0, then adding the user was unsuccessful.
     */
    async addUser(username: string, socket: ServerSocket): Promise<number> {
        // make sure the user actually exists (otherwise bork)
        const userData = await this.db.getAccountData(username);
        if (userData == AccountOpResult.NOT_EXISTS || userData == AccountOpResult.ERROR) return 0;

        socket.on('getProblemList', async (request: { contest: string, token: number }) => {
            //check valid contest first
            if (request == null || typeof request.contest !== 'string') {
                socket.kick('invalid getProblemList payload');
                return;
            }

            const rounds = await this.db.readRounds({ contest: request.contest });
            const packet: Array<Object> = [];
            for (let i of rounds) {
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
            socket.emit('problemList', { request: packet, token: request.token });
        });
        socket.on('getProblemData', async (request: { contest: string, round: number, number: number, token: number }) => {
            if (request == null || typeof request.contest !== 'string' || typeof request.round !== 'number' || typeof request.number !== 'number') {
                socket.kick('invalid getProblemData payload');
                return;
            }

            // const rounds = await this.db.readRounds({ contest: request.contest, round: request.round });
            // if (rounds.length !== 1) {
            //     socket.kick('invalid getProblemData round or contest id');
            //     return;
            // }
            // if (rounds.length < request.number) {
            //     console.log(rounds.length, request.number);
            //     socket.kick('invalid getProblemData problem index');
            //     return;
            // }
            const problems = await this.db.readProblems({ contest: { contest: request.contest, round: request.round, number: request.number } });
            if (problems.length !== 1) {
                //idk something is wrong with db
            }
            const problem = problems[0];
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
                submission: {
                    //dummy data
                    time: 12345,
                    scores: [
                        {
                            state: 1,
                            time: 123,
                            memory: 54321
                        },
                        {
                            state: 1,
                            time: 123,
                            memory: 54321
                        }
                    ]
                },
                token: request.token
            });
        });
        socket.on('getProblemDataId', async (request: { id: string, token: number }) => {
            if (request == null || typeof request.id !== 'string' || !uuidValidate(request.id)) {
                socket.kick('invalid getProblemDataId payload');
                return;
            }
            const problems = await this.db.readProblems({ id: request.id });
            if (problems.length == 0) {
                // problem not found
                socket.emit('problemData', {
                    problem: null,
                    submission: null,
                    token: request.token
                });
            }

            const problem = problems[0];
            socket.emit('problemData', {
                problem: {
                    id: problem.id,
                    contest: undefined, // see documentation
                    round: undefined,
                    number: undefined,
                    name: problem.name,
                    author: problem.author,
                    content: problem.content,
                    constraints: problem.constraints,
                },
                submission: {
                    //dummy request
                    time: 12345,
                    scores: [
                        {
                            state: 1,
                            time: 123,
                            memory: 54321
                        },
                        {
                            state: 1,
                            time: 123,
                            memory: 54321
                        }
                    ]
                },
                token: request.token
            });
        });
        socket.on('updateSubmission', (request: { file: string, problemId: string, lang: string }) => {
            //also need to check valid language, valid problem id
            if (request == null || typeof request.problemId !== 'string' || typeof request.file !== 'string' || typeof request.lang !== 'string') {
                socket.kick('invalid updateSubmission payload');
                return;
            }
            if (request.file.length > 10240) {
                socket.kick('updateSubmission file too large');
                return;
            }
            this.#grader.queueSubmission({
                username: username,
                problemId: request.problemId,
                time: Date.now(),
                file: request.file,
                lang: request.lang,
                scores: [],
            });
        });

        // add to user list and return after attaching listeners
        if (this.#users.has(username)) return this.#users.get(username)!.sockets.add(socket).size;
        this.#users.set(username, {
            username: username,
            email: userData.email,
            displayName: userData.displayName,
            registrations: userData.registrations,
            sockets: new Set<ServerSocket>().add(socket)
        });
        return 1;
    }
}

export default ContestManager;