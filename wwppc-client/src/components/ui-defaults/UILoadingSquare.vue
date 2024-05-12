<script setup lang="ts">
defineProps<{
    color1?: string
    color2?: string
    width?: string
    height?: string
}>();
</script>

<template>
    <div class="uiLoadingSquare">
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

<style scoped>
.uiLoadingSquare {
    display: inline-grid;
    grid-template-columns: repeat(3, 33%);
    grid-template-rows: repeat(3, 33%);
    width: v-bind("$props.width ?? '100%'");
    height: v-bind("$props.height ?? '100%'");
    max-width: 100%;
    max-height: 100%;
    aspect-ratio: 1;
}

.uiLoadingSquare div {
    width: 102%;
    height: 102%;
    animation: 3500ms cubic-bezier(0.2, 0, 0.8, 1) ui-loading-square-colors infinite;
}

.uiLoadingSquare div:nth-child(4),
.uiLoadingSquare div:nth-child(8) {
    animation-delay: 80ms;
}

.uiLoadingSquare div:nth-child(1),
.uiLoadingSquare div:nth-child(5),
.uiLoadingSquare div:nth-child(9) {
    animation-delay: 160ms;
}

.uiLoadingSquare div:nth-child(2),
.uiLoadingSquare div:nth-child(6) {
    animation-delay: 240ms;
}

.uiLoadingSquare div:nth-child(3) {
    animation-delay: 320ms;
}

@keyframes ui-loading-square-colors {

    0%,
    70%,
    100% {
        transform: scale(1);
        background-color: v-bind("$props.color1 ?? 'lime'");
        box-shadow: 0px 0px 8px v-bind("$props.color1 ?? 'lime'");
    }

    9%,
    60% {
        transform: scale(0);
        background-color: v-bind("$props.color1 ?? 'lime'");
    }

    10%,
    59% {
        transform: scale(0);
        background-color: v-bind("$props.color2 ?? 'red'");
        box-shadow: 0px 0px 8px v-bind("$props.color2 ?? 'red'");
    }

    20%,
    50% {
        transform: scale(1);
        background-color: v-bind("$props.color2 ?? 'red'");
    }
}
</style>