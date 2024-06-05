<script setup lang="ts">
import { type UpsolveContest } from '@/scripts/UpsolveManager';
import { autoGlitchTextTransition } from '@/components/ui-defaults/TextTransitions';
import { AnimateInContainer, CutCornerContainer } from '@/components/ui-defaults/UIContainers';
import ArchiveListRound from './ArchiveListRound.vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
    data: UpsolveContest
}>();

const router = useRouter();

const titleText = autoGlitchTextTransition(() => props.data.id, 40, 1, 10, 2);

const navContest = () => {
    router.push('/contest/archive/' + props.data.id);
};
</script>

<template>
    <CutCornerContainer style="margin-bottom: 16px;" no-padding no-scroll>
        <div class="archiveContestHeader" @click="navContest()">
            <h2>{{ titleText }}</h2>
        </div>
        <AnimateInContainer type="fade" v-for="(round, index) in props.data.rounds" :key="round.number" :delay="index * 100">
            <ArchiveListRound :data="round" minimized></ArchiveListRound>
        </AnimateInContainer>
    </CutCornerContainer>
</template>

<style scoped>
.archiveContestHeader {
    box-sizing: border-box;
    width: 100%;
    padding: 8px 12px;
    border-bottom: 4px solid white;
    background-color: #333;
    color: lime;
    text-decoration: underline;
    cursor: pointer;
}
</style>
