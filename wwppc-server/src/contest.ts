import express from 'express';

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

    readonly #db: Database;
    readonly #app: express;
    readonly #logger: Logger;

    // start/stop rounds, control which problems are visible (and where)
    // also only one contest page open per account
    // use socket.io rooms? put all sockets in contest in room?
    // the user must be signed in and registered for the contest and division of the round/problem AND THE ROUND HAS TO BE ACTIVE

    // make sure to also handle REGISTRATION (update the cached user data when a registration is made!) (call updateUserData)

    /**
     * @param {Database} db Database connection
     * @param {express} app Express app (HTTP server) to attach API to
     */
    constructor(db: Database, app: express, logger: Logger) {
        this.#db = db;
        this.#app = app;
        this.#logger = logger;
        this.#grader = new DomjudgeGrader(app, logger);

        //interval to check for new submissions from grader
        const interval = setInterval(() => {
            const newSubmissions = this.#grader.getNewGradedSubmissions();
            for (let s of newSubmissions) {
                for (let socket of this.#users[s.username]) {
                    socket.emit('submissionStatus', s);
                }
                this.#db.writeSubmission(s);
            }
        }, 1000);
        //make sure this isn't accidentally left running when the object is deleted
    }

    /**
     * Add a username-linked SocketIO connection to the user list.
     * @param {string} username Username to link this socket to
     * @param {ServerSocket} socket SocketIO connection (with modifications)
     * @returns {number} The number of sockets linked to `username`. If 0, then adding the user was unsuccessful.
     */
    async addUser(username: string, socket: ServerSocket): Promise<number> {
        if (this.#users.has(username)) return this.#users.get(username)!.sockets.add(socket).size;
        const userData = await this.#db.getAccountData(username);
        if (userData == AccountOpResult.NOT_EXISTS || userData == AccountOpResult.ERROR) return 0;
        this.#users.set(username, {
            username: username,
            email: userData.email,
            displayName: userData.displayName,
            registrations: userData.registrations,
            sockets: new Set<ServerSocket>().add(socket)
        });

        socket.on('updateSubmission', (data) => {
            //replace this with a kick() function
            if (data == null || typeof data.problemId !== 'string' || typeof data.file !== 'string' || typeof data.lang !== 'string') {
                //also need to check valid language, valid problem id
                socket.kick('invalid updateSubmission payload');
                return;
            }
            if (data.file.length > 10240) {
                socket.kick('updateSubmission file too large');
                return;
            }
            this.#grader.queueSubmission({
                username: username,
                problemId: data.problemId,
                time: Date.now(),
                file: data.file,
                lang: data.lang,
                scores: [],
            });
        });
        socket.on('getProblemList', async (data) => {
            if (data == null || typeof data.contest !== 'string') {
                //check valid contest
                socket.kick('invalid getProblemList payload');
                return;
            }

            const rounds = await this.#db.readRounds({ contest: data.contest, round: 100 });
            //replace the 100 with an actual round data, this is just a temporary workaround for db bug

            let packet: Array<Object> = [];
            for (let i of rounds) {
                packet.push({
                    contest: i.contest,
                    number: i.round,
                    time: 0,
                    problems: [
                        {
                            id: 'buh',
                            contest: 'WWPIT Test',
                            round: 1,
                            number: 0,
                            name: 'Test Problem 0',
                            author: 'SP^2',
                        },
                        {
                            id: 'buh',
                            contest: 'WWPIT Test',
                            round: 1,
                            number: 1,
                            name: 'Test Problem 1',
                            author: 'SP^2',
                        },
                        {
                            id: 'buh',
                            contest: 'WWPIT Test',
                            round: 1,
                            number: 2,
                            name: 'Test Problem 2',
                            author: 'SP^2',
                        }
                    ]
                });
            }
            socket.emit('problemList', { data: packet, token: data.token });
        });
        socket.on('getProblemData', async (data) => {
            if (data == null || typeof data.id !== 'string') {
                socket.kick('invalid getProblemData payload');
                return;
            }
            const problems = await this.#db.readProblems({ id: data.id });
            if (problems.length !== 1) {
                socket.kick('invalid getProblemData payload');
                return;
            }
            const problem = problems[0];
            // socket.emit('problemData', {
            //     id: problem.id,
            //     name: problem.name,
            //     author: problem.author,
            //     content: problem.content,
            //     constraints: problem.constraints,
            //     token: data.token,
            // });
        });
        return 1;
    }
}

export default ContestManager;