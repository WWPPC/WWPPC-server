import { Express } from 'express';

import { Database, ScoreState, Submission } from '../database';
import Grader, { GraderSubmission, GraderSubmissionComplete } from '../grader';
import Logger from '../log';

export class WwppcGrader extends Grader {
    //custom grader (hopefully this doeesn't bork)

    #judgehosts: Map<string, GraderSubmission> = new Map();

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
            const auth = req.get('Authorization');
            if (auth == null) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                return;
            }
            const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
            if (user == null || pass == null) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                return;
            }

            //do some sort of db lookup to verify the password
            //format: password:password
            //assume the user is authenticated now

            const submission = this.#ungradedSubmissions.shift();
            if (submission == null) {
                res.sendStatus(200);
                return;
            }
            this.#judgehosts.set(user, submission);
            const problemData = await this.#db.readProblems({ id: submission.problemId });
            if (problemData === null || problemData.length !== 0) {
                res.sendStatus(500);
                return;
            }
            res.json({
                file: submission.file,
                lang: submission.lang,
                cases: problemData[0].cases,
                constraints: problemData[0].constraints
            });
        });
        this.#app.post('/judge/return-work', async (req, res) => {
            const auth = req.get('Authorization');
            if (auth == null) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                return;
            }
            const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
            if (user == null || pass == null) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                return;
            }

            //do some sort of db lookup to verify the password
            //format: password:password
            //assume the user is authenticated now

            //implement the rest later 
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