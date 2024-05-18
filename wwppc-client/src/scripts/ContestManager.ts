import { defineStore } from 'pinia';
import { reactive } from 'vue';

import { socket, useServerConnection } from './ServerConnection';

export interface Contest {
    id: string
    rounds: ContestRound[]
    startTime: number
    endtime: number
}
export interface ContestRound {
    contest: string
    number: number
    problems: ContestProblem[]
    startTime: number
    endTime: number
}
export interface ContestProblem {
    id: string
    contest: string
    round: number
    number: number
    name: string
    author: string
    content: string
    constraints: { memory: number, time: number }
    submissions: ContestSubmission[]
    status: ContestProblemCompletionState
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
export interface ContestSubmission {
    time: number
    scores: ContestScore[]
    status: ContestProblemCompletionState
}
export interface ContestScore {
    /**Pass/fail status */
    state: ContestScoreState
    /**Time taken in ms */
    time: number
    /**Memory taken in MB */
    memory: number
}
export enum ContestScoreState {
    CORRECT = 1,
    INCORRECT = 2,
    TIME_LIM_EXCEEDED = 3,
    MEM_LIM_EXCEEDED = 4,
    RUNTIME_ERROR = 5
}

export interface ArchiveProblem {
    id: string
    name: string
    author: string
    content: string
    cases: { input: string, output: string }[]
    constraints: { memory: number, time: number }
}

export const completionStateString = (status: ContestProblemCompletionState) => {
    return status == ContestProblemCompletionState.NOT_UPLOADED ? 'Not uploaded' :
        status == ContestProblemCompletionState.UPLOADED ? 'Uploaded' :
            status == ContestProblemCompletionState.SUBMITTED ? 'Submitted' :
                status == ContestProblemCompletionState.GRADED_PASS ? 'Accepted' :
                    status == ContestProblemCompletionState.GRADED_FAIL ? 'Failed' :
                        status == ContestProblemCompletionState.GRADED_PARTIAL ? 'Partially accepted' : 'Error fetching status'
};

// replace with new state variable that is just Contest
const state = reactive<{
    contest: Contest | null
}>({
    contest: null
});

export const useContestManager = defineStore('contestManager', {
    state: () => state,
    actions: {
        async getContestList(): Promise<string[] | null> {
            const serverConnection = useServerConnection();
            const res: string[] | null = await serverConnection.apiFetch('GET', '/contestList/');
            return res;
        },
        getProblemData(round: number, number: number): ContestProblem | null {
            return state.contest?.rounds[round]?.problems[number] ?? null;
        },
        getProblemDataId(id: string): ContestProblem | null {
            return state.contest?.rounds.flatMap((r) => r.problems).find((p) => p.id === id) ?? null;
        },
        // server-driven contest list
        async getArchiveProblemData(id: string): Promise<ArchiveProblem | null> {
            const serverConnection = useServerConnection();
            const res: ArchiveProblem | null = await serverConnection.apiFetch('GET', '/problemArchive/' + id);
            return res;
        },
        async updateSubmission(problemId: string, lang: string, file: string): Promise<ContestSubmission | null> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return null;
            return await new Promise((resolve) => {
                serverConnection.emit('updateSubmission', { id: problemId, file, lang });
                const handle = (id: string, status: ContestSubmission) => {
                    if (id != problemId) return;
                    resolve(status);
                    serverConnection.off('submissionStatus', handle);
                };
                serverConnection.on('submissionStatus', handle);
            });
        },
        // replace these with refs/reactive objects that can be watched for updates
        async onSubmissionStatus(cb: ({ status }: { status: ContestSubmission }) => any) {
            const serverConnection = useServerConnection();
            serverConnection.on('submissionStatus', cb);
        },
        async offSubmissionStatus(cb: ({ status }: { status: ContestSubmission }) => any) {
            const serverConnection = useServerConnection();
            serverConnection.off('submissionStatus', cb);
        }
    }
});

// prevent circular dependency nuke
window.addEventListener('DOMContentLoaded', () => {
    socket.on('contestData', (data: Contest) => {
        state.contest = data;
    });
});