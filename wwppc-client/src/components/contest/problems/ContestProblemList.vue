<script setup lang="ts">
import { AngledTitledContainer } from '@/components/ui-defaults/UIContainers';
import { ContestProblemCompletionState, type ContestRound } from '@/scripts/ContestManager';
import ContestProblemListRound from './ContestProblemListRound.vue';
import AnimateInContainer from '@/components/ui-defaults/containers/AnimateInContainer.vue';
import { onMounted, ref } from 'vue';
import { useContestManager } from '@/scripts/ContestManager';
import { useRoute, useRouter } from 'vue-router';
import { globalModal } from '@/components/ui-defaults/UIDefaults';

// fetch problems from server on mount
// in the meantime just put a loading spinner (i should probably make one of those)

const route = useRoute();
const router = useRouter();
const contestManager = useContestManager();
const modal = globalModal();

const rounds = ref<ContestRound[]>([]);

onMounted(async () => {
    if (typeof route.params.contestId === 'string') {
        const serverRounds = await contestManager.getProblemList(route.params.contestId);
        console.log(serverRounds);
        for (let i of serverRounds) {
            rounds.value.push(i);
        }
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
            <AngledTitledContainer title="Problems" height="100%">
                <div class="contestProblemList">
                    <AnimateInContainer v-for="(round, index) in rounds" :key=round.number type="slideUp" :delay="index * 200">
                        <ContestProblemListRound :data=round></ContestProblemListRound>
                    </AnimateInContainer>
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