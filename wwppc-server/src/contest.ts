import { Socket } from "socket.io";
import { AccountData, Submission, Database } from "./database";
import { Grader } from "./grader";
import express from 'express';

export class ContestManager {
    //user-facing contest manager
    //actual grading is done with the Grader class

    #users: Map<string, Set<Socket>> = new Map();
    // socketio connections are put in sets mapped to username
    // responsible for serving round data and problem data
    // the user must be signed in and registered for the contest and division of the round/problem AND THE ROUND HAS TO BE ACTIVE

    #db: Database;
    #app: express;
    #grader: Grader;

    // all socketio connections are put here (IN A SET NOT AN ARRAY)
    // start/stop rounds, control which problems are where
    // uses database to get problems and then caches them (also stores division, round, number since client needs that)
    // also only one contest page open per account
    // remember to prevent large file submissions (over 10kb is probably unnecessarily large for these problems)
    // use socket.io rooms
    // 

    constructor (db: Database, app: express) {
        this.#db = db;
        this.#app = app;
        this.#grader = new Grader(app);
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