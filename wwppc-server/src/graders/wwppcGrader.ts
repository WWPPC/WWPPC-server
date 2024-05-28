import bodyParser from 'body-parser';
import { Express, Request } from 'express';

import config from '../config';
import { Database, is_in_enum, Score, ScoreState, Submission } from '../database';
import Grader from '../grader';
import Logger, { NamedLogger } from '../log';

export class WwppcGrader extends Grader {
    //custom grader (hopefully this doeesn't bork)

    readonly #nodes: Map<string, GraderNode> = new Map();
    //value stores the submission that is being graded

    readonly app: Express;
    readonly logger: NamedLogger;
    readonly db: Database;
    #password: string;

    #ungradedSubmissions: SubmissionWithCallback[] = [];
    #gradedSubmissions: Submission[] = [];

    constructor(app: Express, logger: Logger, db: Database) {
        super();
        this.app = app;
        this.logger = new NamedLogger(logger, 'WwppcGrader');
        this.db = db;
        if (typeof process.env.GRADER_PASS != 'string') throw new Error('Missing WwppcGrader password');
        this.#password = process.env.GRADER_PASS;
        this.logger.info('Creating WwppcGrader');
        app.use('/judge/*', bodyParser.json());
        // see docs
        this.app.get('/judge/get-work', async (req, res) => {
            //fetch work from the server
            const username = this.#getAuth(req);
            if (username == 401) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                if (config.debugMode) this.logger.debug(`get-work: ${req.ip} - 401`, true);
                return;
            } else if (typeof username == 'number') {
                res.sendStatus(username);
                if (config.debugMode) this.logger.debug(`get-work: ${req.ip} - ${username}`, true);
                return;
            }

            if (!this.#nodes.has(username)) {
                this.#nodes.set(username, {
                    username: username,
                    grading: undefined,
                    deadline: -1,
                    lastCommunication: Date.now()
                });
                this.logger.info(`New grader connection: ${username} (${req.ip})`);
            }
            const node: GraderNode = this.#nodes.get(username)!;
            node.lastCommunication = Date.now();
            if (node.grading == undefined) {
                node.grading = this.#ungradedSubmissions.shift();
                if (node.grading == undefined) {
                    res.json(null);
                    if (config.debugMode) this.logger.debug(`get-work: ${username}@${req.ip} - 200, no work`, true);
                    return;
                }
            } else {
                res.sendStatus(409);
                if (config.debugMode) this.logger.debug(`get-work: ${username}@${req.ip} - 409, cannot get work with unfinished work`, true);
                return;
            }
            const problems = await this.db.readProblems({ id: node.grading.submission.problemId });
            if (problems == null || problems.length != 1) {
                return;
            }
            res.json({
                file: node.grading.submission.file,
                lang: node.grading.submission.lang,
                cases: problems[0].cases,
                constraints: problems[0].constraints
            });
            if (config.debugMode) this.logger.debug(`get-work: ${username}@${req.ip} - 200, work sent`, true);
        });
        this.app.post('/judge/return-work', async (req, res) => {
            //return work if you can't grade it for some reason
            const username = this.#getAuth(req);
            if (username == 401) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                if (config.debugMode) this.logger.debug(`return-work: ${req.ip} - 401`, true);
                return;
            } else if (typeof username == 'number') {
                res.sendStatus(username);
                if (config.debugMode) this.logger.debug(`return-work: ${req.ip} - ${username}`, true);
                return;
            }

            const node = this.#nodes.get(username);
            if (node == undefined || node.grading == undefined) {
                res.sendStatus(409);
                if (config.debugMode) this.logger.debug(`return-work: ${username}@${req.ip} - 409, no active work (or not registered through get-work)`, true);
                return;
            }
            node.lastCommunication = Date.now();

            this.#ungradedSubmissions.unshift(node.grading);
            node.grading = undefined;
            res.sendStatus(200);
            if (config.debugMode) this.logger.debug(`return-work: ${username}@${req.ip} - 200, returned work`, true);
        });
        this.app.post('/judge/finish-work', async (req, res) => {
            //return finished batch
            //doesn't validate if it's a valid problem etc
            //we assume that the judgehost is returning grades from the previous get-work
            const username = this.#getAuth(req);
            if (username == 401) {
                res.set('WWW-Authenticate', 'Basic').sendStatus(401);
                if (config.debugMode) this.logger.debug(`finish-work: ${req.ip} - 401`, true);
                return;
            } else if (typeof username == 'number') {
                res.sendStatus(username);
                if (config.debugMode) this.logger.debug(`finish-work: ${req.ip} - ${username}`, true);
                return;
            }

            const node = this.#nodes.get(username);
            if (node == undefined || node.grading == undefined) {
                res.sendStatus(409);
                if (config.debugMode) this.logger.debug(`finish-work: ${username}@${req.ip} - 409, no active work (or not registered through get-work)`, true);
                return;
            }
            node.lastCommunication = Date.now();

            if (!Array.isArray(req.body.scores) || (req.body.scores as any[]).some((v) => {
                return v == undefined || !is_in_enum(v.state, ScoreState) || typeof v.time != 'number' || typeof v.memory != 'number' || typeof v.subtask != 'number';
            })) {
                res.sendStatus(400);
                if (config.debugMode) this.logger.debug(`finish-work: ${username}@${req.ip} - 400`, true);
                return;
            }
            node.grading.submission.scores = (req.body.scores as Score[]).map<Score>((s) => ({
                state: s.state,
                time: s.time,
                memory: s.memory,
                subtask: s.subtask
            }));

            this.#gradedSubmissions.push(node.grading.submission);
            try {
                if (node.grading.callback) node.grading.callback(node.grading.submission);
            } catch (err) {
                this.logger.handleError('Error occured in submission callback:', err);
            }

            node.grading = undefined;
            res.sendStatus(200);
            if (config.debugMode) this.logger.debug(`finish-work: ${username}@${req.ip} - 200, finished work`, true);
        });

        // reserve /judge path
        app.use('/judge/*', (req, res) => res.sendStatus(404));

        setInterval(() => {
            this.#nodes.forEach(async (node, username) => {
                //check if a submission has passed the deadline and return to queue
                if (node.grading != undefined && node.deadline < Date.now()) {
                    this.#ungradedSubmissions.unshift(node.grading);
                    node.grading = undefined;
                    this.logger.info('Grader timed out (returning to queue): ' + node.username);
                }
                //if they haven't talked to us in a while let's just assume they disconnected
                if (node.lastCommunication + config.graderTimeout < Date.now()) {
                    this.#nodes.delete(username);
                    // also return to queue
                    if (node.grading != undefined) {
                        this.#ungradedSubmissions.unshift(node.grading);
                        node.grading = undefined;
                        this.logger.info('Grader timed out (returning to queue): ' + node.username);
                    }
                }
            });
        }, 5000);
    }

    queueUngraded(submission: Submission, cb: (graded: Submission | null) => any) {
        this.#ungradedSubmissions.push({
            submission,
            callback: cb
        });
        if (config.debugMode) this.logger.debug(`Submission queued by ${submission.username} for ${submission.problemId}`, true);
    }
    cancelUngraded(username: string, problemId: string): boolean {
        let i = this.#ungradedSubmissions.findIndex((ungraded) => ungraded.submission.username == username && ungraded.submission.problemId == problemId);
        if (i != -1) {
            let canceled = 0;
            while (i != -1) {
                if (this.#ungradedSubmissions[i].callback) {
                    try {
                        this.#ungradedSubmissions[i].callback!(null);
                    } catch (err) {
                        this.logger.handleError('Error occured in submission callback:', err);
                    }
                }
                this.#ungradedSubmissions.splice(i, 1);
                i = this.#ungradedSubmissions.findIndex((ungraded) => ungraded.submission.username == username && ungraded.submission.problemId == problemId);
                canceled++;
            }
            if (config.debugMode) this.logger.debug(`Canceled ${canceled} submissions by ${username} for ${problemId}`);
            return true;
        }
        return false;
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
        if (config.debugMode) this.logger.debug('Emptied graded submission list', true);
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

export interface SubmissionWithCallback {
    submission: Submission
    callback?: (graded: Submission | null) => any
}

/**Represents a grader server */
export interface GraderNode {
    /**Username */
    username: string
    /**Submission that is being graded */
    grading: SubmissionWithCallback | undefined
    /**Deadline to return the submission (unix ms) */
    deadline: number
    /**Last time we communicated with this judgehost (unix ms) */
    lastCommunication: number
}

export default WwppcGrader;