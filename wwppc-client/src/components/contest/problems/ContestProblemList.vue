<script setup lang="ts">
import { TitledAngleContainer } from '@/components/ui-defaults/UIContainers';
import { ContestProblemCompletionState, type ContestRound } from '@/scripts/ContestManager';
import ContestProblemListRound from './ContestProblemListRound.vue';

// fetch problems from server on mount
// in the meantime just put a loading spinner (i should probably make one of those)

const rounds: ContestRound[] = [];
//hard code BAD
rounds.push({
    division: 0,
    number: 0,
    time: 1800,
    problems: [
        {
            division: 0,
            round: 0,
            number: 0,
            name: 'Test 0',
            author: 'SP^2',
            content: '<img src="/assets/timer.svg">test</img>omg working<br>oooooo',
            constraints: { time: 2000, memory: 512 },
            status: ContestProblemCompletionState.GRADED_PASS
        },
        {
            division: 0,
            round: 0,
            number: 1,
            name: 'Test 1',
            author: 'SP^2',
            content: 'aaaaa<br>bromine moment<br>ooop',
            constraints: { time: 4000, memory: 512 },
            status: ContestProblemCompletionState.GRADED_FAIL
        },
        {
            division: 0,
            round: 0,
            number: 2,
            name: 'Test 2',
            author: 'SP^2',
            content: 'sdfdsffsdsfsdfdsfdsfsdffds<br>dsfdsfdsfds<br>dsflkjdsfjl<br>slkjfdlkdsflkjds<br>dsflfds',
            constraints: { time: 4000, memory: 512 },
            status: ContestProblemCompletionState.SUBMITTED
        },
        {
            division: 0,
            round: 0,
            number: 3,
            name: 'Test 3',
            author: 'SP^2',
            content: 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeEeEeEeEeEeEeEeEeEeEeEeEeEe',
            constraints: { time: 2000, memory: 512 },
            status: ContestProblemCompletionState.GRADED_PARTIAL
        }
    ]
}, {
    division: 0,
    number: 1,
    time: 3600,
    problems: [
        {
            division: 0,
            round: 1,
            number: 0,
            name: 'Test 0',
            author: 'SP^2',
            content: '<img src="/assets/timer.svg">test</img>omg working<br>oooooo',
            constraints: { time: 2000, memory: 512 },
            status: ContestProblemCompletionState.UPLOADED
        },
        {
            division: 0,
            round: 1,
            number: 1,
            name: 'Test 1',
            author: 'SP^2',
            content: 'aaaaa<br>bromine moment<br>ooop',
            constraints: { time: 4000, memory: 512 },
            status: ContestProblemCompletionState.NOT_UPLOADED
        },
        {
            division: 0,
            round: 1,
            number: 2,
            name: 'Test 2',
            author: 'SP^2',
            content: 'oooooooooooooooof',
            constraints: { time: 4000, memory: 512 },
            status: ContestProblemCompletionState.ERROR
        }
    ]
});
</script>

<template>
    <div class="contestProblemListWrapperWrapper centered">
        <div class="contestProblemListWrapper">
            <TitledAngleContainer title="Problems" height="100%">
                <div class="contestProblemList">
                    <ContestProblemListRound v-for="round in rounds" :key="round.number" :data="round"></ContestProblemListRound>
                </div>
            </TitledAngleContainer>
        </div>
    </div>
</template>

<style>
.contestProblemListWrapperWrapper {
    height: 100%;
}

.contestProblemListWrapper {
    width: 100%;
    max-width: 900px;
}

.contestProblemList {
    display: flex;
    flex-direction: column;
}
</style>