import { Express } from 'express';

import config from './config';
import { ClientProblemCompletionState, ContestUpdateSubmissionResult } from './contest';
import Database, { ContestType, Score, ScoreState, Submission, TeamOpResult } from './database';
import Grader from './grader';
import Logger, { NamedLogger } from './log';
import { ServerSocket } from './socket';
import { isUUID, reverse_enum, UUID } from './util';

/**
 * `UpsolveManager` allows viewing and submitting to problems of past contests.
 */
export class UpsolveManager {
    readonly #sockets: Set<ServerSocket> = new Set();

    readonly db: Database;
    readonly app: Express;
    readonly logger: NamedLogger;
    readonly grader: Grader;

    #open = true;

    /**
     * @param {Database} db Database connection
     * @param {express} app Express app (HTTP server) to attach API to
     * @param {Logger} logger Logger instance
     */
    constructor(db: Database, app: Express, logger: Logger) {
        if (process.env.GRADER_PASS == undefined) throw new Error('Missing grader password!');
        this.db = db;
        this.app = app;
        this.logger = new NamedLogger(logger, 'UpsolveManager');
        this.grader = new Grader(app, '/upsolve-judge', process.env.GRADER_PASS, logger, db);
        // attach api
        this.app.get('/api/upsolveContestList', async (req, res) => {
            const contests = await this.db.readContests({
                endTime: { op: '<', v: Date.now() },
                public: true,
                type: ContestType.WWPIT
            });
            if (contests == null) {
                res.sendStatus(500);
                return;
            }
            contests.sort((a, b) => a.endTime - b.endTime);
            res.json(contests.map((c) => c.id));
        });
        this.app.get('/api/upsolve/:cid', async (req, res) => {
            const contests = await this.db.readContests({ id: req.params.cid });
            if (contests == null) {
                res.sendStatus(500);
                return;
            }
            if (contests.length == 0) {
                res.sendStatus(404);
                return;
            }
            const rounds = await this.db.readRounds({ id: contests[0].rounds });
            if (rounds == null) {
                res.sendStatus(500);
                return;
            }
            const mapped: UpsolveRound[] = [];
            for (let i in contests[0].rounds) {
                const round = rounds.find((r) => r.id === contests[0].rounds[i]);
                if (round == undefined) {
                    res.sendStatus(500);
                    return;
                }
                mapped.push({
                    contest: contests[0].id,
                    number: Number(i),
                    problems: round.problems
                });
            }
            res.json({
                id: contests[0].id,
                rounds: mapped
            });
        });
        this.app.get('/api/upsolve/:cid/:r', async (req, res) => {
            if (isNaN(Number(req.params.r))) {
                res.sendStatus(400);
                return;
            }
            const rounds = await this.db.readRounds({ contest: req.params.cid, round: Number(req.params.r) });
            if (rounds == null) res.sendStatus(500);
            else if (rounds.length == 0) res.sendStatus(404);
            else res.json({
                contest: req.params.cid,
                number: Number(req.params.r),
                problems: rounds[0].problems
            });
        });
        this.app.get('/api/upsolve/:cid/:r/:n', async (req, res) => {
            if (isNaN(Number(req.params.r)) || isNaN(Number(req.params.n))) {
                res.sendStatus(400);
                return;
            }
            const problems = await this.db.readProblems({ contest: { contest: req.params.cid, round: Number(req.params.r), number: Number(req.params.n) } });
            if (problems == null) res.sendStatus(500);
            else if (problems.length == 0) res.sendStatus(404);
            else res.json({
                id: problems[0].id,
                contest: req.params.cid,
                round: Number(req.params.r),
                number: Number(req.params.n),
                name: problems[0].name,
                author: problems[0].author,
                content: problems[0].content,
                constraints: problems[0].constraints
            });
        });
        // reserve /api/upsolve
        this.app.use('/api/upsolve/*', (req, res) => res.sendStatus(404));
    }

