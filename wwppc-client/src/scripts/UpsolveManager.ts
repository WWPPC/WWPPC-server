import { defineStore } from 'pinia';
import { reactive } from 'vue';

import { ContestUpdateSubmissionResult } from './ContestManager';
import { apiFetch, socket, useServerConnection } from './ServerConnection';

import { ContestProblemCompletionState } from './ContestManager';
import type { ContestScore } from './ContestManager';

export interface UpsolveContest {
    readonly id: string
    rounds: UpsolveRound[]
}
export interface UpsolveRound {
    readonly contest: string
    readonly number: number
    problems: string[]
}
export interface UpsolveProblem {
    readonly id: string
    readonly contest: string
    readonly round: number
    readonly number: number
    name: string
    author: string
    content: string
    constraints: { memory: number, time: number }
}
export interface UpsolveSubmission {
    readonly problemId: string
    time: number
    lang: string
    scores: ContestScore[]
    status: ContestProblemCompletionState
}

const state = reactive<{
    submissionsCache: Map<string, UpsolveSubmission[]>
    submissionsUpdated: number // for watch hooks
}>({
    submissionsCache: new Map(),
    submissionsUpdated: 0
});

export const useUpsolveManager = defineStore('upsolveManager', {
    state: () => state,
    actions: {
        async getContests(): Promise<UpsolveContest[] | Error> {
            return await apiFetch('GET', '/upsolveContestList');
        },
        async getContestData(contest: string): Promise<UpsolveContest | Error> {
            return await apiFetch('GET', `/upsolve/${contest}`);
        },
        async getRoundData(contest: string, round: number): Promise<UpsolveRound | Error> {
            return await apiFetch('GET', `/upsolve/${contest}/${round}`);
        },
        async getProblemData(contest: string, round: number, problem: number): Promise<UpsolveProblem | Error> {
            return await apiFetch('GET', `/upsolve/${contest}/${round}/${problem}`);
        },
        async updateSubmission(problemId: string, lang: string, file: string): Promise<ContestUpdateSubmissionResult> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return ContestUpdateSubmissionResult.NOT_CONNECTED;
            return await serverConnection.emitWithAck('updateUpsolveSubmission', { id: problemId, file, lang });
        },
        async refreshSubmission(problemId: string): Promise<UpsolveSubmission[] | null> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return null;
            const res: UpsolveSubmission[] | null = await serverConnection.emitWithAck('refreshUpsolveSubmission', { id: problemId });
            if (res != null) state.submissionsCache.set(problemId, res);
            return res;
        },
        async getSubmissions(problemId: string): Promise<UpsolveSubmission[] | null> {
            if (state.submissionsCache.has(problemId)) return state.submissionsCache.get(problemId)!;
            return await this.refreshSubmission(problemId);
        }
    }
});

// prevent circular dependency nuke
window.addEventListener('DOMContentLoaded', () => {
    socket.on('upsolveSubmissionStatus', (submissions: UpsolveSubmission[]) => {
        if (submissions.length == 0) return;
        state.submissionsCache.set(submissions[0].problemId, submissions);
        state.submissionsUpdated++;
    });
    const serverConnection = useServerConnection();
    serverConnection.ondisconnect(() => {
        state.submissionsCache.clear();
    });
});