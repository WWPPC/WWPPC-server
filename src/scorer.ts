import { Round, ScoreState, Submission } from './database';
import Logger, { NamedLogger } from './log';
import { UUID } from './util';

/**Team score */
export type TeamScore = {
    /**Score */
    score: number
    /**Penalty (useful if a certain score appears many times) */
    penalty: number
}

/**
 * Scorer class, supports adding and modifying user submission status, and can get scores of individual users and leaderboard.
 * Assumes no subtasks
 * 1 point for each solved problem, ties broken by time of last submission that increases points, +10 minutes penalty for each wrong submission
 */
export class Scorer {
    private rounds: Round[];
    private submissions: Submission[] = [];
    // map(team => (map(round id => array(solve time if solved else -1))))
    private readonly teamScores: Map<number, Map<UUID, number[]>> = new Map();
    //penalties stored in milliseconds
    private readonly teamPenalties: Map<number, Map<UUID, number[]>> = new Map();
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
        this.teamScores.clear();
        this.teamPenalties.clear();
        const submissions2 = structuredClone(this.submissions);
        this.submissions = [];
        for (const i of submissions2) this.addSubmission(i);
    }

    private createEmptyScoreMap(team: number) {
        const nxt = new Map<UUID, number[]>();
        for (const i of this.rounds) {
            nxt.set(i.id, Array<number>(i.problems.length).fill(-1));
        }
        this.teamScores.set(team, nxt);
    }
    private createEmptyPenaltyMap(team: number) {
        const nxt = new Map<UUID, number[]>();
        for (const i of this.rounds) {
            nxt.set(i.id, Array<number>(i.problems.length).fill(0));
        }
        this.teamPenalties.set(team, nxt);
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
        if (!this.teamScores.has(submission.team)) {
            this.createEmptyScoreMap(submission.team);
            this.createEmptyPenaltyMap(submission.team);
        }
        const scores = this.teamScores.get(submission.team)!;
        const penalties = this.teamPenalties.get(submission.team)!;

        const problemIndex = this.rounds.find(i => i.id === submissionRound)!.problems.indexOf(submission.problemId);
        const pass = submission.scores.every(s => s.state === ScoreState.PASS);
        scores.get(submissionRound)![problemIndex] = pass ? submission.time : -1;
        
        //convert 10 minutes to ms
        if (!pass) penalties.get(submissionRound)![problemIndex] += 10*60*1000;

        return true;
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
        for(const team of this.teamScores.keys()) {
            const score: TeamScore = { score: 0, penalty: 0 };
            const scores = this.teamScores.get(team)!.get(roundId)!;
            const penalties = this.teamPenalties.get(team)!.get(roundId)!;
            for(let i = 0; i < scores.length; i++) {
                score.score += scores[i] === -1 ? 0 : 1;
                score.penalty += scores[i] === -1 ? 0 : penalties[i];
            }
            //if they solved at least one problem, then add penalty based on last solve
            if (scores.some(val => val != -1)) {
                score.penalty += Math.max(...scores) - round.startTime;
            }
            teamRoundScores.set(team, score);
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
                else sums.set(team, score);
            });
        }
        return sums;
    }

    /**
     * Remove all existing scores and submissions.
     */
    clearScores() {
        this.teamScores.clear();
        this.teamPenalties.clear();
        this.submissions = [];
    }
}

export default Scorer;