<script setup lang="ts">
import type { ContestRound } from '@/scripts/ContestManager';
import ContestProblemListProblem from './ContestProblemListProblem.vue';
import { CutCornerContainer } from '@/components/ui-defaults/UIContainers';
import AnimateInContainer from '@/components/ui-defaults/containers/AnimateInContainer.vue';

const props = defineProps<{
    data: ContestRound
}>();
</script>

<template>
    <h2>Round {{ props.data.number }}</h2>
    <CutCornerContainer>
        <AnimateInContainer type="fade" v-for="(problem, index) in props.data.problems" :key=problem.number :delay="index * 100" single>
            <ContestProblemListProblem :data=problem></ContestProblemListProblem>
        </AnimateInContainer>
    </CutCornerContainer>
</template>

<style></style>