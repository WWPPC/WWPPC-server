import bodyParser from 'body-parser';
import { Express, Request } from 'express';

import config from '../config';
import { Database, Submission } from '../database';
import Grader from '../grader';
import Logger from '../log';

export class WwppcGrader extends Grader {
    //custom grader (hopefully this doeesn't bork)

    #judgehosts: Map<string, WwppcJudgehost> = new Map();
    //value stores the submission that is being graded

    #app: Express;
    #logger: Logger;
    #db: Database;

    #ungradedSubmissions: Submission[] = [];

    #gradedSubmissions: Submission[] = [];

    constructor(app: Express, logger: Logger, db: Database) {
        super();
        this.#app = app;
        this.#logger = logger;
        this.#db = db;
        app.use('/judge/*', bodyParser.json());
        app.use('/judge/*', bodyParser.urlencoded({ extended: true }));
        this.#app.get('/judge/get-work', async (req, res) => {
            //fetch work from the server
            const creds = this.isValidJudgehostRequest(req);
            if (creds == undefined) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                return;
            }

            const username = creds[0];
            let user = this.#judgehosts.get(username);
            if (user == undefined) {
                user = {
                    username: username,
                    grading: undefined,
                    deadline: -1,
                    lastCommunication: Date.now()
                }
                this.#judgehosts.set(username, user);
            }
            if (user.grading == undefined) {
                user.grading = this.#ungradedSubmissions.shift();
                if (user.grading == undefined) {
                    res.json(null);
                    return;
                }
            }
            const problems = await this.#db.readProblems({ id: user.grading.problemId });
            if (problems == null || problems.length != 1) {
                return;
            }
            res.json({
                file: user.grading.file,
                lang: user.grading.lang,
                cases: problems[0].cases,
                constraints: problems[0].constraints
            });
            user.lastCommunication = Date.now();
            this.#judgehosts.set(username, user);
        });
        this.#app.post('/judge/return-work', async (req, res) => {
            //return work if you can't grade it for some reason
            const creds = this.isValidJudgehostRequest(req);
            if (creds == undefined) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                return;
            }

            const username = creds[0];
            let user = this.#judgehosts.get(username);
            if (user == undefined || user.grading == undefined) {
                res.sendStatus(400);
                return;
            }

            this.#ungradedSubmissions.unshift(user.grading);
            user.grading = undefined;
            user.lastCommunication = Date.now();
            this.#judgehosts.set(username, user);
            res.sendStatus(200);
        });
        this.#app.post('/judge/finish-work', async (req, res) => {
            //return finished batch
            //doesn't validate if it's a valid problem etc
            //we assume that the judgehost is returning grades from the previous get-work
            const creds = this.isValidJudgehostRequest(req);
            if (creds == undefined) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                return;
            }

            const username = creds[0];
            let user = this.#judgehosts.get(username);
            if (user == undefined || user.grading == undefined) {
                res.sendStatus(400);
                return;
            }

            try {
                user.grading.scores = req.body.scores;
            } catch {
                res.sendStatus(400);
                return;
            }

            this.#gradedSubmissions.push(user.grading);

            user.grading = undefined;
            user.lastCommunication = Date.now();
            this.#judgehosts.set(username, user);
            res.sendStatus(200);
        });
        app.use('/judge/*', (req, res) => res.sendStatus(404));

        setInterval(() => {
            this.#judgehosts.forEach(async (user, username) => {
                //check if a submission has passed the deadline and return to queue
                if (user == undefined) return;
                if (user.grading != undefined && user.deadline < Date.now()) {
                    this.#ungradedSubmissions.unshift(user.grading);
                    user.grading = undefined;
                    this.#judgehosts.set(username, user);
                    //if they haven't talked to us in a while let's just assume they disconnected
                    if (user.lastCommunication + config.graderTimeout < Date.now()) {
                        this.#judgehosts.delete(username);
                    }
                }
            });
        }, 5000);
    }

    queueUngraded(submission: Submission) {
        this.#ungradedSubmissions.push(submission); //pretend it's graded for testing purposes
    }
    cancelUngraded(username: string, problemId: string): Promise<void> {
        throw new Error('Method not implemented.');
        //you also have to tell the judgehost running this submission to stop!
    }
    get gradedList(): Submission[] {
        return this.#gradedSubmissions;
    }
    get hasGradedSubmissions(): boolean {
        return this.#gradedSubmissions.length > 0;
    }
    emptyGradedList(): Submission[] {
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
        if (!config.graderAuthKeypairs.some((pair) => pair.username == user && pair.password == pass)) {
            return;
        }
        return [user, pass];
    }
}

/**Judgehost */
export interface WwppcJudgehost {
    /**Username */
    username: string
    /**Submission that is being graded */
    grading: Submission | undefined
    /**Deadline to return the submission (unix ms) */
    deadline: number
    /**Last time we communicated with this judgehost (unix ms) */
    lastCommunication: number
}

export default WwppcGrader;