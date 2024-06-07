<script setup lang="ts">
import ArchiveListContest from '@/components/archive/archiveList/ArchiveListContest.vue';
import ArchiveListRound from '@/components/archive/archiveList/ArchiveListRound.vue';
import { AngledTitledContainer, AnimateInContainer } from '@/components/ui-defaults/UIContainers';
import { globalModal } from '@/components/ui-defaults/UIDefaults';
import { useUpsolveManager } from '@/scripts/UpsolveManager';
import type { UpsolveContest, UpsolveRound } from '@/scripts/UpsolveManager';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingCover from '@/components/common/LoadingCover.vue';
import { useServerConnection } from '@/scripts/ServerConnection';

const modal = globalModal();
const route = useRoute();
const router = useRouter();
const serverConnection = useServerConnection();
const upsolveManager = useUpsolveManager();

const contestList = ref<UpsolveContest[] | null>();
const contest = ref<UpsolveContest | null>();
const round = ref<UpsolveRound | null>();
const load = async () => {
    if (route.params.archiveProblem !== undefined) {
        router.push(`/contest/archiveView/${route.params.archiveContest}/${route.params.archiveRound}/${route.params.archiveProblem}`);
    } else if (route.params.archiveRound !== undefined) {
        if (isNaN(Number(route.params.archiveRound))) return;
        const data = await upsolveManager.getRoundData(route.params.archiveContest.toString(), Number(route.params.archiveRound));
        if (data instanceof Error) {
            modal.showModal({ title: data.message, content: 'Could not load round', color: 'red' });
            return;
        }
        round.value = data;
        contest.value = null;
        contestList.value = null;
    } else if (route.params.archiveContest !== undefined) {
        const data = await upsolveManager.getContestData(route.params.archiveContest.toString());
        if (data instanceof Error) {
            modal.showModal({ title: data.message, content: 'Could not load contest', color: 'red' });
            return;
        }
        contest.value = data;
        round.value = null;
        contestList.value = null;
    } else {
        const data = await upsolveManager.getContests();
        if (data instanceof Error) {
            modal.showModal({ title: data.message, content: 'Could not load contest list', color: 'red' });
            return;
        }
        contestList.value = data;
        round.value = null;
        contest.value = null;
    }
};
onMounted(load);
watch(() => route.params, load);
serverConnection.onconnect(load);
watch(() => serverConnection.loggedIn, load);
</script>

<template>
    <div class="archiveListWrapperWrapper centered">
        <div class="archiveListWrapper">
            <Transition>
                <AngledTitledContainer v-if="contestList != null" title="Contest Archive" class="archiveList">
                    <AnimateInContainer type="slideUp" v-for="(contest, index) of contestList" :key="contest.id" :delay="index * 200">
                        <ArchiveListContest :data="contest"></ArchiveListContest>
                        <!-- future: lazy loading contests? load when become visible -->
                    </AnimateInContainer>
                </AngledTitledContainer>
            </Transition>
            <Transition>
                <AngledTitledContainer v-if="contest != null" :title="contest.id" class="archiveList">
                    <AnimateInContainer type="fade" v-for="(round, index) of contest.rounds" :key="round.number" :delay="index * 100">
                        <ArchiveListRound :data="round"></ArchiveListRound>
                    </AnimateInContainer>
                </AngledTitledContainer>
            </Transition>
            <Transition>
                <AngledTitledContainer v-if="round != null" :title="`${round.contest} Round ${round.number + 1}`" class="archiveList">
                    <AnimateInContainer type="fade">
                        <ArchiveListRound :data="round"></ArchiveListRound>
                    </AnimateInContainer>
                </AngledTitledContainer>
            </Transition>
        </div>
    </div>
    <LoadingCover text="Loading..." :show="contestList == null && contest == null && round == null"></LoadingCover>
</template>

<style scoped>
.archiveListWrapperWrapper {
    height: 100%;
    overflow: hidden;
}

.archiveListWrapper {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
    width: 100%;
    max-width: 900px;
}

.archiveList {
    height: 100%;
    grid-row: 1;
    grid-column: 1;
}

.v-enter-active,
.v-leave-active {
    transition: 200ms ease-in-out transform, 200ms linear opacity;
}

.v-enter-from {
    transform: translateX(-100vw);
    opacity: 0;
}

.v-leave-to {
    transform: translateX(100vw);
    opacity: 0;
}

.v-enter-to,
.v-leave-from {
    transform: none;
    opacity: 1;
}
</style>