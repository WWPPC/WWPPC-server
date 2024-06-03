<script setup lang="ts">
import { nextContest, useContestManager } from '@/scripts/ContestManager';
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { GlitchText, UITimer } from '@/components/ui-defaults/UIDefaults';

const props = defineProps<{
    big?: boolean
}>();

const route = useRoute();
const contestManager = useContestManager();

const show = ref(false);
onMounted(() => show.value = route.params.panel !== 'contest' || props.big);
watch(() => route.params.panel, () => show.value = route.params.panel !== 'contest' || props.big);

const round = ref('');
const nextTime = ref(new Date(0));
const color = ref('white');
const flashColor = ref('');
let inRound = false;
const updateTime = () => {
    if (contestManager.contest == undefined) {
        if (props.big) round.value = 'Not in contest';
        else round.value = '---';
        nextTime.value = nextContest;
        color.value = 'white';
        return;
    }
    inRound = false;
    color.value = 'white';
    round.value = contestManager.contest.id;
    nextTime.value = new Date(contestManager.contest.endTime);
    const now = Date.now();
    if (now > contestManager.contest.endTime) {
        if (props.big) round.value = 'Contest ended';
        else round.value = '---';
        nextTime.value = new Date();
        color.value = 'red';
    }
    for (let i = contestManager.contest.rounds.length - 1; i >= 0; i--) {
        const r = contestManager.contest.rounds[i];
        if (now < r.startTime) {
            nextTime.value = new Date(r.startTime);
            color.value = 'white';
        } else if (now < r.endTime) {
            if (props.big) round.value = `Round ${r.number + 1}`;
            else round.value = `Round ${r.number + 1}`;
            nextTime.value = new Date(r.endTime);
            color.value = 'lime';
            inRound = true;
        }
    }
    updateFlash();
};
const updateFlash = () => {
    if (inRound) {
        if (nextTime.value.getTime() - Date.now() <= 300000) flashColor.value = 'red';
        else flashColor.value = 'lime';
    } else if (Date.now() > (contestManager.contest?.endTime ?? 0)) {
        flashColor.value = '';
    } else {
        if (nextTime.value.getTime() - Date.now() <= 60000) flashColor.value = 'yellow';
        else flashColor.value = 'white';
    }
};
watch(() => contestManager.contest, updateTime);
onMounted(updateTime);
setInterval(updateFlash, 1000);

const emit = defineEmits<{
    (e: 'next', value: number): any
}>();

watch(nextTime, () => emit('next', nextTime.value.getTime()));
</script>

<template>
    <Transition>
        <div :class="'timer' + ($props.big ? '2' : '')" v-if="contestManager.contest !== null || route.query.ignore_server !== undefined" v-show="show">
            <GlitchText :text="round" :class="'timerText' + ($props.big ? '2' : '')" :shadow="$props.big" :glow="$props.big" random on-visible></GlitchText>
            <UITimer type="min-timer" :to="nextTime" :class="'timerTime' + ($props.big ? '2' : '')" :shadow="$props.big" :glow="$props.big" :color="color" :flashing="flashColor != ''" :flash-color="flashColor == color ? undefined : flashColor" @zero="updateTime"></UITimer>
        </div>
    </Transition>
</template>

<style scoped>
.timer,
.timer2 {
    display: grid;
    align-items: center;
    text-align: center;
}

.timer {
    min-width: 200px;
    max-width: 200px;
    grid-template-rows: 48px 48px;
    transition: 500ms min-width;
}

.timerText {
    font-size: 20px;
    max-width: 200px;
    text-wrap: balance;
    transition: 500ms font-size;
}

.timerText2 {
    font-size: 48px;
    text-wrap: nowrap;
}

.timerTime {
    margin-top: -4px;
    font-size: 50px;
    text-wrap: nowrap;
    transition: 500ms font-size;
    font-weight: normal;
}

.timerTime2 {
    font-size: var(--font-huge-title);
    text-wrap: nowrap;
}

.v-enter-active,
.v-leave-active {
    transition: 200ms ease min-width, 200ms ease max-width, 200ms linear opacity;
}

.v-enter-from,
.v-leave-to {
    min-width: 0px;
    max-width: 0px;
    opacity: 0;
}

.v-leave-from,
.v-enter-to {
    min-width: 150px;
    max-width: 150px;
    opacity: 1;
}

@media (max-width: 700px) {
    .timer {
        min-width: 110px;
        max-width: 110px;
        margin-left: -16px;
    }

    .timerText {
        font-size: 16px;
    }

    .timerTime {
        font-size: 30px;
    }

    .v-leave-from,
    .v-enter-to {
        min-width: 110px;
        max-width: 110px;
    }
}
</style>