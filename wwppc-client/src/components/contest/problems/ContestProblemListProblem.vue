<script setup lang="ts">
import { UILinkButton } from '@/components/ui-defaults/UIDefaults';
import { completionStateAnimation, completionStateString, type ContestProblemMetaData } from '@/scripts/ContestManager';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { glitchTextTransition } from '@/components/ui-defaults/TextTransitions';
import ContestProblemStatusCircle from "@/components/contest/problems/ContestProblemStatusCircle.vue";

const props = defineProps<{
    data: ContestProblemMetaData
}>();

const router = useRouter();

const nameText = ref<string>('');
const authorText = ref<string>('');
onMounted(() => {
    setTimeout(() => {
        glitchTextTransition('', props.data.name, (t) => { nameText.value = t; }, 40);
        glitchTextTransition('', 'Author: ' + props.data.author, (t) => { authorText.value = t; }, 40);
    }, props.data.round * 200 + props.data.number * 100);
});
</script>

<template>
    <div class="contestProblemListProblem">
        <span class="contestProblemListProblemId">
            {{ props.data.round }}-{{ props.data.number }}
        </span>
        <ContestProblemStatusCircle :status="props.data.status" ></ContestProblemStatusCircle>
<!--        <div class="contestProblemListProblemStatus" :title="completionStateString(props.data.status)"></div>-->
        <span class="contestProblemListProblemName"><b>{{ nameText }}</b></span>
        <span class="contestProblemListProblemAuthor"><i>{{ authorText }}</i></span>
        <span class="contestProblemListProblemButton">
            <UILinkButton text="View" width="100px" height="36px" :border="true" @click="router.push(`/contest/problemView/${props.data.round}_${props.data.number}`)"></UILinkButton>
        </span>
    </div>
</template>

<style>
.contestProblemListProblem {
    display: grid;
    grid-template-columns: 60px 1fr 120px;
    grid-template-rows: 24px 8px 16px 8px;
    grid-auto-flow: column;
    margin: 4px 4px;
    padding: 4px 0px;
    background-color: #222;
    border-radius: 8px;
    align-items: center;
    justify-items: center;
    transition: 50ms ease margin;
    will-change: margin;
}

.contestProblemListProblem:nth-child(odd) {
    background-color: #333;
}

.contestProblemListProblem:hover {
    margin: 4px 0px;
}

.contestProblemListProblemId {
    grid-row: 1;
    grid-column: 1;
    font-size: 18px;
}

.contestProblemListProblemStatus {
    grid-row: 2 / 5;
    grid-column: 1;
    width: 32px;
    height: 32px;
    animation: 2000ms linear v-bind("completionStateAnimation(props.data.status)") alternate infinite, 2000ms ease p-brightness-oscillation alternate infinite;
    border-radius: 50%;
    cursor: help;
}

.contestProblemListProblemName {
    grid-row: 1 / 3;
    grid-column: 2;
    font-size: 28px;
    justify-self: left;
}

.contestProblemListProblemAuthor {
    grid-row: 3 / 5;
    grid-column: 2;
    font-size: 18px;
    align-self: start;
    justify-self: left;
}

.contestProblemListProblemButton {
    grid-row: 1 / 5;
    grid-column: 3;
}
</style>