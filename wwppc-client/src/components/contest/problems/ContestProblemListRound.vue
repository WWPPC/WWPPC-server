<script setup lang="ts">
import type { ContestRound } from '@/scripts/ContestManager';
import ContestProblemListProblem from './ContestProblemListProblem.vue';
import { CutCornerContainer } from '@/components/ui-defaults/UIContainers';

const props = defineProps<{
    data: ContestRound
}>();
</script>

<template>
    <h2>Round {{ props.data.number }}</h2>
    <CutCornerContainer>
        <ContestProblemListProblem v-for="problem in props.data.problems" :key=problem.number :data=problem></ContestProblemListProblem>
    </CutCornerContainer>
</template>

<style></style>