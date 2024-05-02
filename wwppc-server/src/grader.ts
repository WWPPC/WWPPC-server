import { Express } from 'express';
import { AccountData, Database, Score, ScoreState, Submission } from './database';
import Logger from './log';

export interface Grader {
    /**
     * Queue a submission to be judged
     * @param {Submission} submission submission data
     * @returns {boolean} whether `submission` was successfully pushed to the queue
     */
    queueSubmission(submission: Submission): boolean

    /**
     * Get all graded submissions that were not seen since last call to this method
     * @returns {Submission[]} submission data
     */
    getNewGradedSubmissions(): Submission[]

    /**
     * Judge a submission and return it.
     * @param {Submission} submission submission to be judged
     * @returns {Submission} `submission`, but now with judge results. If `submission.scores` is nonempty nothing will happen and `submission` will be returned.
     */
    // judgeSubmission(submission: Submission): Promise<Submission>

    //Maybe we should move judgeSubmission() to the Grader class, rather than it being in ContestManager?
}

export class DomjudgeGrader implements Grader {
    //interface to grade stuff
    //this is the 'judgehost-facing' part

    #judgehosts: Set<string> = new Set();
    //probably only going to be one judgehost but "scalability"
    //See the Judgehost schema, may need to create new class etc

    #app: Express;
    #logger: Logger;

    #ungradedSubmissions: Submission[] = new Array<Submission>();
    // queue of submissions, will be popped from when /api/v4/judgehosts/fetch-work is called

    #gradedSubmissions: Submission[] = new Array<Submission>();

    constructor(app: Express, logger: Logger) {
        this.#app = app;
        this.#logger = logger;
        this.#app.post('/api/judgehosts', (req, res) => {
            //no parameters for some reason?
            res.send('hi');
        });
        this.#app.post('/api/judgehosts/fetch-work', (req, res) => {
            if (req.body == null || typeof req.body.hostname === 'undefined' || typeof req.body.max_batchsize === 'undefined') {
                //malformed
                res.sendStatus(400);
                res.end();
                return;
            }
            if (!this.#judgehosts.has(req.body.hostname)) {
                //invalid judgehost
                res.sendStatus(403);
                res.end();
                return;
            }
            // code to validate judgehost possibly needed
            let arr = new Array<Object>();
            for (let i = 0; i < req.body.max_batchsize; i++) {
                let s = this.#ungradedSubmissions.shift();
                if (s === undefined) {
                    break;
                }
                // See schema JudgeTask to figure this out
                arr.push({
                    submitid: s.username+s.time.toString(),
                    judgetaskid: 0,
                    type: "string",
                    priority: 0,
                    jobid: "string",
                    uuid: "string",
                    compile_script_id: "string",
                    run_script_id: s.file,
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

    queueSubmission(submission: Submission): boolean {
        // this.#ungradedSubmissions.push(submission);
        submission.scores.push({
            state: ScoreState.CORRECT,
            time: 12,
            memory: 34
        });
        this.#gradedSubmissions.push(submission); //pretend it's graded for testing purposes
        // this.#logger.debug(submission.toString());
        return true;
    }

    getNewGradedSubmissions(): Submission[] {
        const arr = structuredClone(this.#gradedSubmissions);
        this.#gradedSubmissions.length = 0;
        return arr;
    }

    // async judgeSubmission(submission: Submission): Promise<Submission> {
    //     if (submission.scores.length > 0) {
    //         return submission;
    //     }
    //     this.queueSubmission(submission);

    //     return new Promise<Submission>((resolve, error) => {
    //         //is setInterval the best way to do this? Probably better than a getNewGradedSubmissions() method
    //         let interval = setInterval(() => {
    //             for (let s of this.#gradedSubmissions) {
    //                 if (s.time.toString()+s.username == submission.time.toString()+submission.username) {
    //                     clearInterval(interval);
    //                     resolve(s);
    //                 }
    //             }
    //         }, 5000);
    //         //add error() callback if it takes too long?
    //     });
    // }
}