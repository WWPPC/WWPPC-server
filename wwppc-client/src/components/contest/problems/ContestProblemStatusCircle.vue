<script setup lang="ts">

import {
    completionStateString,
    ContestProblemCompletionState,
    completionStateAnimation
} from "@/scripts/ContestManager";

const props = defineProps<{
    status: ContestProblemCompletionState
}>();
</script>

<template>
    <div class="contestProblemListProblemStatus"></div>
</template>


<style>
.contestProblemListProblemStatus {
    width: 32px;
    height: 32px;
    animation: 2000ms linear v-bind("completionStateAnimation(props.status)") alternate infinite, 2000ms ease p-brightness-oscillation alternate infinite;
    border-radius: 50%;
    cursor: help;
}

@keyframes p-brightness-oscillation {
    from {
        filter: brightness(1);
    }

    to {
        filter: brightness(0.8);
    }
}

@keyframes pstatus-not-uploaded {

    from,
    to {
        background-color: #FFF;
    }
}

@keyframes pstatus-uploaded {

    from,
    to {
        background-color: #0FF;
    }
}

@keyframes pstatus-submitted {

    from,
    to {
        background-color: #FD0;
    }
}

@keyframes pstatus-graded-pass {

    from,
    to {
        background-color: #0F0;
    }
}

@keyframes pstatus-graded-fail {

    from,
    to {
        background-color: #F00;
    }
}

@keyframes pstatus-graded-partial {
    0% {
        background-color: hsl(60deg, 100%, 50%);
    }

    20% {
        background-color: hsl(72deg, 100%, 50%);
    }

    40% {
        background-color: hsl(84deg, 100%, 50%);
    }

    60% {
        background-color: hsl(96deg, 100%, 50%);
    }

    80% {
        background-color: hsl(108deg, 100%, 50%);
    }

    100% {
        background-color: hsl(120deg, 100%, 50%);
    }
}

@keyframes pstatus-error {

    0%,
    100% {
        background-color: hsl(0deg, 100%, 50%);
    }

    10%,
    90% {
        background-color: hsl(12deg, 100%, 50%);
    }

    20%,
    80% {
        background-color: hsl(24deg, 100%, 50%);
    }

    30%,
    70% {
        background-color: hsl(36deg, 100%, 50%);
    }

    40%,
    60% {
        background-color: hsl(48deg, 100%, 50%);
    }

    50% {
        background-color: hsl(60deg, 100%, 50%);
    }
}
</style>