import { Round, ScoreState, Submission } from './database';
import Logger, { NamedLogger } from './log';
import { UUID } from './util';

/**Subtask (as used by Scorer class) */
type Subtask = {
    /**Round id */
    round: UUID
    /**Problem id */
    id: UUID
    /**Subtask id */
    number: number
}

/**Team score */
export type TeamScore = {
    /**Score */
    score: number
    /**Penalty (useful if a certain score appears many times) */
    penalty: number
}

/**
 * Function used by `Scorer` to assign point values to submissions.
 */
export type ScoringFunction = (submission: { time: number }, problem: { numSubtasks: number }, round: { startTime: number, endTime: number }) => TeamScore;

/**
 * Scorer class, supports adding and modifying user submission status, and can get scores of individual users and leaderboard.
 */
export class Scorer {
    private rounds: Round[];
    private readonly teamSolvedStatus: Map<number, Map<Subtask, number>> = new Map();
    private readonly subtasks: Set<Subtask> = new Set();
    readonly scoringFunction: ScoringFunction;
    readonly logger: NamedLogger;

    /**
     * @param rounds Contest rounds
     * @param logger Logger instance
     * @param scoringFunction Scoring function
     */
    constructor(rounds: Round[], logger: Logger, scoringFunction: ScoringFunction) {
        this.rounds = rounds.slice();
        this.logger = new NamedLogger(logger, 'Scorer');
        this.scoringFunction = scoringFunction;
    }

    setRounds(rounds: Round[]) {
        this.rounds = rounds.slice();
    }

    /**
     * Process submission and add to leaderboard.
     * @param submission The scored submission
     * @param submissionRound (optional) round UUID. If this isn't passed in, we look it up from the loaded rounds
     * @returns  whether it was successful
     */
    addSubmission(submission: Submission, submissionRound?: UUID): Boolean {
        if (submission.team === null) return false;
        const teamScores = this.teamSolvedStatus.get(submission.team) ?? new Map<Subtask, number>();
        //add new subtasks
        for (const score of submission.scores) {
            let alreadyExists = false;
            for (const i of this.subtasks) {
                alreadyExists = i.id === submission.problemId && i.number == score.subtask;
                if (alreadyExists) break;
            }
            if (!alreadyExists) {
                //if submissionRound isn't passed in, look it up from the loaded rounds
                submissionRound ??= this.rounds.find((round) => round.problems.some((id) => id == submission.problemId))?.id;
                if (submissionRound === undefined) {
                    this.logger.error(`Problem ID (${submission.problemId}) of submission not found in round data`);
                    return false;
                }
                this.subtasks.add({
                    round: submissionRound,
                    id: submission.problemId,
                    number: score.subtask
                });
            }
        }
        //put in the scores from the submission
        for (const subtask of this.subtasks) {
            if (subtask.id === submission.problemId && teamScores.get(subtask) === undefined && submission.scores.every(score => score.subtask !== subtask.number || score.state === ScoreState.PASS)) {
                teamScores.set(subtask, submission.time);
            }
        }
        this.teamSolvedStatus.set(submission.team, teamScores);
        return true;
    }

    /**
     * Get standings for a specified round.
     * @param roundId Round ID
     * @returns  Mapping of team to score
     */
    getRoundScores(roundId: UUID): Map<number, TeamScore> {
        const subtaskSolved = new Map<Subtask, number>(); // how many users solved each subtask
        const problemSubtasks = new Map<UUID, Subtask[]>(); // which subtasks are assigned to which problem
        const teamScores = new Map<number, TeamScore>(); // final scores of each team
        const round = this.rounds.find(r => r.id == roundId);
        if (round === undefined) {
            this.logger.error(`Round ID (${roundId}) not found in loaded rounds!`);
            throw Error(`Round ID (${roundId}) not found in loaded rounds!`);
        }

        //find how many teams solved each subtask
        this.teamSolvedStatus.forEach((scores) => {
            scores.forEach((solveTime, subtask) => {
                if (subtask.round == roundId) {
                    subtaskSolved.set(subtask, (subtaskSolved.get(subtask) ?? 0) + 1);
                }
            })
        });

        //group subtasks by problem id
        subtaskSolved.forEach((numSolved, subtask) => {
            const problem = problemSubtasks.get(subtask.id);
            if (problem === undefined) problemSubtasks.set(subtask.id, [subtask]);
            else problemSubtasks.set(subtask.id, problem.concat([subtask]));
        });

        //calculate actual scores for each user
        this.teamSolvedStatus.forEach((solved, team) => {
            let score: TeamScore = { score: 0, penalty: 0 };
            solved.forEach((solveTime, subtask) => {
                const numSubtasks = problemSubtasks.get(subtask.id)?.length;
                const numSolved = subtaskSolved.get(subtask);
                //not explicity comparing to undefined is safe because there has to be at least one solve
                if (numSubtasks && numSolved) {
                    const subtaskScore = this.scoringFunction({ time: solveTime }, { numSubtasks }, { startTime: round.startTime, endTime: round.endTime });
                    score.score += subtaskScore.score;
                    score.penalty += subtaskScore.penalty;
                    // score += weight * (1 - (solveTime - round.startTime) / (1000*60*1000000));
                }
            });
            teamScores.set(team, score);
        });
        return teamScores;
    }

    /**
     * Get the current standings, adding scores from all rounds together.
     * @returns  mapping of team to score
     */
    getScores(): Map<number, TeamScore> {
        const sums: Map<number, TeamScore> = new Map();
        for (const round of this.rounds) {
            this.getRoundScores(round.id).forEach((score, team) => {
                const cur = sums.get(team);
                if (cur) sums.set(team, { score: cur.score + score.score, penalty: cur.penalty + score.penalty });
                else sums.set(team, score);
            });
        }
        return sums;
    }

    /**
     * Remove all existing scores.
     */
    clearScores() {
        this.teamSolvedStatus.clear();
    }
}

export default Scorer;