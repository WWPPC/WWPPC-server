<script setup lang="ts">
import { ContestProblemCompletionState, type ContestProblem } from '@/scripts/ContestManager';

const props = defineProps<{
    data: ContestProblem
}>();

const statusToAnimation = (status: ContestProblemCompletionState) => {
    return status == ContestProblemCompletionState.NOT_UPLOADED ? 'pstatus-not-uploaded' :
        status == ContestProblemCompletionState.UPLOADED ? 'pstatus-uploaded' :
            status == ContestProblemCompletionState.SUBMITTED ? 'pstatus-submitted' :
                status == ContestProblemCompletionState.GRADED_PASS ? 'pstatus-graded-pass' :
                    status == ContestProblemCompletionState.GRADED_FAIL ? 'pstatus-graded-fail' : 'pstatus-error'
}
const statusToDescription = (status: ContestProblemCompletionState) => {
    return status == ContestProblemCompletionState.NOT_UPLOADED ? 'Solution not uploaded' :
        status == ContestProblemCompletionState.UPLOADED ? 'Solution uploaded' :
            status == ContestProblemCompletionState.SUBMITTED ? 'Solution submitted' :
                status == ContestProblemCompletionState.GRADED_PASS ? 'Solution passed' :
                    status == ContestProblemCompletionState.GRADED_FAIL ? 'Solution failed' : 'Error fetching status'
}
</script>

<template>
    <div class="contestProblemListProblem">
        <span class="contestProblemListProblemId">
            {{ props.data.round }}-{{ props.data.number }}
        </span>
        <div class="contestProblemListProblemStatus" :title="statusToDescription(props.data.status)"></div>
        <span class="contestProblemListProblemName"><b>{{ props.data.name }}</b></span>
        <span class="contestProblemListProblemAuthor"><i>Author: {{ props.data.author }}</i></span>
    </div>
</template>

<style>
.contestProblemListProblem {
    display: grid;
    grid-template-columns: 60px 1fr;
    grid-template-rows: 24px 8px 16px 8px;
    grid-auto-flow: column;
    margin: 4px 0px;
    padding: 4px 0px;
    background-color: #222;
    border-radius: 8px;
    align-items: center;
    justify-items: center;
}

.contestProblemListProblem:nth-child(odd) {
    background-color: #333;
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
    animation: 2000ms ease v-bind("statusToAnimation(props.data.status)") alternate infinite;
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

@keyframes pstatus-not-uploaded {
    from {
        background-color: #AAA;
    }

    to {
        background-color: #FFF;
    }
}

@keyframes pstatus-uploaded {
    from {
        background-color: #0AA;
    }

    to {
        background-color: #0FF;
    }
}

@keyframes pstatus-submitted {
    from {
        background-color: #A80;
    }

    to {
        background-color: #FD0;
    }
}

@keyframes pstatus-graded-pass {
    from {
        background-color: #0A0;
    }

    to {
        background-color: #0F0;
    }
}

@keyframes pstatus-graded-fail {
    from {
        background-color: #A00;
    }

    to {
        background-color: #F00;
    }
}

@keyframes pstatus-error {
    from {
        background-color: #F00;
    }

    to {
        background-color: #FF0;
    }
}
</style>