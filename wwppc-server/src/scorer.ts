import { Round, Score, ScoreState, Submission } from "./database";
import Logger, { NamedLogger } from "./log";

/**
 * Scorer class, supports adding and modifying user submission status, and can get scores of individual users and leaderboard.
 * Using the function score = Math.log(cnt+1)/cnt where cnt is number of people who solved the problem (if cnt=0, then 1).
 * Very small time penalty going from 1 to 0.9999.
 */
export class Scorer {
    logger: NamedLogger;

    // format: problemId.concat(subtask.toString())
    // ex: "5d31e716-474b-4f7b-9a9a-bf43e444c79b" + "1"
    readonly #subtasks: Set<string> = new Set();
    #rounds: Round[];
    #round: number
    readonly #scores: Map<number, Map<string, number>> = new Map();

    #users: Map<string, Map<string, number>> = new Map();

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
        const userScores = new Map<string, number>();
        const subtasks = new Set<number>();
        for (const score of submission.scores) {
            subtasks.add(score.subtask);
        }
        for (const i of subtasks) {
            userScores.set(submission.problemId + i, submission.scores.some((s: Score) => s.state != ScoreState.CORRECT && s.subtask === i) ? -1 : submission.time);
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
        const subtaskCount = new Map<string, number>();
        for (const s of this.#subtasks) {
            const id = s.substring(0, 36);
            if (subtaskCount.has(id)) {
                const c = subtaskCount.get(id);
                if (c !== undefined) {
                    subtaskCount.set(id, c + 1);
                }
            } else {
                subtaskCount.set(id, 1);
            }
        }
        const subtaskSolved = new Map<string, number>();
        this.#subtasks.forEach((id) => {
            subtaskSolved.set(id, 0);
        });
        this.#users.forEach((scores) => {
            scores.forEach((solved, subtask) => {
                if (solved !== -1) {
                    const c = subtaskSolved.get(subtask);
                    if (c !== undefined) {
                        subtaskSolved.set(subtask, c + 1);
                    }
                }
            });
        });
        let maxScore = 0;
        this.#subtasks.forEach((id) => {
            const s = subtaskSolved.get(id);
            const c = subtaskCount.get(id);
            if (s !== undefined && c !== undefined) {
                if (s == 0) maxScore += 1 / c;
                else maxScore += Math.log(s + 1) / (s * c);
            }
        });
        const scores = new Map<string, number>();
        this.#users.forEach((subtasks, username) => {
            let score = 0;
            let last = this.#rounds[this.#round].startTime;
            subtasks.forEach((solved, subtask) => {
                if (solved !== -1) {
                    last = Math.max(last, solved);
                    const s = subtaskSolved.get(subtask);
                    const c = subtaskCount.get(subtask);
                    if (s !== undefined && c !== undefined) {
                        if (s == 0) score += 1 / c;
                        else score += Math.log(s + 1) / (s * c);
                    }
                }
            });
            
            scores.set(username, score / maxScore * 1000 - 0.001 * (last - this.#rounds[this.#round].startTime) / (this.#rounds[this.#round].endTime - this.#rounds[this.#round].startTime));
        });
        this.#scores.set(this.#round, scores);
        return scores;
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

export default Scorer;