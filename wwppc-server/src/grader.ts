import { Socket } from "socket.io";
import { AccountData, Submission, Database } from "./database";
import express from 'express';

export class Grader {
    //interface to grade stuff
    //this is the 'judgehost-facing' part

    #judgehosts: Set<string> = new Set();
    //probably only going to be one judgehost but "scalability"
    //See the Judgehost schema, may need to create new class etc

    #app: express;

    #submissionQueue: Submission[] = new Array<Submission>();
    // stack of submissions, will be popped from when /api/v4/judgehosts/fetch-work is called

    constructor(app: express) {
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
        this.#submissionQueue.push(submission);
        return true;
    }
}

export default Grader;