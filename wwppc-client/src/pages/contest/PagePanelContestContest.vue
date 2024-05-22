<script setup lang="ts">
import ScrollIndicator from '@/components/common/ScrollIndicator.vue';
import ContestTimer from '@/components/contest/ContestTimer.vue';
import { GlitchText } from '@/components/ui-defaults/UIDefaults';
import UITimeDisplay from '@/components/ui-defaults/UITimeDisplay.vue';
import { useContestManager } from '@/scripts/ContestManager';
import { onMounted, ref, watch } from 'vue';

const contestManager = useContestManager();

let buh = Date.now();
contestManager.contest = {
    id: 'WWPIT 2024',
    startTime: buh,
    endtime: buh + 50000,
    rounds: [
        {
            contest: 'WWPIT 2024',
            number: 1,
            problems: [],
            startTime: buh + 10000,
            endTime: buh + 20000,
        },
        {
            contest: 'WWPIT 2024',
            number: 2,
            problems: [],
            startTime: buh + 30000,
            endTime: buh + 40000,
        }
    ]
};

const currentRound = ref(0);
const roundTimes = ref<{ label: string, time: number }[]>([]);
const updateRoundTimes = () => {
    roundTimes.value = [];
    if (contestManager.contest === null || contestManager.contest.rounds.length == 0) return;
    const times: { label: string, time: number }[] = [];
    const now = Date.now();
    currentRound.value = -1;
    times.push({
        label: 'Opening ceremonies',
        time: contestManager.contest.rounds[0].startTime - contestManager.contest.startTime
    }, {
        label: 'Round 1',
        time: contestManager.contest.rounds[0].endTime - contestManager.contest.rounds[0].startTime
    });
    if (now > contestManager.contest.startTime && now < contestManager.contest.rounds[0].startTime) currentRound.value = 0;
    else if (now > contestManager.contest.rounds[0].startTime && now < contestManager.contest.rounds[0].endTime) currentRound.value = 1;
    for (let i = 1; i < contestManager.contest.rounds.length; i++) {
        times.push({
            label: 'Break',
            time: contestManager.contest.rounds[i].startTime - contestManager.contest.rounds[i - 1].endTime
        }, {
            label: 'Round ' + (i + 1),
            time: contestManager.contest.rounds[i].endTime - contestManager.contest.rounds[i].startTime
        });
        if (now > contestManager.contest.rounds[i - 1].endTime && now < contestManager.contest.rounds[i].startTime) currentRound.value = i * 2;
        else if (now > contestManager.contest.rounds[i].startTime && now <contestManager.contest.rounds[i].endTime) currentRound.value = i * 2 + 1;
    }
    times.push({
        label: 'Closing ceremonies',
        time: contestManager.contest.endtime - contestManager.contest.rounds[contestManager.contest.rounds.length - 1].endTime
    });
    if (currentRound.value == -1) currentRound.value = times.length - 1;
    roundTimes.value = times;
};
watch(() => contestManager.contest, updateRoundTimes);
onMounted(updateRoundTimes);
</script>

<template>
    <div class="fullBlock stretchBlock">
        <div class="timerContainer">
            <GlitchText :text="contestManager.contest?.id ?? 'Not in contest'" color="lime" font-size="var(--font-title)" shadow glow></GlitchText>
            <ContestTimer big @next="updateRoundTimes"></ContestTimer>
        </div>
        <div style="flex-grow: 1"></div>
        <div class="blockScrollWrapper">
            <div class="blockScrollContainer">
                <div class="blockScroll" v-for="t of roundTimes" :key="t.label">
                    <div>{{ t.label }}</div>
                    <UITimeDisplay :time="t.time" form="short"></UITimeDisplay>
                </div>
            </div>
        </div>
        <ScrollIndicator anchor="a[name=pageContestContestScrollTo]"></ScrollIndicator>
    </div>
    <div class="fullBlock">
        <a name="pageContestContestScrollTo"></a>

    </div>
    <!-- contest instructions -->
    <!-- important info, like discord and clarifications location -->
    <!-- OK GLHF -->
</template>

<style scoped>
.stretchBlock {
    display: flex;
    flex-direction: column;
}

.timerContainer {
    transform-origin: top;
    transform: translate3D(0px, -20vh, -50px) scale(150%);
    transform-style: preserve-3d;
    z-index: -1;
    text-align: center;
}

.blockScrollWrapper {
    position: relative;
    --actual-width: calc(100vw - 48px);
    width: var(--actual-width);
    font-size: var(--font-medium);
    overflow: hidden;
}

.blockScrollWrapper::after {
    content: ' ';
    position: absolute;
    top: calc(var(--actual-width) * -0.4);
    width: 100%;
    height: calc(100% + calc(var(--actual-width) * 0.8));
    box-shadow: 0px 0px calc(var(--actual-width) * 0.4) calc(var(--actual-width) * 0.2) black inset;
    pointer-events: none;
}

.blockScrollContainer {
    display: flex;
    width: min-content;
    transform: translateX(calc(v-bind("currentRound") * calc(var(--actual-width) * -0.2) + calc(var(--actual-width) * 0.4)));
    transition: 500ms ease transform;
    will-change: transform;
}

.blockScroll {
    display: flex;
    flex-direction: column;
    width: calc(var(--actual-width) * 0.2);
    text-align: center;
}

.blockScroll>div:first-child {
    height: 2.2em;
    align-content: center;
}

@media (max-width: 100vh) {
    .blockScrollWrapper::after {
        content: ' ';
        position: absolute;
        top: calc(var(--actual-width) * -0.3);
        width: 100%;
        height: calc(100% + 60vw);
        box-shadow: 0px 0px 30vw 15vw black inset;
    }

    .blockScrollContainer {
        display: flex;
        transform: translateX(calc(v-bind("currentRound") * calc(var(--actual-width) * -0.2) + calc(var(--actual-width) * 0.3)));
        transition: 500ms ease transform;
        will-change: transform;
    }

    .blockScroll {
        display: flex;
        flex-direction: column;
        width: 40vw;
        text-align: center;
        text-wrap: nowrap;
    }
}
</style>