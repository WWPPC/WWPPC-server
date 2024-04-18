<script setup lang="ts">
import { AngledTitledContainer } from '@/components/ui-defaults/UIContainers';
import { ContestProblemCompletionState, type ContestRound } from '@/scripts/ContestManager';
import ContestProblemListRound from './ContestProblemListRound.vue';
import AnimateInContainer from '@/components/ui-defaults/containers/AnimateInContainer.vue';
import { onMounted, ref } from 'vue';
import { useContestManager } from '@/scripts/ContestManager';
import { useRoute, useRouter } from 'vue-router';
import { globalModal } from '@/components/ui-defaults/UIDefaults';

// probably should put loading spinner

const route = useRoute();
const router = useRouter();
const contestManager = useContestManager();
const modal = globalModal();

const round = ref<ContestRound>();

onMounted(async () => {
    if (typeof route.params.contestId === 'string') {
        //probably need a parameter for contest id and round id?
        const serverRounds = await contestManager.getProblemList("WWPIT", parseInt(route.params.contestId));
        round.value = serverRounds[0];
    } else if (route.query.ignore_server === undefined) {
        modal.showModal({title: 'No contest ID', content: 'No contest ID was supplied!<br>Click <code>OK</code> to return to problem list.', color: 'red'}).then(() => {
            router.push(`/contest/${route.params.contestId !== undefined ? route.params.contestId.toString() + '/' : ''}problemList`);
        });
    }
});
</script>

<template>
    <div class="contestProblemListWrapperWrapper centered">
        <div class="contestProblemListWrapper">
            <AngledTitledContainer :title="'Round ' + round?.number.toString()" height="100%">
                <div class="contestProblemList">
                    <br>
                    <ContestProblemListRound :data=round v-if="round != null"></ContestProblemListRound>
                </div>
            </AngledTitledContainer>
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