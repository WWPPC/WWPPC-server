import { Socket } from "socket.io";
import { AccountData, Submission, Database } from "./database";
import express from 'express';

export interface Grader {
    /**
     * Queue a submission to be judged
     * @param {Submission} submission submission data
     * @returns {Promise<boolean>} whether the thing was successfully pushed to the queue
     */
    queueSubmission(submission: Submission): Promise<boolean>

    /**
     * Get all graded submissions that were not seen since last call to this method
     * @returns {Submission[]} submission data
     */
    getNewGradedSubmissions(): Submission[]
}

export class DomjudgeGrader implements Grader {
    //interface to grade stuff
    //this is the 'judgehost-facing' part

    #judgehosts: Set<string> = new Set();
    //probably only going to be one judgehost but "scalability"
    //See the Judgehost schema, may need to create new class etc

    #app: express;

    #ungradedSubmissions: Submission[] = new Array<Submission>();
    // queue of submissions, will be popped from when /api/v4/judgehosts/fetch-work is called

    #gradedSubmissions: Submission[] = new Array<Submission>();

    constructor(app: express) {
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
            let arr = new Array<Object>();
            for (let i = 0; i < Math.max(this.#ungradedSubmissions.length, req.max_batchsize); i++) {
                let s = this.#ungradedSubmissions.shift();
                // See schema JudgeTask to figure this out
                arr.push({
                    submitid: "string",
                    judgetaskid: 0,
                    type: "string",
                    priority: 0,
                    jobid: "string",
                    uuid: "string",
                    compile_script_id: "string",
                    run_script_id: s?.file,
                    compare_script_id: "string",
                    testcase_id: "string",
                    testcase_hash: "string",
                    compile_config: "string",
                    run_config: "string",
                    compare_config: "string",
                });
            }
            res.json(arr);
        });
    }

    async queueSubmission(submission: Submission): Promise<boolean> {
        this.#ungradedSubmissions.push(submission);
        return true;
    }

    getNewGradedSubmissions(): Submission[] {
        const arr = this.#gradedSubmissions;
        this.#gradedSubmissions.length = 0;
        return arr;
    }
}