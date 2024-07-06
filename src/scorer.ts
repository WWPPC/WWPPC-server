import { Round, Score, ScoreState, Submission } from './database';
import Logger, { NamedLogger } from './log';
import { UUID } from './util';

/**
 * Scorer class, supports adding and modifying user submission status, and can get scores of individual users and leaderboard.
 * Using the function score = 1/cnt where cnt is number of people who solved the problem
 */
export class Scorer {
    logger: NamedLogger;

    /**
     * list of all rounds
     */
    #rounds: Round[];
    /**
     * current round
     */
    #round: number

    /**
     * List of all subtasks. One is inserted anytime a submission contains a subtask we don't know about yet
     */
    readonly #subtasks: Set<Subtask> = new Set();
    
    /**
     * key: round id
     * value: map of username to scores
     */
    readonly #scores: Map<number, Map<string, number>> = new Map();

    /**
     * key: username
     * value: map of subtask to solve time (if a subtask is unsolved, it is not in the map)
     */
    #userSolvedStatus: Map<string, Map<Subtask, number>> = new Map();

    constructor(rounds: Round[], logger: Logger) {
        this.#rounds = rounds;
        this.#round = 0;
        this.logger = new NamedLogger(logger, 'Scorer');
    }

    /**
     * Reset the rounds data (MAY CAUSE ISSUES!)
     * @param {Round[]} rounds Contest round data
     */
    setContest(rounds: Round[]) {
        this.#rounds = rounds;
    }

    /**
     * Set the round. Updates current round scores and resets submissions.
     * @param {number} round Round number
     */
    setRound(round: number) {
        this.getRoundScores();
        this.#round = round;
        this.#userSolvedStatus.clear();
    }

    /**
     * Add or edit user (or team the scorer doesnt care) to leaderboard
     * @param {Submission} submission the submission (with COMPLETE SCORES)
     * @returns {Boolean} whether it was successful
     */
    updateUser(submission: Submission): Boolean {
        const userScores = this.#userSolvedStatus.get(submission.username) ?? new Map<Subtask, number>();
        //add new subtasks
        for (const score of submission.scores) {
            let alreadyExists = false;
            for (const i of this.#subtasks) {
                alreadyExists = i.id === submission.problemId && i.number == score.subtask;
                if (alreadyExists) break;
            }
            if (!alreadyExists) {
                this.#subtasks.add({
                    id: submission.problemId,
                    number: score.subtask
                });
            }
        }
        //put in the scores from the submission
        for (const subtask of this.#subtasks) {
            if (subtask.id === submission.problemId && userScores.get(subtask) === undefined && submission.scores.every(score => score.subtask !== subtask.number || score.state === ScoreState.CORRECT)) {
                userScores.set(subtask, submission.time);
            }
        }
        this.#userSolvedStatus.set(submission.username, userScores);
        return true;
    }

    /**
     * Get the current standings, only calculating current round scores.
     * Writes current scores to scores map.
     * @returns {Map<string, number>} Mapping of username to score
     */
    getRoundScores(): Map<string, number> {
        if (this.#rounds[this.#round] == undefined) {
            this.logger.warn('Round ' + this.#round + ' not in contest round data!');
        }
        const subtaskSolved = new Map<Subtask, number>(); // how many users solved each subtask
        const problemSubtasks = new Map<UUID, Subtask[]>(); // which subtasks are assigned to which problem
        const problemWeight = new Map<UUID, number>(); // how much to weight each problem

        //set everything to 0
        this.#subtasks.forEach((id) => {
            subtaskSolved.set(id, 0);
        });

        //find how many users solved each subtask
        this.#userSolvedStatus.forEach((scores) => {
            scores.forEach((solveTime, subtask) => {
                const c = subtaskSolved.get(subtask);
                if (c !== undefined) {
                    subtaskSolved.set(subtask, c + 1);
                } else {
                    this.logger.warn('Subtask disappeared (0)');
                }
            })
        });

        //group subtasks by problem id
        this.#subtasks.forEach((subtask) => {
            const problem = problemSubtasks.get(subtask.id);
            //probably no pass by reference issues?
            if (problem == undefined) {
                problemSubtasks.set(subtask.id, [subtask]);
            } else {
                problem.push(subtask);
                problemSubtasks.set(subtask.id, problem);
            }
        });
        //weight subtasks so that problems with more subtasks aren't weighted too high
        problemSubtasks.forEach((subtasks, problem) => {
            problemWeight.set(problem, 1/subtasks.length);
        });

        //calculate actual scores for each user
        const userScores = new Map<string, number>();
        this.#userSolvedStatus.forEach((scores, username) => {
            let score = 0;
            scores.forEach((solveTime, subtask) => {
                const weight = problemWeight.get(subtask.id);
                const numSolved = subtaskSolved.get(subtask);
                if (weight !== undefined && numSolved !== undefined) {
                    //use the log function TIMES the weight, no time penalty yet
                    score += weight * 1 / numSolved;
                } else {
                    this.logger.warn('Subtask disappeared (2)');
                }
            });
            userScores.set(username, score);
        });
        this.#scores.set(this.#round, userScores);
        return userScores;
    }

    /**
     * Get the current standings, adding scores from all rounds together.
     * @returns {Map<string, number>} mapping of username to score
     */
    getScores(): Map<string, number> {
        this.getRoundScores();
        const sums: Map<string, number> = new Map();
        this.#scores.forEach((roundMap) => {
            roundMap.forEach((score, username) => {
                if (sums.has(username)) sums.set(username, sums.get(username)! + score);
                else sums.set(username, score);
            });
        });
        return sums;
    }
}

/**Subtask */
export interface Subtask {
    /**Problem id */
    id: UUID
    /**Subtask id */
    number: number
}

export default Scorer;