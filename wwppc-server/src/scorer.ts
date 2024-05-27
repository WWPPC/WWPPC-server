import Database, { Problem, Round, Score, ScoreState, Submission } from "./database";

/**
 * Scorer class, supports adding and modifying user submission status, and can get scores of individual users and leaderboard.
 */
export class Scorer {

    //format: problemId.concat(subtask.toString())
    //ex: "5d31e716-474b-4f7b-9a9a-bf43e444c79b" + "1"
    readonly subtasks: Set<string> = new Set();

    users: Map<string, Map<string, Boolean>> = new Map();
    //leaderboard is cached, when a user is updated it is cleared
    leaderboard: Map<string, number> | undefined = undefined;

    constructor(problems: Problem[]) {
        for (const problem of problems) {
            for (const testCase of problem.cases) {
                this.subtasks.add(problem.id+testCase.subtask);
            }
        }
    }
    
    /**
     * Add or edit user (or team the scorer doesnt care) to leaderboard
     * Note that we only care about submission.scores so you can change the params to make it more convenient
     * @param {Submission} submission the submission (with COMPLETE SCORES)
     * @returns {Boolean} whether it was successful
     */
    async editUser(submission: Submission): Promise<Boolean> {
        const userScores = new Map<string, Boolean>();
        const subtasks = new Set<number>();
        for (const score of submission.scores) {
            subtasks.add(score.subtask);
        }
        for (const i of subtasks) {
            userScores.set(submission.problemId+i, !submission.scores.some((s: Score) => s.state != ScoreState.CORRECT && s.subtask === i));
        }
        for (const s of this.subtasks) {
            if (userScores.get(s) == undefined) {
                userScores.set(s, false);
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
            const scores = new Map<string, number>();
            this.users.forEach((value, key) => {
                scores.set(key, 0);
            });
            for (const s of this.subtasks) {
                let count = 0;
                this.users.forEach((value, key) => {
                    if (value.get(s)) {
                        count++;
                    }
                });
                this.users.forEach((value, key) => {
                    if (value.get(s)) {
                        const curValue = scores.get(key);
                        if (curValue == undefined) return undefined;
                        scores.set(key, curValue + Math.log(count+1)/count);
                    }
                })
            }
            return this.leaderboard = scores;
        } else {
            return this.leaderboard;
        }
    }
}

export default Scorer;