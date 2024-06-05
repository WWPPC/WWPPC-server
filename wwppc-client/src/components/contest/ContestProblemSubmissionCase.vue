<script setup lang="ts">
import { type ContestScore, ContestScoreState } from '@/scripts/ContestManager';
import { globalModal } from '../ui-defaults/UIDefaults';

const props = defineProps<{
    case: ContestScore
    number: number
}>();

const modal = globalModal();

const submissionVerdict = () => props.case.state == ContestScoreState.CORRECT ? '*' : props.case.state == ContestScoreState.INCORRECT ? 'X' : props.case.state == ContestScoreState.TIME_LIM_EXCEEDED ? 'T' : props.case.state == ContestScoreState.MEM_LIM_EXCEEDED ? 'M' : '!';
const submissionVerdictLong = () => props.case.state == ContestScoreState.CORRECT ? 'Accepted' : props.case.state == ContestScoreState.INCORRECT ? 'Incorrect answer' : props.case.state == ContestScoreState.TIME_LIM_EXCEEDED ? 'Time limit exceeded' : props.case.state == ContestScoreState.MEM_LIM_EXCEEDED ? 'Memory limit exceeded' : props.case.state == ContestScoreState.RUNTIME_ERROR ? 'Runtime error' : 'Compilation error';

const showModal = () => {
    modal.showModal({
        title: 'Test Case ' + (props.number + 1),
        content: `Time: ${props.case.time}ms | Memory: ${props.case.memory}MB<br>Subtask: ${props.case.subtask}<br>Verdict: ${submissionVerdictLong()}`,
        color: props.case.state == ContestScoreState.CORRECT ? 'lime' : 'red'
    });
};
</script>

<template>
    <div class="submissionCase" @click=showModal :title="submissionVerdictLong()">
        <span class="submissionVerdict">{{ submissionVerdict() }}</span>
        <span class="submissionSubtask">T{{ props.number + 1 }} S{{ props.case.subtask }}</span>
    </div>
</template>

<style scoped>
.submissionCase {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 64px;
    min-width: 64px;
    height: 64px;
    border-radius: 4px;
    background-color: v-bind("$props.case.state == ContestScoreState.CORRECT ? '#0A0' : '#A00'");
    border: 2px solid;
    border-color: v-bind("$props.case.state == ContestScoreState.CORRECT ? 'lime' : 'red'");
    cursor: pointer;
}

.submissionVerdict,
.submissionSubtask {
    text-align: center;
    font-family: 'Source Code Pro', Courier, monospace;
}

.submissionVerdict {
    font-size: 30px;
}

.submissionSubtask {
    font-size: 14px;
}
</style>