import { Round, ScoreState, Submission } from './database';
import Logger, { NamedLogger } from './log';
import { UUID } from './util';

/**
 * Scorer class, supports adding and modifying user submission status, and can get scores of individual users and leaderboard.
 * Assumes no subtasks
 * 1 point for each solved problem, ties broken by time of last submission that increases points, +10 minutes penalty for each wrong submission
 * power round gets triple points
 */
export class Scorer {
    private rounds: Round[];
    private submissions: Submission[] = [];
    // map team to round to ProblemSolveStatus
    private readonly teamSolveStatus: Map<number, Map<UUID, ProblemSolveStatus[]>> = new Map();
    readonly logger: NamedLogger;

    /**
     * @param rounds Contest rounds
     * @param logger Logger instance
     * @param scoringFunction Scoring function
     */
    constructor(rounds: Round[], logger: Logger) {
        this.logger = new NamedLogger(logger, 'Scorer');
        this.rounds = rounds;
    }

    setRounds(rounds: Round[]) {
        this.rounds = rounds.slice();
        this.teamSolveStatus.clear();
        const submissions2 = structuredClone(this.submissions);
        this.submissions = [];
        for (const i of submissions2) this.addSubmission(i);
    }

    private createEmptySolveStatusMap(team: number) {
        const nxt = new Map<UUID, ProblemSolveStatus[]>();
        for (const i of this.rounds) {
            const arr = Array<ProblemSolveStatus>(i.problems.length);
            //avoid the reference bug
            for (let j = 0; j < i.problems.length; j++) {
                arr[j] = {
                    round: i.id,
                    problem: i.problems[j],
                    solveTime: -1,
                    solved: false,
                    incorrectSubmissions: 0
                }
            }
            nxt.set(i.id, arr);
        }
        this.teamSolveStatus.set(team, nxt);
    }

    /**
     * Process submission and add to leaderboard.
     * @param submission The scored submission
     * @param submissionRound (optional) round UUID. If this isn't passed in, we look it up from the loaded rounds
     * @returns  whether it was successful
     */
    addSubmission(submission: Submission, submissionRound?: UUID): boolean {
        if (submission.team === null) return false;
        submissionRound ??= this.rounds.find((round) => round.problems.some((id) => id == submission.problemId))?.id;
        if (submissionRound === undefined) {
            this.logger.error(`Problem ID (${submission.problemId}) of submission not found in round data`);
            return false;
        }

        this.submissions.push(submission);
        if (!this.teamSolveStatus.has(submission.team)) {
            this.createEmptySolveStatusMap(submission.team);
        }
        const solveStatus = this.teamSolveStatus.get(submission.team)!;

        const problemIndex = this.rounds.find(i => i.id === submissionRound)!.problems.indexOf(submission.problemId);
        const pass = submission.scores.every(s => s.state === ScoreState.PASS);
        const prob = solveStatus.get(submissionRound)![problemIndex];
        if (pass) {
            prob.solveTime = submission.time;
            prob.solved = true;
        } else {
            prob.incorrectSubmissions++;
        }

        return true;
    }

    /**
     * Get solve status for a specific round
     * @returns  Mapping of team to solve status
     */
    getRoundSolveStatus(roundId: UUID): Map<number, ProblemSolveStatus[]> {
        const round = this.rounds.find(r => r.id == roundId);
        if (round === undefined) {
            this.logger.error(`Round ID (${roundId}) not found in loaded rounds!`);
            throw Error(`Round ID (${roundId}) not found in loaded rounds!`);
        }

        const sums: Map<number, ProblemSolveStatus[]> = new Map();
        for (const team of this.teamSolveStatus.keys()) {
            sums.set(team, this.teamSolveStatus.get(team)!.get(roundId)!);
        }
        return sums;
    }

