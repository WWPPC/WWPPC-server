import { defineStore } from "pinia";
import { useServerConnection } from "./ServerConnection";
import { reactive } from "vue";

export type ContestRound = {
    division: number
    number: number
    time: number
    problems: ContestProblemMetaData[]
}
export type ContestProblemMetaData = {
    id: string
    division: number
    round: number
    number: number
    name: string
    author: string
    status: ContestProblemCompletionState
}
export type ContestProblem = {
    id: string
    division: number
    round: number
    number: number
    name: string
    author: string
    content: string
    constraints: { memory: number, time: number }
    status: ContestProblemCompletionState
}
export enum ContestProblemCompletionState {
    NOT_UPLOADED = 0,
    UPLOADED = 1,
    SUBMITTED = 2,
    GRADED_PASS = 3,
    GRADED_FAIL = 4,
    GRADED_PARTIAL = 5,
    ERROR = 6
}

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
        async getProblemList() {
            const serverConnection = useServerConnection();
            return await new Promise((resolve) => {
                serverConnection.emit('getAvailableProblems');
                serverConnection.once('availableProblems', (problems: ContestProblem[]) => {
                    resolve(problems);
                });
            })
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