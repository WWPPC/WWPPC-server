import bodyParser from 'body-parser';
import { Express, Request } from 'express';

import config from '../config';
import { Database, is_in_enum, Score, ScoreState, Submission } from '../database';
import Grader from '../grader';
import Logger, { NamedLogger } from '../log';

export class WwppcGrader extends Grader {
    //custom grader (hopefully this doeesn't bork)

    #nodes: Map<string, GraderNode> = new Map();
    //value stores the submission that is being graded

    #app: Express;
    #logger: NamedLogger;
    #db: Database;
    #password: string;

    #ungradedSubmissions: Submission[] = [];

    #gradedSubmissions: Submission[] = [];

    constructor(app: Express, logger: Logger, db: Database) {
        super();
        this.#app = app;
        this.#logger = new NamedLogger(logger, 'WwppcGrader');
        this.#db = db;
        if (typeof process.env.GRADER_PASS != 'string') throw new Error('Missing WwppcGrader password');
        this.#password = process.env.GRADER_PASS;
        this.#logger.info('Creating WwppcGrader');
        app.use('/judge/*', bodyParser.json());
        // see docs
        this.#app.get('/judge/get-work', async (req, res) => {
            //fetch work from the server
            const username = this.#getAuth(req);
            if (config.debugMode) this.#logger.debug(`get-work: ${username}${typeof username == 'string' ? ' (success)': ''}`, true);
            if (username == 401) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                return;
            } else if (typeof username == 'number') {
                res.sendStatus(username);
                return;
            }

            const node: GraderNode = this.#nodes.get(username) ?? {
                username: username,
                grading: undefined,
                deadline: -1,
                lastCommunication: Date.now()
            };
            this.#nodes.set(username, node);
            if (node.grading == undefined) {
                node.grading = this.#ungradedSubmissions.shift();
                if (node.grading == undefined) {
                    res.json(null);
                    return;
                }
            } else {
                res.sendStatus(409);
                return;
            }
            const problems = await this.#db.readProblems({ id: node.grading.problemId });
            if (problems == null || problems.length != 1) {
                return;
            }
            res.json({
                file: node.grading.file,
                lang: node.grading.lang,
                cases: problems[0].cases,
                constraints: problems[0].constraints
            });
            node.lastCommunication = Date.now();
        });
        this.#app.post('/judge/return-work', async (req, res) => {
            //return work if you can't grade it for some reason
            const username = this.#getAuth(req);
            if (config.debugMode) this.#logger.debug(`return-work: ${username}${typeof username == 'string' ? ' (success)': ''}`, true);
            if (username == 401) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                return;
            } else if (typeof username == 'number') {
                res.sendStatus(username);
                return;
            }

            const node = this.#nodes.get(username);
            if (node == undefined || node.grading == undefined) {
                res.sendStatus(409);
                return;
            }

            this.#ungradedSubmissions.unshift(node.grading);
            node.grading = undefined;
            node.lastCommunication = Date.now();
            res.sendStatus(200);
        });
        this.#app.post('/judge/finish-work', async (req, res) => {
            //return finished batch
            //doesn't validate if it's a valid problem etc
            //we assume that the judgehost is returning grades from the previous get-work
            const username = this.#getAuth(req);
            if (config.debugMode) this.#logger.debug(`finish-work: ${username}${typeof username == 'string' ? ' (success)': ''}`, true);
            if (username == 401) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                return;
            } else if (typeof username == 'number') {
                res.sendStatus(username);
                return;
            }

            const node = this.#nodes.get(username);
            if (node == undefined || node.grading == undefined) {
                res.sendStatus(409);
                return;
            }

            try {
                if (!Array.isArray(req.body.scores) || (req.body.scores as any[]).some((v) => {
                    return v == undefined || !is_in_enum(v.status, ScoreState) || typeof v.time != 'number' || typeof v.memory != 'number';
                })) {
                    res.sendStatus(400);
                    return;
                }
                node.grading.scores = (req.body.scores as Score[]).map<Score>((s) => ({
                    state: s.state,
                    time: s.time,
                    memory: s.memory,
                    subtask: s.subtask
                }));
            } catch {
                res.sendStatus(400);
                return;
            }

            this.#gradedSubmissions.push(node.grading);

            node.grading = undefined;
            node.lastCommunication = Date.now();
            res.sendStatus(200);
        });

        // reserve /judge path
        app.use('/judge/*', (req, res) => res.sendStatus(404));

        setInterval(() => {
            this.#nodes.forEach(async (user, username) => {
                //check if a submission has passed the deadline and return to queue
                if (user == undefined) return;
                if (user.grading != undefined && user.deadline < Date.now()) {
                    this.#ungradedSubmissions.unshift(user.grading);
                    user.grading = undefined;
                    this.#nodes.set(username, user);
                    //if they haven't talked to us in a while let's just assume they disconnected
                    if (user.lastCommunication + config.graderTimeout < Date.now()) {
                        this.#nodes.delete(username);
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

    #getAuth(req: Request): string | number {
        const auth = req.get('Authorization');
        if (auth == null) return 401;
        try {
            const [user, pass] = Buffer.from(auth, 'base64').toString().split(':');
            if (user == null || pass == null) return 400;
            if (pass !== this.#password) return 403;
            return user;
        } catch {
            return 400;
        }
    }
}

/**Represents a grader server */
export interface GraderNode {
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