import { Express } from 'express';

import { Database, ScoreState, Submission } from './database';
import Grader from './grader';
import Logger from './log';

export class WwppcGrader extends Grader {

    #judgehosts: Set<string> = new Set();

    #app: Express;
    #logger: Logger;
    #db: Database;

    #ungradedSubmissions: Submission[] = new Array<Submission>();

    #gradedSubmissions: Submission[] = new Array<Submission>();

    constructor(app: Express, logger: Logger, db: Database) {
        super();
        this.#app = app;
        this.#logger = logger;
        this.#db = db;
        this.#app.get('/judge/get-work', async (req, res) => {

        });
        this.#app.post('/judge/return-work', async (req, res) => {

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
        return true;
    }

    getNewGradedSubmissions(): Submission[] {
        const arr = structuredClone(this.#gradedSubmissions);
        this.#gradedSubmissions.length = 0;
        return arr;
    }
}

export default WwppcGrader;