    /**
     * Get solve status, adding solve status from all rounds together.
     * @returns  Mapping of team to solve status
     */
    getSolveStatus(): Map<number, ProblemSolveStatus[]> {
        const sums: Map<number, ProblemSolveStatus[]> = new Map();
        for (const round of this.rounds) {
            this.getRoundSolveStatus(round.id).forEach((solveStatus, team) => {
                const cur = sums.get(team);
                if (cur) sums.set(team, cur.concat(solveStatus));
                else sums.set(team, solveStatus);
            });
        }
        return sums;
    }

    /**
     * Get standings for a specified round.
     * @param roundId Round ID
     * @returns  Mapping of team to score
     */
    getRoundScores(roundId: UUID): Map<number, TeamScore> {
        const round = this.rounds.find(r => r.id == roundId);
        if (round === undefined) {
            this.logger.error(`Round ID (${roundId}) not found in loaded rounds!`);
            throw Error(`Round ID (${roundId}) not found in loaded rounds!`);
        }

        const teamRoundScores = new Map<number, TeamScore>();
        for(const team of this.teamSolveStatus.keys()) {
            const sum: TeamScore = { score: 0, penalty: 0 };
            const solveStatus = this.teamSolveStatus.get(team)!.get(roundId)!;
            for (let i = 0; i < solveStatus.length; i++) {
                if (solveStatus[i].solved) {
                    sum.score++;
                    sum.penalty += solveStatus[i].incorrectSubmissions * 10*60*1000; //convert 10 minutes to ms
                }
            }
            //if they solved at least one problem, then add penalty based on last solve
            if (solveStatus.some(v => v.solved)) {
                sum.penalty += Math.max(...solveStatus.map(v => v.solveTime)) - round.startTime;
            }
            teamRoundScores.set(team, sum);
        }

        return teamRoundScores;
    }

    /**
     * Get the current standings, adding scores from all rounds together.
     * @returns  mapping of team to score
     */
    getScores(): Map<number, TeamScore> {
        const sums: Map<number, TeamScore> = new Map();
        for (const round of this.rounds) {
            const roundScoreMultiplier = Math.round((round.endTime - round.startTime) / (1000 * 60 * 60));
            this.getRoundScores(round.id).forEach((score, team) => {
                const cur = sums.get(team);
                if (cur) sums.set(team, { score: cur.score + roundScoreMultiplier * score.score, penalty: cur.penalty + score.penalty });
                else sums.set(team, { score: score.score * roundScoreMultiplier, penalty: score.penalty });
            });
        }
        return sums;
    }

    /**
     * Get the current standings AND the solve statuses
     * @returns  mapping of team to score/solve status
     */
    getScoreSolveStatus(): Map<number, ClientScoreSolveStatus> {
        const sums: Map<number, ClientScoreSolveStatus> = new Map();
        const scores = this.getScores();
        const solveStatus = this.getSolveStatus();
        for (const i of scores.keys()) {
            sums.set(i, { score: scores.get(i)!.score, penalty: scores.get(i)!.penalty, solveStatus: solveStatus.get(i)!.map(v => {
                const round = this.rounds.findIndex(r => r.id === v.round);
                const problem = this.rounds[round].problems.indexOf(v.problem);
                return {
                    ...v,
                    round: round,
                    problem: problem
                }
            }) });
        }
        return sums;
    }

    /**
     * Remove all existing scores and submissions.
     */
    clearScores() {
        this.teamSolveStatus.clear();
        this.submissions = [];
    }
}

/**Team score */
export type TeamScore = {
    /**Score */
    score: number
    /**Penalty (useful if a certain score appears many times) */
    penalty: number
}

/**Stores all the data about when/how/number of wa before solving a problem */
export type ProblemSolveStatus = {
    /**round */
    round: UUID
    /**problem id */
    problem: UUID
    /**solve time */
    solveTime: number
    /**solved */
    solved: boolean
    /**number of submissions that were not correct */
    incorrectSubmissions: number
}

/**Scoreboard entry enumerating each problem solve status for a team */
export type ClientScoreSolveStatus = {
    solveStatus: {
        round: number
        problem: number
        solveTime: number
        solved: boolean
        incorrectSubmissions: number
    }[]
} & TeamScore

export default Scorer;