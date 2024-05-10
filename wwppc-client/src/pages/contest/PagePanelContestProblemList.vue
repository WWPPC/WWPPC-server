<script setup lang="ts">
import { AngledTitledContainer } from '@/components/ui-defaults/UIContainers';
import { ContestProblemCompletionState, type ContestRound } from '@/scripts/ContestManager';
import ContestProblemListRound from '@/components/contest/problemList/ContestProblemListRound.vue';
import AnimateInContainer from '@/components/ui-defaults/containers/AnimateInContainer.vue';
import { onMounted, ref } from 'vue';
import { useContestManager } from '@/scripts/ContestManager';
import { useRoute } from 'vue-router';
import WaitCover from '@/components/WaitCover.vue';
import { useServerConnection } from '@/scripts/ServerConnection';

const route = useRoute();

const serverConnection = useServerConnection();
const contestManager = useContestManager();

const rounds = ref<ContestRound[]>([]);
const showLoading = ref(true);

const loadProblems = async () => {
    showLoading.value = true;
    if (route.query.ignore_server === undefined) {
        rounds.value = await contestManager.getProblemList();
        showLoading.value = false;
    } else {
        // dummy data for testing
        rounds.value = [
            {
                contest: 'WWPIT Test',
                number: 0,
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
                ],
                startTime: 0,
                endTime: 1
            }, {
                contest: 'WWPIT Test',
                number: 1,
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
                ],
                startTime: 0,
                endTime: 1e100
            }
        ];
        showLoading.value = false;
    }
};
onMounted(loadProblems);
serverConnection.handshakePromise.then(() => {
    if (serverConnection.loggedIn) loadProblems();
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