import { defineStore } from "pinia";

// to be used in contest timer, contest problem list displays, etc

export interface ContestRound {
    division: number
    number: number
    time: number
    problems: ContestProblem[]
}
export interface ContestProblem {
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
    ERROR = 5
}

export const useContestStore = defineStore('contestManager', {
    state: () => ({})
})