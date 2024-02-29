<script setup lang="ts">
import type { ContestRound } from '@/scripts/ContestManager';
import ContestProblemListProblem from './ContestProblemListProblem.vue';

const props = defineProps<{
    data: ContestRound
}>();
</script>

<template>
    <h2>Round {{ props.data.number }}</h2>
    <div class="contestProblemListRoundWrapper">
        <div class="contestProblemListRound">
            <ContestProblemListProblem v-for="problem in props.data.problems" :key="problem.number" :data="problem"></ContestProblemListProblem>
        </div>
    </div>
</template>

<style>
.contestProblemListRoundWrapper {
    padding: 4px 4px;
    clip-path: polygon(0% 0%, calc(100% - 32px) 0%, 100% 32px, 100% 100%, 0% 100%);
    background-color: white;
}

.contestProblemListRound {
    display: flex;
    flex-direction: column;
    padding: 8px 8px;
    clip-path: polygon(0% 0%, calc(100% - 30px) 0%, 100% 30px, 100% 100%, 0% 100%);
    background-color: black;
}
</style>