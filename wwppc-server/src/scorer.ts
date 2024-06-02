import Database, { Problem, Round, Score, ScoreState, Submission } from "./database";

/**
 * Scorer class, supports adding and modifying user submission status, and can get scores of individual users and leaderboard.
 * Using the function score = Math.log(cnt+1)/cnt where cnt is number of people who solved the problem (if cnt=0, then 1)
 * very small time penalty going from 1 to 0.9999
 */
export class Scorer {

    // format: problemId.concat(subtask.toString())
    // ex: "5d31e716-474b-4f7b-9a9a-bf43e444c79b" + "1"
    readonly subtasks: Set<string> = new Set();
    readonly round: Round;

    users: Map<string, Map<string, number>> = new Map();
    // leaderboard is cached, when a user is updated it is cleared
    leaderboard: Map<string, number> | undefined = undefined;

    constructor(round: Round) {
        this.round = round;
    }

    /**
     * Add or edit user (or team the scorer doesnt care) to leaderboard
     * Note that we only care about submission.scores so you can change the params to make it more convenient
     * @param {Submission} submission the submission (with COMPLETE SCORES)
     * @returns {Boolean} whether it was successful
     */
    updateUser(submission: Submission): Boolean {
        const userScores = new Map<string, number>();
        for (const score of submission.scores) {
            this.subtasks.add(submission.problemId + score.subtask.toString());
        }
        for (const i of this.subtasks) {
            userScores.set(submission.problemId + i, submission.scores.some((s: Score) => s.state != ScoreState.CORRECT && s.subtask === i) ? -1 : submission.time);
        }
        for (const s of this.subtasks) {
            if (userScores.get(s) == undefined) {
                userScores.set(s, -1);
            }
        }
        this.users.set(submission.username, userScores);
        this.leaderboard = undefined;
        return true;
    }

    /**
     * Get the leaderboard ig
     * @returns {Map<string, number>} mapping of username to score
     */
    getScores(): Map<string, number> {
        if (this.leaderboard == undefined) {
            const subtaskCount = new Map<string, number>();
            for (const s of this.subtasks) {
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
            this.subtasks.forEach((id) => {
                subtaskSolved.set(id, 0);
            });
            this.users.forEach((value, key) => {
                value.forEach((solved, subtask) => {
                    if (solved !== -1) {
                        const c = subtaskSolved.get(subtask);
                        if (c !== undefined) {
                            subtaskSolved.set(subtask, c + 1);
                        }
                    }
                });
            });
            let maxScore = 0;
            this.subtasks.forEach((id) => {
                const s = subtaskSolved.get(id);
                const c = subtaskCount.get(id);
                if (s !== undefined && c !== undefined) {
                    if (s == 0) maxScore += 1 / c;
                    else maxScore += Math.log(s + 1) / (s * c);
                }
            });
            const scores = new Map<string, number>();
            this.users.forEach((value, key) => {
                let score = 0;
                let last = this.round.startTime;
                value.forEach((solved, subtask) => {
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
                scores.set(key, score / maxScore * 1000 - 0.001 * (last - this.round.startTime) / (this.round.endTime - this.round.startTime));
            });
            return this.leaderboard = scores;
            // const scores = new Map<string, number>();
            // this.users.forEach((value, key) => {
            //     scores.set(key, 0);
            // });
            // for (const s of this.subtasks) {
            //     let count = 0;
            //     this.users.forEach((value, key) => {
            //         const val = value.get(s);
            //         if (val != undefined && val > 0) {
            //             count++;
            //         }
            //     });
            //     this.users.forEach((value, key) => {
            //         const val = value.get(s);
            //         if (val != undefined && val > 0) {
            //             const curValue = scores.get(key);
            //             if (curValue == undefined) return undefined;
            //             scores.set(key, curValue + Math.log(count + 1) / count * ((val - this.round.startTime) / (this.round.endTime - this.round.startTime) * -0.0001 + 1));
            //         }
            //     })
            // }
            // return this.leaderboard = scores;
        } else {
            return this.leaderboard;
        }
    }
}

export default Scorer;