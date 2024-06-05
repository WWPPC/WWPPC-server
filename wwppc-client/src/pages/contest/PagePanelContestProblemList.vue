<script setup lang="ts">
import { AngledTitledContainer } from '@/components/ui-defaults/UIContainers';
import ContestProblemListRound from '@/components/contest/problemList/ContestProblemListRound.vue';
import AnimateInContainer from '@/components/ui-defaults/containers/AnimateInContainer.vue';
import { useContestManager } from '@/scripts/ContestManager';
import WaitCover from '@/components/common/WaitCover.vue';

const contestManager = useContestManager();
</script>

<template>
    <div class="problemListWrapperWrapper centered">
        <div class="problemListWrapper">
            <AngledTitledContainer title="Problems" height="100%">
                <div class="problemList">
                    <AnimateInContainer v-for="(round, index) in contestManager.contest?.rounds.filter((r) => r.problems.length > 0)" :key=round.number type="slideUp" :delay="index * 200">
                        <ContestProblemListRound :data=round></ContestProblemListRound>
                    </AnimateInContainer>
                </div>
                <WaitCover text="Loading..." :show="contestManager.contest === null"></WaitCover>
            </AngledTitledContainer>
        </div>
    </div>
</template>

<style scoped>
.problemListWrapperWrapper {
    height: 100%;
}

.problemListWrapper {
    width: 100%;
    max-width: 900px;
}

.problemList {
    display: flex;
    flex-direction: column;
}
</style>