import { Express } from 'express';
import { Server as SocketIOServer } from 'socket.io';

import Database, { Score, ScoreState, TeamOpResult } from './database';
import Grader from './grader';
import WwppcGrader from './wwppcGrader';
import Logger, { NamedLogger } from './log';
import { ServerSocket } from './socket';
import { isUUID, UUID } from './util';
import { ClientProblemCompletionState } from './contest';

/**
 * `UpsolveManager` allows viewing and submitting to problems of past contests.
 */
export class UpsolveManager {
    readonly #sockets: Set<ServerSocket> = new Set();

    readonly db: Database;
    readonly app: Express;
    readonly logger: NamedLogger;
    readonly #grader: Grader;

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
        this.#grader = new WwppcGrader(app, '/upsolve-judge', process.env.GRADER_PASS, logger, db);
        // attach api
        this.app.get('/api/upsolveContestList', async (req, res) => {
            const contests = await this.db.readContests({ endTime: { op: '<', v: Date.now() }, public: true });
            if (contests == null) {
                res.sendStatus(500);
                return;
            }
            contests.sort((a, b) => a.endTime - b.endTime);
            const mappedContests: UpsolveContest[] = [];
            for (const contest of contests) {
                const rounds = await this.db.readRounds({ id: contest.rounds });
                if (rounds == null) {
                    res.sendStatus(500);
                    return;
                }
                const mapped: UpsolveRound[] = [];
                for (let i in contest.rounds) {
                    const round = rounds.find((r) => r.id === contest.rounds[i]);
                    if (round == undefined) {
                        res.sendStatus(500);
                        return;
                    }
                    mapped.push({
                        contest: contest.id,
                        number: Number(i),
                        problems: round.problems
                    });
                }
                mappedContests.push({
                    id: contest.id,
                    rounds: mapped
                });
            }
            res.json(mappedContests);
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
        socket.on('updateUpsolveSubmission', async (data: { id: string, file: string, lang: string }, cb: (res: TeamOpResult) => any) => {
            if (data == null || typeof data.id != 'string' || typeof data.file != 'string' || typeof data.lang != 'string' || !isUUID(data.id) || typeof cb != 'function') {
                socket.kick('invalid updateUpsolveSubmission payload');
                return;
            }
            cb(TeamOpResult.NOT_ALLOWED);
        });
        socket.on('refreshUpsolveSubmission', async (data: { id: string }, cb: (res: UpsolveSubmission[] | null) => any) => {
            if (data == null || typeof data.id != 'string' || !isUUID(data.id) || typeof cb != 'function') {
                socket.kick('invalid refreshUpsolveSubmission payload');
                return;
            }
            cb([]);
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

    #getCompletionState(round: number, scores: Score[] | undefined): ClientProblemCompletionState {
        if (scores == undefined) return ClientProblemCompletionState.NOT_UPLOADED;
        if (scores.length == 0) return ClientProblemCompletionState.UPLOADED;
        const hasPass = scores.some((score) => score.state == ScoreState.CORRECT);
        const hasFail = scores.some((score) => score.state != ScoreState.CORRECT);
        if (hasPass && !hasFail) return ClientProblemCompletionState.GRADED_PASS;
        if (hasPass) return ClientProblemCompletionState.GRADED_PARTIAL;
        return ClientProblemCompletionState.GRADED_FAIL;
    }

    /**
     * Closes the upsolve manager
     */
    close() {
        this.#open = false;
        this.#grader.close();
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