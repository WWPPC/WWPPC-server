import Database, { Score, ScoreState } from "./database";

/**
 * Scorer class, supports adding and modifying user submission status, and can get scores of individual users and leaderboard.
 */
export class Scorer {

    readonly db: Database;
    readonly subtasks: Map<string, Subtask> = new Map();

    users: Map<string, Map<string, Boolean>> = new Map();

    constructor(db: Database, subtasks: Subtask[]) {
        this.db = db;
        for (const s of subtasks) {
            this.subtasks.set(s.id, s);
        }
    }
    
    /**
     * Add user (or team the scorer doesnt care) to leaderboard
     * @param {string} username username (or team name the scorer doesnt care)
     * @param scores object with the scores. Not all of them have to be filled in because
     */
    addUser(username: string, scores: {subtask: string, scores: Score[]}[]) {
        const userScores = new Map<string, Boolean>();
        for (const score of scores) {
            userScores.set(score.subtask, !score.scores.some((s: Score) => s.state != ScoreState.CORRECT) && score.scores.length > 0);
        }
        this.subtasks.forEach((value, key, map) => {
            if (userScores.get(key) == undefined) {
                userScores.set(key, false);
            }
        });
        this.users.set(username, userScores);
    }

    /**
     * Get the leaderboard ig
     * @returns {Map<string, number> | undefined} mapping of username to score, undefined if error oof
     */
    getScores(): Map<string, number> {
        const scores = new Map<string, number>();
        this.users.forEach((value, key) => {
            scores.set(key, 0);
        });
        this.subtasks.forEach((subtask, subtaskId) => {
            let count = 0;
            this.users.forEach((value, key) => {
                if (value.get(subtaskId)) {
                    count++;
                }
            });
            this.users.forEach((value, key) => {
                if (value.get(subtaskId)) {
                    const curValue = scores.get(key);
                    if (curValue == undefined) return undefined;
                    scores.set(key, curValue + Math.log(count+1)/count);
                }
            })
        });
        return scores;
    }
}

/** Subtask */
export interface Subtask {
    /** Problem associated with it */
    readonly problemId: string
    /** Id of subtask (just keep it consistent) */
    readonly id: string
    /** Weight of subtask when calculating score */
    weight: number
}

export default Scorer;