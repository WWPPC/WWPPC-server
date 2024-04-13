import config from './config';
import { Socket } from "socket.io";
import { AccountData, Submission, Database, Registration, AccountOpResult } from "./database";
import { Grader, DomjudgeGrader } from "./grader";
import express from 'express';

interface ContestUser {
    username: string
    email: string
    displayName: string
    registrations: Registration[]
    sockets: Set<Socket>
}

//user-facing contest manager
//actual grading is done with the Grader class
export class ContestManager {
    readonly #users: Map<string, ContestUser> = new Map();
    readonly #grader: Grader;

    readonly #db: Database;
    readonly #app: express;

    // start/stop rounds, control which problems are visible (and where)
    // also only one contest page open per account
    // remember to prevent large file submissions (over 10kb is probably unnecessarily large for these problems)
    // use socket.io rooms? put all sockets in contest in room?
    // the user must be signed in and registered for the contest and division of the round/problem AND THE ROUND HAS TO BE ACTIVE

    // make sure to also handle REGISTRATION (update the cached user data when a registration is made!) (call updateUserData)

    /**
     * @param {Database} db Database connection
     * @param {express} app Express app (HTTP server) to attach API to
     */
    constructor(db: Database, app: express) {
        this.#db = db;
        this.#app = app;
        this.#grader = new DomjudgeGrader(app);

        const interval = setInterval(() => {
            const newSubmissions = this.#grader.getNewGradedSubmissions();
            for (let s of newSubmissions) {
                for (let socket of this.#users[s.username]) {
                    socket.emit("submissionStatus", s);
                }
                this.#db.writeSubmission(s);
            }
        }, 1000);
        //make sure this isn't accidentally left running when the object is deleted
    }

    /**
     * Add a username-linked SocketIO connection to the user list.
     * @param {string} username Username to link this socket to
     * @param {Socket} socket SocketIO connection
     * @returns {number} The number of sockets linked to `username`. If 0, then adding the user was unsuccessful.
     */
    async addUser(username: string, socket: Socket): Promise<number> {
        if (this.#users.has(username)) return this.#users.get(username)!.sockets.add(socket).size;
        const userData = await this.#db.getAccountData(username);
        if (userData == AccountOpResult.NOT_EXISTS || userData == AccountOpResult.ERROR) return 0;
        this.#users.set(username, {
            username: username,
            email: userData.email,
            displayName: userData.displayName,
            registrations: userData.registrations,
            sockets: new Set<Socket>().add(socket)
        });
        socket.on("updateSubmission", (data) => {
            //replace this with a kick() function
            if (typeof data.problemId !== "string" || typeof data.file !== "string" || typeof data.lang !== "string") {
                //also need to check valid language, valid problem id
                socket.removeAllListeners();
                socket.disconnect();
                return;
            }
            if (data.file.length > 10240) {
                //tell the socket that the file is too big
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
        return 1;
    }
}

export default ContestManager;