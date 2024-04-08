import { Socket } from "socket.io";
import { AccountData, Submission, Database } from "./database";
import express from 'express';

/**
 * 
 */
export class ContestManager {
    #users: Map<string, Set<Socket>> = new Map();
    // socketio connections are put in sets mapped to username
    // responsible for serving round data and problem data
    // the user must be signed in and registered for the contest and division of the round/problem AND THE ROUND HAS TO BE ACTIVE
    #judgehosts: Set<string> = new Set();
    //probably only going to be one judgehost but "scalability"
    //See the Judgehost schema, may need to create new class etc

    #db: Database;
    #app: express;

    #submissionQueue: Submission[] = new Array<Submission>();
    // stack of submissions, will be popped from when /api/v4/judgehosts/fetch-work is called

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
        app.post("/api/v4/judgehosts", (req, res) => {
            //no parameters for some reason?
            res.send("hi");
        });
        app.post("/api/v4/judgehosts/fetch-work", (req, res) => {
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
     * Queue a submission to be judged
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