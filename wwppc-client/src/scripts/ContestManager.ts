import { defineStore } from 'pinia';
import { reactive } from 'vue';

import { useServerConnection } from './ServerConnection';

export interface Contest {
    id: string
    rounds: ContestRound[]
    startTime: number
    endtime: number
}
export interface ContestRound {
    contest: string
    number: number
    problems: ContestProblemMetaData[]
    startTime: number
    endTime: number
}
export interface ContestProblemMetaData {
    id: string
    contest: string
    round: number
    number: number
    name: string
    author: string
    status: ContestProblemCompletionState
}
export interface ContestProblem {
    id: string
    contest: string | undefined
    round: number | undefined
    number: number | undefined
    name: string
    author: string
    content: string
    constraints: { memory: number, time: number }
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

export const completionStateAnimation = (status: ContestProblemCompletionState) => {
    return status == ContestProblemCompletionState.NOT_UPLOADED ? 'pstatus-not-uploaded' :
        status == ContestProblemCompletionState.UPLOADED ? 'pstatus-uploaded' :
            status == ContestProblemCompletionState.SUBMITTED ? 'pstatus-submitted' :
                status == ContestProblemCompletionState.GRADED_PASS ? 'pstatus-graded-pass' :
                    status == ContestProblemCompletionState.GRADED_FAIL ? 'pstatus-graded-fail' :
                        status == ContestProblemCompletionState.GRADED_PARTIAL ? 'pstatus-graded-partial' : 'pstatus-error'
};
export const completionStateString = (status: ContestProblemCompletionState) => {
    return status == ContestProblemCompletionState.NOT_UPLOADED ? 'Not uploaded' :
        status == ContestProblemCompletionState.UPLOADED ? 'Uploaded' :
            status == ContestProblemCompletionState.SUBMITTED ? 'Submitted' :
                status == ContestProblemCompletionState.GRADED_PASS ? 'Accepted' :
                    status == ContestProblemCompletionState.GRADED_FAIL ? 'Failed' :
                        status == ContestProblemCompletionState.GRADED_PARTIAL ? 'Partially accepted' : 'Error fetching status'
};

const state = reactive<{
    inContest: boolean,
    currContest: string
}>({
    inContest: false,
    currContest: 'WWPITTEST' //for testing, set back to ''
});

export const useContestManager = defineStore('contestManager', {
    state: () => state,
    actions: {
        async getContestData(): Promise<Contest> {
            
        },
        async getProblemList(): Promise<ContestRound[]> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return [];
            return await new Promise((resolve) => {
                const token = Math.random();
                serverConnection.emit('getProblemList', { contest: state.currContest, token });
                const handle = ({ data, token: token2 }: { data: ContestRound[], token: number }) => {
                    if (token2 != token) return;
                    resolve(data);
                    serverConnection.off('problemList', handle);
                };
                serverConnection.on('problemList', handle);
            })
        },
        async getProblemData(round: number, number: number): Promise<{ problem: ContestProblem | null, submission: ContestSubmission | null }> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return { problem: null, submission: null };
            return await new Promise((resolve) => {
                const token = Math.random();
                serverConnection.emit('getProblemData', { contest: state.currContest, round, number, token });
                const handle = ({ problem, submission, token: token2 }: { problem: ContestProblem | null, submission: ContestSubmission | null, token: number }) => {
                    if (token2 != token) return;
                    resolve({ submission, problem });
                    serverConnection.off('problemData', handle);
                };
                serverConnection.on('problemData', handle);
            });
        },
        async getProblemDataId(id: string): Promise<{ problem: ContestProblem | null, submission: ContestSubmission | null }> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return { problem: null, submission: null };
            return await new Promise((resolve) => {
                const token = Math.random();
                serverConnection.emit('getProblemData', { id, token });
                const handle = ({ problem, submission, token: token2 }: { problem: ContestProblem | null, submission: ContestSubmission | null, token: number }) => {
                    if (token2 != token) return;
                    resolve({ submission, problem });
                    serverConnection.off('problemData', handle);
                };
                serverConnection.on('problemData', handle);
            });
        },
        async getArchiveProblemData(id: string): Promise<ArchiveProblem | null> {
            const serverConnection = useServerConnection();
            const res = await serverConnection.apiFetch('GET', '/problemArchive/' + id);
            if (res === null) return null;
            else return {
                id: res.id,
                name: res.name,
                author: res.author,
                content: res.content,
                cases: res.cases,
                constraints: res.constraints
            };
        },
        async updateSubmission(problemId: string, lang: string, file: string): Promise<void> {
            const serverConnection = useServerConnection();
            serverConnection.emit('updateSubmission', { problemId, lang, file });
        },
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

window.addEventListener('load', () => {
    const serverConnection = useServerConnection();
    serverConnection.handshakePromise.then(() => {
        serverConnection.on('roundData', (rounds: ContestRound[]) => {
            console.log(rounds)
        });
    });
});