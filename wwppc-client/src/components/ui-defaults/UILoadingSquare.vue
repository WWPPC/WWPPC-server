<script setup lang="ts">
defineProps<{
    color1?: string
    color2?: string
    width?: string
    height?: string
}>();
</script>

<template>
    <div class="UILoadingSquare">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>

<style>
.UILoadingSquare {
    display: inline-grid;
    grid-template-columns: repeat(3, 33%);
    grid-template-rows: repeat(3, 33%);
    width: v-bind("$props.width ?? '100%'");
    height: v-bind("$props.height ?? '100%'");
    max-width: 100%;
    max-height: 100%;
    aspect-ratio: 1;
}

.UILoadingSquare div {
    width: 100%;
    height: 100%;
    animation: 5s cubic-bezier(0.2, 0, 0.8, 1) ui-loading-square-colors infinite;
}

.UILoadingSquare div:nth-child(4),
.UILoadingSquare div:nth-child(8) {
    animation-delay: 100ms;
}

.UILoadingSquare div:nth-child(1),
.UILoadingSquare div:nth-child(5),
.UILoadingSquare div:nth-child(9) {
    animation-delay: 200ms;
}

.UILoadingSquare div:nth-child(2),
.UILoadingSquare div:nth-child(6) {
    animation-delay: 300ms;
}

.UILoadingSquare div:nth-child(3) {
    animation-delay: 400ms;
}

@keyframes ui-loading-square-colors {
    0% {
        transform: scale(1);
        background-color: #FF0000;
    }

    9% {
        transform: scale(0);
        background-color: #FF0000;
    }

    10% {
        transform: scale(0);
        background-color: #00FF00;
    }

    19%,
    33% {
        transform: scale(1);
        background-color: #00FF00;
    }

    42% {
        transform: scale(0);
        background-color: #00FF00;
    }

    43% {
        transform: scale(0);
        background-color: #0000FF;
    }

    52%,
    66% {
        transform: scale(1);
        background-color: #0000FF;
    }

    75% {
        transform: scale(0);
        background-color: #0000FF;
    }

    76% {
        transform: scale(0);
        background-color: #FF0000;
    }

    85%,
    100% {
        transform: scale(1);
        background-color: #FF0000;
    }
}
</style>