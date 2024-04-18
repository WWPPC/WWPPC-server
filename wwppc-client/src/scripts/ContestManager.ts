import { defineStore } from 'pinia';
import { reactive } from 'vue';

import { useServerConnection } from './ServerConnection';

export interface ContestRound {
    contest: string
    number: number
    time: number
    problems: ContestProblemMetaData[]
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
    contest: string
    round: number
    number: number
    name: string
    author: string
    content: string
    constraints: { memory: number, time: number }
    status: ContestProblemCompletionState
}
/**Completion state of problems. */
export enum ContestProblemCompletionState {
    /**not attempted */
    NOT_UPLOADED = 0,
    /**uploaded (in case we want to have submissions graded at end of round) */
    UPLOADED = 1,
    /**submitted (but not graded yet) */
    SUBMITTED = 2,
    /**submitted, graded, and accepted */
    GRADED_PASS = 3,
    /**submitted, graded, and failed */
    GRADED_FAIL = 4,
    /**submitted, graded, and partially accepted */
    GRADED_PARTIAL = 5,
    /**error loading status */
    ERROR = 6
}
export interface ContestSubmission {
    time: number
    scores: ContestScore[]
}
export interface ContestScore {
    state: ContestScoreState
    time: number
    memory: number
}
export enum ContestScoreState {
    CORRECT = 1,
    INCORRECT = 2,
    TIME_LIM_EXCEEDED = 3,
    MEM_LIM_EXCEEDED = 4,
    RUNTIME_ERROR = 5
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

const state = reactive({
    inContest: false,
    problems: new Array<ContestProblem>()
    // contest timer
});

export const useContestManager = defineStore('contestManager', {
    state: () => state,
    actions: {
        async getProblemList(contest: string, round: number): Promise<ContestRound[]> {
            const serverConnection = useServerConnection();
            return await new Promise((resolve) => {
                const token = Math.random();
                serverConnection.emit('getProblemList', { contest, round, token });
                const handle = ({ data, token: token2 }: { data: ContestRound[], token: number }) => {
                    if (token2 != token) return;
                    resolve(data);
                    serverConnection.off('problemList', handle);
                };
                serverConnection.on('problemList', handle);
            })
        },
        async getProblemData(id: string): Promise<{ problem: ContestProblem, submission: ContestSubmission }> {
            const serverConnection = useServerConnection();
            return await new Promise((resolve) => {
                const token = Math.random();
                serverConnection.emit('getProblemData', { id, token });
                const handle = ({ problem, submission, token: token2 }: { problem: ContestProblem, submission: ContestSubmission, token: number }) => {
                    if (token2 != token) return;
                    resolve({ submission, problem });
                    serverConnection.off('problemData', handle);
                };
                serverConnection.on('problemData', handle);
            });
        },
        async updateSubmission(id: string, lang: string, file: string): Promise<void> {
            const serverConnection = useServerConnection();
            serverConnection.emit('updateSubmission', { id, lang, file });
        },
        async onSubmissionStatus(cb: ({ id }: { id: string}) => any) {
            const serverConnection = useServerConnection();
            serverConnection.on('submissionStatus', cb);
        },
        async offSubmissionStatus(cb: ({ id }: { id: string}) => any) {
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