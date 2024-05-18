import { Express } from 'express';

import { Database, ScoreState, Submission } from '../database';
import Grader, { GraderSubmission, GraderSubmissionComplete } from '../grader';
import Logger from '../log';

export class WwppcGrader extends Grader {

    #judgehosts: Set<string> = new Set();

    #app: Express;
    #logger: Logger;
    #db: Database;

    constructor(app: Express, logger: Logger, db: Database) {
        super();
        this.#app = app;
        this.#logger = logger;
        this.#db = db;
    }

    /**
     * Judge a submission and return it.
     * @param {Submission} submission submission to be judged
     * @returns {Submission} `submission`, but now with judge results. If `submission.scores` is nonempty nothing will happen and `submission` will be returned.
     */
    async judge(submission: Submission) {
        //read db
        //send to remote judgehost
        //put results in the `submission` variable
        return submission;
    }

    // wait WHY ARE THERE TWO???
    queueUngraded(submission: GraderSubmission): Promise<void> {
        throw new Error('Method not implemented.');
    }
    cancelUngraded(username: string, problemId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    get gradedList(): GraderSubmissionComplete[] {
        throw new Error('Method not implemented.');
    }
    get hasGradedSubmissions(): boolean {
        throw new Error('Method not implemented.');
    }
    emptyGradedList(): GraderSubmissionComplete[] {
        throw new Error('Method not implemented.');
    }
}

export default WwppcGrader;