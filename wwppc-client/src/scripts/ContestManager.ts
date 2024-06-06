import { defineStore } from 'pinia';
import { reactive, watch } from 'vue';

import { apiFetch, socket, useServerConnection } from './ServerConnection';

export interface Contest {
    readonly id: string
    rounds: ContestRound[]
    startTime: number
    endTime: number
}
export interface ContestRound {
    readonly contest: string
    readonly number: number
    problems: ContestProblem[]
    startTime: number
    endTime: number
}
export interface ContestProblem {
    readonly id: string
    readonly contest: string
    readonly round: number
    readonly number: number
    name: string
    author: string
    content: string
    constraints: { memory: number, time: number }
    submissions: ContestSubmission[]
    status: ContestProblemCompletionState
}
export interface ContestSubmission {
    time: number
    lang: string
    scores: ContestScore[]
    status: ContestProblemCompletionState
}
export interface ContestScore {
    state: ContestScoreState
    time: number
    memory: number
    subtask: number
}
export enum ContestScoreState {
    CORRECT = 1,
    INCORRECT = 2,
    TIME_LIM_EXCEEDED = 3,
    MEM_LIM_EXCEEDED = 4,
    RUNTIME_ERROR = 5,
    COMPILE_ERROR = 6
}
export enum ContestProblemCompletionState {
    /**Not attempted */
    NOT_UPLOADED = 0,
    /**Uploaded but not graded, can still be changed */
    UPLOADED = 1,
    /**Submitted but not graded, submissions locked */
    SUBMITTED = 2,
    /**Submitted, graded, and passed all tests */
    GRADED_PASS = 3,
    /**Submitted, graded, and failed all tests */
    GRADED_FAIL = 4,
    /**Submitted, graded, and only passed some tests */
    GRADED_PARTIAL = 5,
    /**Error loading status */
    ERROR = 6
}
export enum ContestUpdateSubmissionResult {
    SUCCESS = 0,
    FILE_TOO_LARGE = 1,
    LANGUAGE_NOT_ACCEPTABLE = 2,
    PROBLEM_NOT_SUBMITTABLE = 3,
    ERROR = 4,
    NOT_CONNECTED = 5
}
export const getUpdateSubmissionMessage = (res: number): string => {
    return res == ContestUpdateSubmissionResult.SUCCESS ? 'Success' : res == ContestUpdateSubmissionResult.FILE_TOO_LARGE ? 'File too large' : res == ContestUpdateSubmissionResult.LANGUAGE_NOT_ACCEPTABLE ? 'Selected language not allowed' : res == ContestUpdateSubmissionResult.PROBLEM_NOT_SUBMITTABLE ? 'Problem not accepting submissions' : res == ContestUpdateSubmissionResult.ERROR ? 'Database error' : res == ContestUpdateSubmissionResult.NOT_CONNECTED ? 'Not connected to server' : 'Unknown response code (this is a bug?)';
};

export interface ScoreboardEntry {
    username: string
    score: number
}

export const completionStateString = (status: ContestProblemCompletionState) => {
    return status == ContestProblemCompletionState.NOT_UPLOADED ? 'Not uploaded' :
        status == ContestProblemCompletionState.UPLOADED ? 'Uploaded' :
            status == ContestProblemCompletionState.SUBMITTED ? 'Submitted' :
                status == ContestProblemCompletionState.GRADED_PASS ? 'Accepted' :
                    status == ContestProblemCompletionState.GRADED_FAIL ? 'Failed' :
                        status == ContestProblemCompletionState.GRADED_PARTIAL ? 'Partially accepted' : 'Error fetching status'
};

export const nextContest = new Date('6/2/2024 9:30 AM EST');
export const nextContestEnd = new Date('6/2/2024 5:00 PM EST');

const state = reactive<{
    contest: Contest | null
    scoreboard: ScoreboardEntry[] | null
}>({
    contest: null,
    scoreboard: null
});

export const useContestManager = defineStore('contestManager', {
    state: () => state,
    actions: {
        async getContestList(): Promise<string[] | Error> {
            return await apiFetch('GET', '/contestList');
        },
        async waitForContestLoad() {
            if (state.contest != null) return;
            await new Promise((resolve) => watch(() => state.contest, () => {
                if (state.contest != null) resolve;
            }));
        },
        async getProblemData(round: number, number: number): Promise<ContestProblem | null> {
            return state.contest?.rounds[round]?.problems[number] ?? null;
        },
        async getProblemDataId(id: string): Promise<ContestProblem | null> {
            for (const round of (state.contest?.rounds ?? [])) {
                const p = round.problems.find((p) => p.id === id);
                if (p != undefined) return p;
            }
            return null;
        },
        async updateSubmission(problemId: string, lang: string, file: string): Promise<ContestUpdateSubmissionResult> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return ContestUpdateSubmissionResult.NOT_CONNECTED;
            return await serverConnection.emitWithAck('updateSubmission', { id: problemId, file, lang });
        }
    }
});

// prevent circular dependency nuke
window.addEventListener('DOMContentLoaded', () => {
    socket.on('contestData', (data: Contest) => {
        state.contest = data;
    });
    socket.on('scoreboard', (data: ScoreboardEntry[]) => {
        state.scoreboard = data;
    });
    const serverConnection = useServerConnection();
    serverConnection.ondisconnect(() => {
        state.contest = null;
        state.scoreboard = null;
    });
});