import config from './config';
import { Socket } from "socket.io";
import { AccountData, Submission, Database, Registration, AccountOpResult } from "./database";
import { Grader } from "./grader";
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
/**
 * 
 */
export class ContestManager {
    readonly #users: Map<string, ContestUser> = new Map();
    // will replace with black-box judgehost API class?
    readonly #judgehosts: Set<string> = new Set();

    readonly #db: Database;
    readonly #app: express;
    readonly #grader: Grader;

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
        this.#grader = new Grader(app);
    }

    /**
     * please use punctuation in "documentation".
     */
    /**
     * Add a username-linked SocketIO connection to the user list.
     * @param {string} username Username to link this socket to
     * @param {Socket} socket SocketIO connection
     * @returns {number} The number of sockets linked to that username. If 0, then adding the user was unsuccessful.
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
        return 1;
    }

    /**
     * 
     * @param {string} username Username to update information for
     */
    async updateUserData(username: string) {

    }

    // /**
    //  * Queue a submission to be judged
    //  * @param {Submission} submission submission data
    //  * @returns {boolean} whether the thing was successfully pushed to the queue AND written into the database
    //  */
    // async queueSubmission(submission: Submission) {
    //     const res = await this.#db.writeSubmission(submission);
    //     if (res) {
    //         return this.#grader.queueSubmission(submission);
    //     }
    //     return res;
    // }
}

export default ContestManager;