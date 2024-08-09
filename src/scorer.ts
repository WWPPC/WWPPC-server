import { Round, ScoreState, Submission } from './database';
import Logger, { NamedLogger } from './log';
import { UUID } from './util';

/**
 * Scorer class, supports adding and modifying user submission status, and can get scores of individual users and leaderboard.
 * Using the function score = 1/cnt where cnt is number of people who solved the problem
 */
export class Scorer {
    #rounds: Round[];
    readonly #subtasks: Set<Subtask> = new Set();
    #userSolvedStatus: Map<string, Map<Subtask, number>> = new Map();
    readonly logger: NamedLogger;

    /**
     * @param {Round[]} rounds Contest rounds
     * @param {Logger} logger Logger instance
     */
    constructor(rounds: Round[], logger: Logger) {
        this.#rounds = rounds;
        this.logger = new NamedLogger(logger, 'Scorer');
    }

    set rounds(rounds: Round[]) {
        this.#rounds = rounds;
    }

    /**
     * Process submission and add to leaderboard
     * @param {Submission} submission the scored submission
     * @param {UUID} submissionRound (optional) round UUID
     * @returns {Boolean} whether it was successful
     */
    updateUser(submission: Submission, submissionRound?: UUID): Boolean {
        const userScores = this.#userSolvedStatus.get(submission.username) ?? new Map<Subtask, number>();
        //add new subtasks
        for (const score of submission.scores) {
            let alreadyExists = false;
            for (const i of this.#subtasks) {
                alreadyExists = i.id === submission.problemId && i.number == score.subtask;
                if (alreadyExists) break;
            }
            if (!alreadyExists) {
                //if submissionRound isn't passed in, look it up from the loaded rounds
                submissionRound ??= this.#rounds.find((round) => round.problems.some((id) => id == submission.problemId))?.id;
                if (submissionRound === undefined) {
                    this.logger.error(`Problem ID (${submission.problemId}) of submission not found in round data`);
                    return false;
                }
                this.#subtasks.add({
                    round: submissionRound,
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
     * Get standings for a specified round.
     * @param {UUID} roundId Round ID
     * @returns {Map<string, number>} Mapping of username to score
     */
    getRoundScores(roundId: UUID): Map<string, number> {
        const subtaskSolved = new Map<Subtask, number>(); // how many users solved each subtask
        const problemSubtasks = new Map<UUID, Subtask[]>(); // which subtasks are assigned to which problem
        const problemWeight = new Map<UUID, number>(); // how much to weight each problem
        const userScores = new Map<string, number>(); // final scores of each user
        const round = this.#rounds.find(r => r.id == roundId);
        if (round == undefined) {
            this.logger.error(`Round ID (${roundId}) not found in loaded rounds!`);
            throw Error(`Round ID (${roundId}) not found in loaded rounds!`);
        }

        //set everything to 0
        this.#subtasks.forEach((subtask) => {
            if (subtask.round === roundId) subtaskSolved.set(subtask, 0);
        });

        //find how many users solved each subtask
        this.#userSolvedStatus.forEach((scores) => {
            scores.forEach((solveTime, subtask) => {
                const c = subtaskSolved.get(subtask);
                if (c !== undefined) {
                    subtaskSolved.set(subtask, c + 1);
                }
            })
        });

        //group subtasks by problem id
        subtaskSolved.forEach((numSolved, subtask) => {
            const problem = problemSubtasks.get(subtask.id);
            //probably no pass by reference issues?
            if (problem === undefined) problemSubtasks.set(subtask.id, [subtask]);
            else problemSubtasks.set(subtask.id, problem.concat([subtask]));
        });
        //weight subtasks so that problems with more subtasks aren't weighted too high
        problemSubtasks.forEach((subtasks, problem) => {
            problemWeight.set(problem, 1 / subtasks.length);
        });

        //calculate actual scores for each user
        this.#userSolvedStatus.forEach((scores, username) => {
            let score = 0;
            scores.forEach((solveTime, subtask) => {
                const weight = problemWeight.get(subtask.id);
                const numSolved = subtaskSolved.get(subtask);
                if (weight !== undefined && numSolved !== undefined) {
                    //score function: 1/x * (time penalty linear from 1.0 -> 0.9)
                    const baseScore = weight * 1 / numSolved;
                    score += baseScore * (0.9 + 0.1 * (round.endTime - solveTime) / (round.endTime - round.startTime));
                }
            });
            userScores.set(username, score);
        });
        return userScores;
    }

    /**
     * Get the current standings, adding scores from all rounds together.
     * @returns {Map<string, number>} mapping of username to score
     */
    getScores(): Map<string, number> {
        const sums: Map<string, number> = new Map();
        for (const round of this.#rounds) {
            this.getRoundScores(round.id).forEach((score, username) => {
                if (sums.has(username)) sums.set(username, sums.get(username)! + score);
                else sums.set(username, score);
            });
        }
        return sums;
    }
}

/**Subtask */
export interface Subtask {
    /**Round id */
    round: UUID
    /**Problem id */
    id: UUID
    /**Subtask id */
    number: number
}

export default Scorer;