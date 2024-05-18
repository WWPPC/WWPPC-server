<script setup lang="ts">
import { AngledTitledContainer } from '@/components/ui-defaults/UIContainers';
import ContestProblemListRound from '@/components/contest/problemList/ContestProblemListRound.vue';
import AnimateInContainer from '@/components/ui-defaults/containers/AnimateInContainer.vue';
import { useContestManager } from '@/scripts/ContestManager';
import WaitCover from '@/components/common/WaitCover.vue';

const contestManager = useContestManager();
</script>

<template>
    <div class="contestProblemListWrapperWrapper centered">
        <div class="contestProblemListWrapper">
            <AngledTitledContainer title="Problems" height="100%">
                <div class="contestProblemList">
                    <AnimateInContainer v-for="(round, index) in contestManager.contest?.rounds" :key=round.number type="slideUp" :delay="index * 200">
                        <ContestProblemListRound :data=round></ContestProblemListRound>
                    </AnimateInContainer>
                </div>
                <WaitCover text="Loading..." :show="contestManager.contest === null"></WaitCover>
            </AngledTitledContainer>
        </div>
    </div>
</template>

<style scoped>
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