    /**
     * Add a username-linked SocketIO connection to the user list.
     * @param {ServerSocket} s SocketIO connection (with modifications)
     */
    async addUser(s: ServerSocket): Promise<void> {
        if (!this.#open) return;
        const socket = s;

        // new event handlers
        socket.removeAllListeners('updateUpsolveSubmission');
        socket.removeAllListeners('refreshUpsolveSubmission');
        socket.removeAllListeners('getUpsolveSubmissionCode');
        socket.on('updateUpsolveSubmission', async (data: { id: string, file: string, lang: string }, cb: (res: ContestUpdateSubmissionResult) => any) => {
            if (data == null || typeof data.id != 'string' || typeof data.file != 'string' || typeof data.lang != 'string' || !isUUID(data.id) || typeof cb != 'function') {
                socket.kick('invalid updateUpsolveSubmission payload');
                return;
            }
            if (config.debugMode) socket.logWithId(this.logger.logger.debug, 'Update submission: ' + data.id);
            const respond = (res: ContestUpdateSubmissionResult) => {
                if (config.debugMode) socket.logWithId(this.logger.logger.debug, `Update submission: ${data.id} - ${reverse_enum(ContestUpdateSubmissionResult, res)}`);
                cb(res);
            };
            if (data.file.length > 10240) {
                respond(ContestUpdateSubmissionResult.FILE_TOO_LARGE);
                return;
            }
            if (!config.acceptedLanguages.includes(data.lang)) {
                respond(ContestUpdateSubmissionResult.LANGUAGE_NOT_ACCEPTABLE);
                return;
            }
            const problems = await this.db.readProblems({ id: data.id });
            if (problems === null) {
                respond(ContestUpdateSubmissionResult.PROBLEM_NOT_SUBMITTABLE);
                return;
            }
            const submission: Submission = {
                username: socket.username,
                problemId: data.id,
                file: data.file,
                scores: [],
                history: [],
                lang: data.lang,
                time: Date.now(),
                analysis: true
            };
            if (!(await this.db.writeSubmission(submission))) {
                respond(ContestUpdateSubmissionResult.ERROR);
                return;
            }
            this.grader.cancelUngraded(socket.username, data.id);
            this.grader.queueUngraded(submission, async (graded) => {
                if (config.debugMode) this.logger.debug(`Submission was returned: ${graded == null ? 'Canceled' : 'Complete'} (by ${socket.username} for ${data.id})`);
                if (graded != null) {
                    await this.db.writeSubmission(graded);
                    const updatedSubmissions = await this.db.readSubmissions({ id: data.id, username: socket.username, analysis: true });
                    if (updatedSubmissions != null && updatedSubmissions.length > 0) socket.emit('upsolveSubmissionStatus', this.#mapSubmissions(updatedSubmissions[0]));
                    else socket.emit('upsolveSubmissionStatus', []);
                }
            });
            respond(ContestUpdateSubmissionResult.SUCCESS);
            const updatedSubmissions = await this.db.readSubmissions({ id: data.id, username: socket.username, analysis: true });
            if (updatedSubmissions != null && updatedSubmissions.length > 0) socket.emit('upsolveSubmissionStatus', this.#mapSubmissions(updatedSubmissions[0]));
            else socket.emit('upsolveSubmissionStatus', []);
            this.logger.info(`Accepted submission for ${data.id} by ${socket.username}`);
        });
        socket.on('refreshUpsolveSubmission', async (data: { id: string }, cb: (res: UpsolveSubmission[] | null) => any) => {
            if (data == null || typeof data.id != 'string' || !isUUID(data.id) || typeof cb != 'function') {
                socket.kick('invalid refreshUpsolveSubmission payload');
                return;
            }
            const submissions = await this.db.readSubmissions({ id: data.id, username: socket.username, analysis: true });
            if (submissions != null && submissions.length > 0) cb(this.#mapSubmissions(submissions[0]));
            else cb([]);
        });
        socket.on('getUpsolveSubmissionCode', async (data: { id: string }, cb: (res: string) => any) => {
            if (data == null || typeof data.id != 'string' || !isUUID(data.id) || typeof cb != 'function') {
                socket.kick('invalid getUpsolveSubmissionCode payload');
                return;
            }
            if (config.debugMode) socket.logWithId(this.logger.logger.info, 'Fetch submission code: ' + data.id);
            const submission = await this.db.readSubmissions({ username: socket.username, id: data.id, analysis: true });
            cb(submission?.at(0)?.file ?? '');
        });

        const removeSocket = () => {
            socket.removeAllListeners('updateUpsolveSubmission');
            socket.removeAllListeners('refreshUpsolveSubmission');
            this.#sockets.delete(socket);
        };
        this.#sockets.add(socket);
        socket.on('disconnect', removeSocket);
        socket.on('timeout', removeSocket);
        socket.on('error', removeSocket);
    }

    #getCompletionState(scores: Score[] | undefined): ClientProblemCompletionState {
        if (scores == undefined) return ClientProblemCompletionState.NOT_UPLOADED;
        if (scores.length == 0) return ClientProblemCompletionState.UPLOADED;
        const hasPass = scores.some((score) => score.state == ScoreState.CORRECT);
        const hasFail = scores.some((score) => score.state != ScoreState.CORRECT);
        if (hasPass && !hasFail) return ClientProblemCompletionState.GRADED_PASS;
        if (hasPass) return ClientProblemCompletionState.GRADED_PARTIAL;
        return ClientProblemCompletionState.GRADED_FAIL;
    }

    #mapSubmissions(submission: Submission): UpsolveSubmission[] {
        return [
            {
                problemId: submission.problemId,
                time: submission.time,
                lang: submission.lang,
                scores: submission.scores,
                status: this.#getCompletionState(submission.scores)
            },
            ...submission.history.reverse().map((s): UpsolveSubmission => ({
                problemId: submission.problemId,
                time: s.time,
                lang: s.lang,
                scores: s.scores,
                status: this.#getCompletionState(s.scores)
            }))
        ];
    }

    /**
     * Closes the upsolve manager
     */
    close() {
        this.#open = false;
        this.grader.close();
        this.#sockets.forEach((socket) => {
            socket.removeAllListeners('upsolveUpsolveSubmission');
        });
    }
}

// slightly modified versions of server interfaces, refer to those for documentation
export interface UpsolveContest {
    readonly id: string
    rounds: UpsolveRound[]
}
export interface UpsolveRound {
    readonly contest: string
    readonly number: number
    problems: UUID[]
}
export interface UpsolveProblem {
    readonly id: string
    readonly contest: string
    readonly round: number
    readonly number: number
    name: string
    author: string
    content: string
    constraints: { memory: number, time: number }
}
export interface UpsolveSubmission {
    readonly problemId: string
    time: number
    lang: string
    scores: Score[]
    status: ClientProblemCompletionState
}

export default UpsolveManager;