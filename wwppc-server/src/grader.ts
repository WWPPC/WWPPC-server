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
    #db: Database;

    #ungradedSubmissions: Submission[] = new Array<Submission>();
    // queue of submissions, will be popped from when /api/judgehosts/fetch-work is called

    #gradedSubmissions: Submission[] = new Array<Submission>();

    constructor(app: Express, logger: Logger, db: Database) {
        this.#app = app;
        this.#logger = logger;
        this.#db = db;
        this.#app.get('/api/judgehosts', (req, res) => {
            //no parameters for some reason?
            res.json([
                {
                    "id": "string",
                    "hostname": "FvZDS9zQBfg3y..LscGIT1pzpuChISCxBwp9uSDP2rP8kScWvVnJkw5UkpERFZXMHfSmGpxetmMIjfLSLi104ww7gv",
                    "enabled": true,
                    "polltime": "string",
                    "hidden": true
                }
            ]);
        });
        this.#app.post('/api/judgehosts', (req, res) => {
            //no parameters for some reason?
            res.json([]);
        });
        this.#app.get('/api/config', (req, res) => {
            res.json({
                diskspace_error: 1024, //in kB
                output_storage_limit: 256, //i think MB?
                script_timelimit: 5000, //units in ms probably?
                script_memory_limit: 1024, //units in MB probably?
                script_filesize_limit: 10, //units in KB probably?
                timelimit_overshoot: 100, //probably amount of time the script is allowed to keep running past TL
            });
        });
        this.#app.get('/api/languages', (req, res) => {
            //i'm pretty sure only 'id' and 'extensions' fields are actually used
            res.json([
                {
                    "compile_executable_hash": "string",
                    "compiler": {
                        "version": "string",
                        "version_command": "string"
                    },
                    "runner": {
                        "version": "string",
                        "version_command": "string"
                    },
                    "id": "cpp",
                    "name": "cpp",
                    "extensions": [
                        "cpp",
                        "cc"
                    ],
                    "filter_compiler_files": true,
                    "allow_judge": true,
                    "time_factor": 1,
                    "entry_point_required": true,
                    "entry_point_name": "string"
                },
                {
                    "compile_executable_hash": "string",
                    "compiler": {
                        "version": "string",
                        "version_command": "string"
                    },
                    "runner": {
                        "version": "string",
                        "version_command": "string"
                    },
                    "id": "java",
                    "name": "java",
                    "extensions": [
                        "java"
                    ],
                    "filter_compiler_files": true,
                    "allow_judge": true,
                    "time_factor": 2,
                    "entry_point_required": true,
                    "entry_point_name": "string"
                },
                {
                    "compile_executable_hash": "string",
                    "compiler": {
                        "version": "string",
                        "version_command": "string"
                    },
                    "runner": {
                        "version": "string",
                        "version_command": "string"
                    },
                    "id": "py",
                    "name": "py",
                    "extensions": [
                        "py"
                    ],
                    "filter_compiler_files": true,
                    "allow_judge": true,
                    "time_factor": 4,
                    "entry_point_required": true,
                    "entry_point_name": "string"
                },
            ]);
        });
        this.#app.get('/api/judgehosts/get_files/testcase/*', (req, res) => {

        });
        this.#app.post('/api/judgehosts/fetch-work', async (req, res) => {
            // if (req.body == null || typeof req.body.hostname === 'undefined' || typeof req.body.max_batchsize === 'undefined') {
            //     //malformed
            //     res.sendStatus(400);
            //     res.end();
            //     return;
            // }
            // if (!this.#judgehosts.has(req.body.hostname)) {
            //     //invalid judgehost
            //     res.sendStatus(403);
            //     res.end();
            //     return;
            // }
            // code to validate judgehost possibly needed
            let arr = new Array<Object>();
            for (let i = 0; i < req.body.max_batchsize; i++) {
                const s = this.#ungradedSubmissions.shift();
                if (s === undefined) {
                    break;
                }
                const problems = await db.readProblems({ id: s.problemId });
                if (problems === null || problems.length !== 1) {
                    //oops db error
                    res.sendStatus(500);
                    return;
                }
                const p = problems[0];

                arr.push({
                    submitid: s.username + s.time.toString(),
                    judgetaskid: 0, //
                    type: "string", //'prefetch' or 'debug_info' (or neither?)
                    priority: 0,
                    jobid: "string", //
                    uuid: "string",
                    compile_script_id: "string",
                    run_script_id: s.file,
                    compare_script_id: "string",
                    testcase_id: "string", // /api/judgehosts/get_files/testcase/$testcase_id will be called later
                    testcase_hash: "string",
                    compile_config: {
                        hash: "string",
                        script_timelimit: 5000, //units in ms probably?
                        script_memory_limit: 1024, //units in MB probably?
                        script_filesize_limit: 10, //units in KB probably?
                    },
                    run_config: {
                        combined_run_compare: false, // true for interactive problems I think
                        hash: "string",
                        memory_limit: p.constraints.memory,
                        output_limit: 256, //units in MB probably?
                        process_limit: p.constraints.time //probably time limit? idk
                    },
                    compare_config: {
                        combined_run_compare: false, // true for interactive problems I think
                        hash: "string",
                    },
                });
            }
            res.json(arr);
        });
        this.#app.use('/api/*', (req, res) => res.sendStatus(404));
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