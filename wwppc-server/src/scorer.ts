import { Round, Score, ScoreState, Submission } from './database';
import Logger, { NamedLogger } from './log';
import { UUID } from './util';

/**
 * Scorer class, supports adding and modifying user submission status, and can get scores of individual users and leaderboard.
 * Using the function score = Math.log(cnt+1)/cnt where cnt is number of people who solved the problem (if cnt=0, then 1).
 */
export class Scorer {
    logger: NamedLogger;

    readonly #subtasks: Set<Subtask> = new Set();
    #rounds: Round[];
    #round: number
    //key = round id
    //value: map of username to scores
    readonly #scores: Map<number, Map<string, number>> = new Map();

    //key = username
    //value: map of subtask to solve time (or -1)
    #users: Map<string, Map<Subtask, number>> = new Map();

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
        this.#users.clear();
    }

    /**
     * Add or edit user (or team the scorer doesnt care) to leaderboard
     * Note that we only care about submission.scores so you can change the params to make it more convenient
     * @param {Submission} submission the submission (with COMPLETE SCORES)
     * @returns {Boolean} whether it was successful
     */
    updateUser(submission: Submission): Boolean {
        // sort into subtasks
        const userScores = this.#users.get(submission.username) ?? new Map<Subtask, number>();
        for (const score of submission.scores) {
            let works = true;
            for (const i of this.#subtasks) {
                if (i.id === submission.problemId && i.number == score.subtask) works = false;
            }
            if (works) {
                this.#subtasks.add({
                    id: submission.problemId,
                    number: score.subtask
                });
            }
        }
        for (const i of this.#subtasks) {
            if (i.id === submission.problemId) {
                userScores.set(i, submission.scores.some((s: Score) => s.state != ScoreState.CORRECT && submission.problemId === i.id && s.subtask === i.number) ? -1 : submission.time);
            }
        }   
        for (const s of this.#subtasks) {
            if (userScores.get(s) == undefined) {
                userScores.set(s, -1);
            }
        }
        this.#users.set(submission.username, userScores);
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
        this.#users.forEach((scores, username) => {
            scores.forEach((solved, subtask) => {
                if (solved >= 0) {
                    const c = subtaskSolved.get(subtask);
                    if (c !== undefined) {
                        subtaskSolved.set(subtask, c + 1);
                    } else {
                        this.logger.warn('Subtask disappeared (0)');
                    }
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
        this.#users.forEach((scores, username) => {
            let score = 0;
            scores.forEach((solved, subtask) => {
                if (solved >= 0) {
                    const weight = problemWeight.get(subtask.id);
                    const numSolved = subtaskSolved.get(subtask);
                    if (weight === undefined || numSolved === undefined) {
                        this.logger.warn('Subtask disappeared (2)');
                    } else {
                        //use the log function TIMES the weight, no time penalty yet
                        score += weight * Math.log(numSolved+1) / numSolved;
                    }
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