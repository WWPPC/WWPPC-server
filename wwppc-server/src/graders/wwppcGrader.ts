import { Express } from 'express';

import { Database, ScoreState, Submission } from '../database';
import Grader, { GraderSubmission, GraderSubmissionComplete } from '../grader';
import Logger from '../log';

export class WwppcGrader extends Grader {
    //custom grader (hopefully this doeesn't bork)

    #judgehosts: Set<string> = new Set();

    #app: Express;
    #logger: Logger;
    #db: Database;

    #ungradedSubmissions: GraderSubmission[] = [];

    #gradedSubmissions: GraderSubmissionComplete[] = [];

    constructor(app: Express, logger: Logger, db: Database) {
        super();
        this.#app = app;
        this.#logger = logger;
        this.#db = db;
        this.#app.get('/judge/get-work', async (req, res) => {
            res.sendStatus(405);
            res.end();
            return;
        });
        this.#app.post('/judge/return-work', async (req, res) => {
            res.sendStatus(405);
            res.end();
            return;
        });
    }

    queueUngraded(submission: GraderSubmission) {
        this.#ungradedSubmissions.push(submission); //pretend it's graded for testing purposes
    }
    cancelUngraded(username: string, problemId: string): Promise<void> {
        throw new Error('Method not implemented.');
        //you also have to tell the judgehost running this submission to stop!
    }
    get gradedList(): GraderSubmissionComplete[] {
        return this.#gradedSubmissions;
    }
    get hasGradedSubmissions(): boolean {
        return this.#gradedSubmissions.length > 0;
    }
    emptyGradedList(): GraderSubmissionComplete[] {
        const l = structuredClone(this.#gradedSubmissions);
        this.#gradedSubmissions = [];
        return l;
    }
}

export default WwppcGrader;