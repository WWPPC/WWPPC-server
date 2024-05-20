import { Express, Request } from 'express';
import config from '../config';

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
            const creds = this.isValidJudgehostRequest(req);
            if (creds == undefined) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                return;
            }

            const user = creds[0];
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
            const creds = this.isValidJudgehostRequest(req);
            if (creds == undefined) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                return;
            }

            const user = creds[0];

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
    isValidJudgehostRequest(req: Request): string[] | undefined {
        const auth = req.get('Authorization');
        if (auth == null) {
            return;
        }
        const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
        if (user == null || pass == null) {
            return;
        }
        if (!config.graderAuthKeypairs.some((pair) => typeof pair.password == 'string' && pair.password == pass)) {
            return;
        }
        return [user, pass];
    }
}

export default WwppcGrader;