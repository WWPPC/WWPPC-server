<script setup lang="ts">
import { UILinkButton } from '@/components/ui-defaults/UIDefaults';
import { type ContestProblem } from '@/scripts/ContestManager';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { glitchTextTransition } from '@/components/ui-defaults/TextTransitions';
import ContestProblemStatusCircle from '@/components/contest/ContestProblemStatusCircle.vue';

const props = defineProps<{
    data: ContestProblem
    archive?: boolean
}>();

const router = useRouter();

const nameText = ref<string>('');
const authorText = ref<string>('');
onMounted(() => {
    if (props.archive) {
        nameText.value = props.data.name;
        authorText.value = 'Author: ' + props.data.author;
    } else setTimeout(() => {
        glitchTextTransition('', props.data.name, (t) => { nameText.value = t; }, 40);
        glitchTextTransition('', 'Author: ' + props.data.author, (t) => { authorText.value = t; }, 40);
    }, (props.data.round ?? 0) * 200 + (props.data.number ?? 0) * 100);
});
</script>

<template>
    <div class="contestProblemListProblem">
        <span class="contestProblemListProblemId">
            {{ props.data.round + 1 }}-{{ props.data.number + 1 }}
        </span>
        <span class="problemListCircle">
            <ContestProblemStatusCircle :status="props.data.status"></ContestProblemStatusCircle>
        </span>
        <span class="contestProblemListProblemName"><b>{{ nameText }}</b></span>
        <span class="contestProblemListProblemAuthor"><i>{{ authorText }}</i></span>
        <span class="contestProblemListProblemButton">
            <UILinkButton text="View" width="100px" height="36px" :border="true" @click="router.push(props.archive ? `/contest/archiveView/${props.data.contest}/${props.data.round}/${props.data.number}` : `/contest/problemView/${props.data.round}_${props.data.number}`)"></UILinkButton>
        </span>
    </div>
</template>

<style scoped>
.problemListCircle {
    grid-row: 2 / 5;
    grid-column: 1;
}

.contestProblemListProblem {
    display: grid;
    grid-template-columns: 60px 1fr 120px;
    grid-template-rows: 24px 8px 16px 8px;
    grid-auto-flow: column;
    margin: 4px 4px;
    padding: 4px 0px;
    background-color: #333;
    border-radius: 8px;
    align-items: center;
    justify-items: center;
    transition: 50ms ease margin;
    will-change: margin;
}

.contestProblemListProblem:hover {
    margin: 4px 0px;
}

.contestProblemListProblemId {
    grid-row: 1;
    grid-column: 1;
    font-size: 18px;
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