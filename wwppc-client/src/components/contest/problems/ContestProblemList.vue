<script setup lang="ts">
import { AngledTitledContainer } from '@/components/ui-defaults/UIContainers';
import { ContestProblemCompletionState, type ContestRound } from '@/scripts/ContestManager';
import ContestProblemListRound from './ContestProblemListRound.vue';
import AnimateInContainer from '@/components/ui-defaults/containers/AnimateInContainer.vue';
import { onMounted, ref } from 'vue';
import { useContestManager } from '@/scripts/ContestManager';
import { useRoute, useRouter } from 'vue-router';
import { globalModal } from '@/components/ui-defaults/UIDefaults';
import WaitCover from '@/components/WaitCover.vue';

const route = useRoute();
const router = useRouter();
const contestManager = useContestManager();
const modal = globalModal();

const rounds = ref<ContestRound[]>([]);
const showLoading = ref(true);

onMounted(async () => {
    showLoading.value = true;
    if (typeof route.params.contestId === 'string') {
        rounds.value = await contestManager.getProblemList(route.params.contestId);
        showLoading.value = false;
    } else if (route.query.ignore_server === undefined) {
        modal.showModal({ title: 'No contest ID', content: 'No contest ID was supplied!<br>Click <code>OK</code> to return to problem list.', color: 'red' }).then(() => {
            router.push(`/contest/${route.params.contestId !== undefined ? route.params.contestId.toString() + '/' : ''}problemList`);
        });
    } else {
        // dummy data for testing
        rounds.value = [
            {
                contest: 'WWPIT Test',
                number: 0,
                time: 1800,
                problems: [
                    {
                        id: 'buh',
                        contest: 'WWPIT Test',
                        round: 0,
                        number: 0,
                        name: 'Test Problem 0',
                        author: 'SP^2',
                        status: ContestProblemCompletionState.GRADED_PASS
                    },
                    {
                        id: 'buh',
                        contest: 'WWPIT Test',
                        round: 0,
                        number: 1,
                        name: 'Test Problem 1',
                        author: 'SP^2',
                        status: ContestProblemCompletionState.GRADED_FAIL
                    },
                    {
                        id: 'buh',
                        contest: 'WWPIT Test',
                        round: 0,
                        number: 2,
                        name: 'Test Problem 2',
                        author: 'SP^2',
                        status: ContestProblemCompletionState.SUBMITTED
                    },
                    {
                        id: 'buh',
                        contest: 'WWPIT Test',
                        round: 0,
                        number: 3,
                        name: 'Test Problem 3',
                        author: 'SP^2',
                        status: ContestProblemCompletionState.GRADED_PARTIAL
                    }
                ]
            }, {
                contest: 'WWPIT Test',
                number: 1,
                time: 3600,
                problems: [
                    {
                        id: 'buh',
                        contest: 'WWPIT Test',
                        round: 1,
                        number: 0,
                        name: 'Test Problem 0',
                        author: 'SP^2',
                        status: ContestProblemCompletionState.UPLOADED
                    },
                    {
                        id: 'buh',
                        contest: 'WWPIT Test',
                        round: 1,
                        number: 1,
                        name: 'Test Problem 1',
                        author: 'SP^2',
                        status: ContestProblemCompletionState.NOT_UPLOADED
                    },
                    {
                        id: 'buh',
                        contest: 'WWPIT Test',
                        round: 1,
                        number: 2,
                        name: 'Test Problem 2',
                        author: 'SP^2',
                        status: ContestProblemCompletionState.ERROR
                    }
                ]
            }
        ];
        showLoading.value = false;
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
                <WaitCover text="Loading..." :show="showLoading"></WaitCover>
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