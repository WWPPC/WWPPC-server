import config from './config';
import { Socket } from "socket.io";
import { AccountData, Submission, Database, Registration, AccountOpResult } from "./database";
import express from 'express';

interface ContestUser {
    username: string
    email: string
    displayName: string
    registrations: Registration[]
    sockets: Set<Socket>
}

/**
 * 
 */
export class ContestManager {
    readonly #users: Map<string, ContestUser> = new Map();
    // will replace with black-box judgehost API class?
    readonly #judgehosts: Set<string> = new Set();

    readonly #db: Database;
    readonly #app: express;

    #submissionQueue: Submission[] = new Array<Submission>();
    // stack of submissions, will be popped from when /api/v4/judgehosts/fetch-work is called

    // all socketio connections are put here (IN A SET NOT AN ARRAY)
    // start/stop rounds, control which problems are where
    // also only one contest page open per account
    // remember to prevent large file submissions (over 10kb is probably unnecessarily large for these problems)
    // use socket.io rooms? put all sockets in contest in room?
    // the user must be signed in and registered for the contest and division of the round/problem AND THE ROUND HAS TO BE ACTIVE

    // make sure to also handle REGISTRATION (update the cached user data when a registration is made!) (call updateUserData)

    /**
     * 
     * @param {Database} db 
     * @param {express} app 
     */
    constructor(db: Database, app: express) {
        this.#db = db;
        this.#app = app;
        this.#app.post("/api/v4/judgehosts", (req, res) => {
            //no parameters for some reason?
            res.send("hi");
        });
        this.#app.post("/api/v4/judgehosts/fetch-work", (req, res) => {
            if (typeof req.hostname === "undefined" || typeof req.max_batchsize === "undefined") {
                //malformed
                res.sendStatus(400);
                res.end();
                return;
            }
            if (!this.#judgehosts.has(req.hostname)) {
                //invalid judgehost
                res.sendStatus(403);
                res.end();
                return;
            }
            // code to validate judgehost possibly needed
            var arr = [];
            for (var i = 0; i < Math.max(this.#submissionQueue.length, req.max_batchsize); i++) {
                var s = this.#submissionQueue.pop();
                // See schema JudgeTask to figure this out
                // arr.push({
                //     submitid: 
                //     judgetaskid:
                //     type:
                //     priority:
                //     jobid:
                //     uuid:
                //     compile_script_id:
                //     run_script_id:
                //     compare_script_id:
                //     testcase_id:
                //     testcase_hash:
                //     compile_config:
                //     run_config:
                //     compare_config:
                // })
            }
            res.json(arr);
        });
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

    /**
     * Queue a submission to be judged.
     * @param {Submission} submission submission data
     * @returns {boolean} whether the thing was successfully pushed to the queue
     */
    async queueSubmission(submission: Submission) {
        const res = await this.#db.writeSubmission(submission);
        if (res) {
            this.#submissionQueue.push(submission);
        }
        return res;
    }
}

export default ContestManager;