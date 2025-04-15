import { json as parseBodyJson } from 'body-parser';
import { Express, Request } from 'express';

import config from './config';
import { Database, DatabaseOpCode, Score, ScoreState, Submission } from './database';
import Logger, { NamedLogger } from './log';
import { is_in_enum } from './util';

/**
 * Custom grading system that offloads grading to a network of other servers.
 */
export class Grader {
    private readonly nodes: Map<string, GraderNode> = new Map();

    readonly app: Express;
    readonly logger: NamedLogger;
    readonly db: Database;
    private readonly path: string;
    private readonly password: string;

    private open = true;

    private ungradedSubmissions: SubmissionWithCallback[] = [];

    /**
     * @param db Database connection
     * @param app Express app (HTTP server) to attach API to
     * @param path Path of API
     * @param password Global password for graders to authenticate with
     * @param logger Logger instance
     */
    constructor(db: Database, app: Express, path: string, password: string, logger: Logger) {
        this.path = path.match(/\/[^\/]+/g)?.join('') ?? '/judge';
        this.app = app;
        this.logger = new NamedLogger(logger, 'Grader@' + this.path);
        this.db = db;
        this.password = password;
        this.logger.info('Creating WWPPC Grader under ' + this.path);
        this.app.use(this.path + '/*', parseBodyJson());
        // see docs
        this.app.get(this.path + '/get-work', async (req, res) => {
            //fetch work from the server
            const username = this.getAuth(req);
            if (typeof username == 'number') {
                if (username == 401) res.set('WWW-Authenticate', 'Basic');
                res.sendStatus(username);
                if (config.debugMode) this.logger.debug(`get-work: ${req.ip} - ${username}`, true);
                return;
            }

            if (!this.nodes.has(username)) {
                this.nodes.set(username, {
                    username: username,
                    grading: undefined,
                    deadline: -1,
                    lastCommunication: Date.now()
                });
                this.logger.info(`New grader connection: ${username} (${req.ip})`);
            }
            const node: GraderNode = this.nodes.get(username)!;
            node.lastCommunication = Date.now();
            if (node.grading === undefined) {
                node.grading = this.ungradedSubmissions.shift();
                if (node.grading === undefined) {
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
            if (problems == DatabaseOpCode.ERROR || problems.length != 1) {
                res.sendStatus(500);
                if (config.debugMode) this.logger.debug(`get-work: ${username}@${req.ip} - 500, database error`, true);
                return;
            }
            node.deadline = Date.now() + config.graderTimeout;
            res.json({
                problemId: node.grading.submission.problemId,
                file: node.grading.submission.file,
                lang: node.grading.submission.language,
                constraints: problems[0].constraints
            });
            if (config.debugMode) this.logger.debug(`get-work: ${username}@${req.ip} - 200, sent submission to ${node.grading.submission.problemId} by ${node.grading.submission.username}`);
        });
        this.app.post(this.path + '/return-work', async (req, res) => {
            //return work if you can't grade it for some reason
            const username = this.getAuth(req);
            if (typeof username == 'number') {
                if (username == 401) res.set('WWW-Authenticate', 'Basic');
                res.sendStatus(username);
                if (config.debugMode) this.logger.debug(`return-work: ${req.ip} - ${username}`, true);
                return;
            }

            const node = this.nodes.get(username);
            if (node === undefined || node.grading === undefined) {
                res.sendStatus(409);
                if (config.debugMode) this.logger.debug(`return-work: ${username}@${req.ip} - 409, no active work (or not registered through get-work)`, true);
                return;
            }
            node.lastCommunication = Date.now();

            if (!node.grading.cancelled) {
                node.grading.returnCount++;
                if (node.grading.returnCount >= 5) {
                    logger.warn(`Submission (${node.grading.submission.problemId} by ${node.grading.submission.username}) was returned 5 times, canceling grading!`);
                    node.grading.cancelled = true;
                    if (node.grading.callback) node.grading.callback(null);
                } else {
                    this.ungradedSubmissions.unshift(node.grading);
                }
            }
            if (config.debugMode) this.logger.debug(`return-work: ${username}@${req.ip} - returned submission to ${node.grading.submission.problemId} by ${node.grading.submission.username}`);
            node.grading = undefined;
            res.sendStatus(200);
        });
        this.app.post(this.path + '/finish-work', async (req, res) => {
            //return finished batch
            //doesn't validate if it's a valid problem etc
            //we assume that the judgehost is returning grades from the previous get-work
            const username = this.getAuth(req);
            if (typeof username == 'number') {
                if (username == 401) res.set('WWW-Authenticate', 'Basic');
                res.sendStatus(username);
                if (config.debugMode) this.logger.debug(`finish-work: ${req.ip} - ${username}`, true);
                return;
            }

            const node = this.nodes.get(username);
            if (node === undefined || node.grading === undefined) {
                res.sendStatus(409);
                if (config.debugMode) this.logger.debug(`finish-work: ${username}@${req.ip} - 409, no active work (or not registered through get-work)`, true);
                return;
            }
            node.lastCommunication = Date.now();

            if (!Array.isArray(req.body.scores) || (req.body.scores as any[]).some((v) => {
                return v === undefined || !is_in_enum(v.state, ScoreState) || typeof v.time != 'number' || typeof v.memory != 'number' || typeof v.subtask != 'number';
            })) {
                res.sendStatus(400);
                if (config.debugMode) this.logger.debug(`finish-work: ${username}@${req.ip} - 400`, true);
                return;
            }

            // don't modify so as to not accidentally mess with other code
            const returnedSubmission = structuredClone(node.grading.submission);
            returnedSubmission.scores = (req.body.scores as Score[]).map<Score>((s) => ({
                state: s.state,
                time: s.time,
                memory: s.memory,
                subtask: s.subtask
            }));

            try {
                if (node.grading.callback) {
                    if (node.grading.cancelled) node.grading.callback(null);
                    else node.grading.callback(returnedSubmission);
                }
            } catch (err) {
                this.logger.handleError('Error occured in submission callback:', err);
            }

            if (config.debugMode) this.logger.debug(`finish-work: ${username}@${req.ip} - 200, finished submission to ${node.grading.submission.problemId} by ${node.grading.submission.username}`);
            node.grading = undefined;
            res.sendStatus(200);
        });

        // reserve path
        this.app.use(this.path + '/*', (req, res) => res.sendStatus(404));

        setInterval(() => {
            this.nodes.forEach(async (node, username) => {
                //check if a submission has passed the deadline and return to queue
                if (node.grading !== undefined && node.deadline < Date.now()) {
                    this.nodes.delete(username);
                    this.ungradedSubmissions.unshift(node.grading);
                    node.grading = undefined;
                    this.logger.info('Grader timed out (returning submission to queue): ' + node.username);
                }
                //if they haven't talked to us in a while let's just assume they disconnected
                if (node.lastCommunication + config.graderTimeout < Date.now()) {
                    this.nodes.delete(username);
                    // also return to queue
                    if (node.grading !== undefined) {
                        this.ungradedSubmissions.unshift(node.grading);
                        node.grading = undefined;
                        this.logger.info('Grader timed out (returning submission to queue): ' + node.username);
                    } else {
                        this.logger.info('Grader timed out: ' + node.username);
                    }
                }
            });
        }, 5000);
    }

    /**
     * Add a submission to the ungraded queue of submissions.
     * @param submission New submission
     */
    queueUngraded(submission: Submission, cb: (graded: Submission | null) => any) {
        if (!this.open) {
            cb(null);
            return;
        }
        this.ungradedSubmissions.push({
            submission: structuredClone(submission),
            returnCount: 0,
            callback: cb,
            cancelled: false
        });
        if (config.debugMode) this.logger.debug(`Submission for ${submission.problemId} queued by ${submission.username}`, true);
    }
    /**
     * Cancel all ungraded submissions from a user to a problem.
     * @param username Username of submitter
     * @param problemId ID or problem
     */
    cancelUngraded(team: number, problemId: string): boolean {
        let canceled = 0;
        this.nodes.forEach((node) => {
            if (node.grading !== undefined && node.grading.submission.username == username && node.grading.submission.problemId == problemId) {
                node.grading.cancelled = true;
                canceled++;
            }
        });
        let i = this.ungradedSubmissions.findIndex((ungraded) => ungraded.submission.username == username && ungraded.submission.problemId == problemId);
        if (i != -1) {
            while (i != -1) {
                if (this.ungradedSubmissions[i].callback) {
                    try {
                        this.ungradedSubmissions[i].callback!(null);
                    } catch (err) {
                        this.logger.handleError('Error occured in submission callback:', err);
                    }
                }
                this.ungradedSubmissions.splice(i, 1);
                i = this.ungradedSubmissions.findIndex((ungraded) => ungraded.submission.username == username && ungraded.submission.problemId == problemId);
                canceled++;
            }
            if (config.debugMode) this.logger.debug(`Canceled ${canceled} submissions to ${problemId} by ${username}`);
        }
        return canceled > 0;
    }

    private getAuth(req: Request): string | number {
        const auth = req.get('Authorization');
        if (auth === undefined) return 401;
        try {
            const [user, pass] = Buffer.from(auth, 'base64').toString().split(':');
            if (user === undefined || pass === undefined) return 400;
            if (pass !== this.password) return 403;
            return user;
        } catch {
            return 400;
        }
    }

    /**
     * Cancels all submissions and stops accepting submissions to the queue
     */
    close() {
        this.open = false;
        this.app.removeAllListeners(this.path + '/*');
        this.app.removeAllListeners(this.path + '/get-work');
        this.app.removeAllListeners(this.path + '/return-work');
        this.app.removeAllListeners(this.path + '/finish-work');
        this.ungradedSubmissions.forEach((sub) => {
            sub.cancelled = true;
            if (sub.callback !== undefined) sub.callback(null);
        });
    }
}

export default Grader;

/**
 * Internal submission of `Grader` class.
 */
export type SubmissionWithCallback = {
    /**The submission itself */
    submission: Submission
    /**Function supplied by queueUngraded to send submission to after grading is finished/cancelled */
    callback?: (graded: Submission | null) => any
    /**How many times the grading servers have failed grading this (returned) */
    returnCount: number
    /**If the grading was cancelled (due to manual trigger or excessive failed attempts to grade the submission) */
    cancelled: boolean
}

/**Represents a grader server */
export type GraderNode = {
    /**Username */
    username: string
    /**Submission that is being graded */
    grading: SubmissionWithCallback | undefined
    /**Deadline to return the submission (unix ms) */
    deadline: number
    /**Last time we communicated with this grader (unix ms) */
    lastCommunication: number
}