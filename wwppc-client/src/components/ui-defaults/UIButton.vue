<script setup lang="ts">
defineProps<{
    text: string
    title?: string
    width?: string
    height?: string
    font?: string
    color?: string
}>();
const emit = defineEmits<{
    (e: 'click'): void
}>();
function click() {
    emit('click');
}
</script>

<template>
    <input type="button" class="uiButton" :value=text @click=click :title=title>
</template>

<style>
.uiButton {
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'unset'");
    height: v-bind("$props.height ?? '32px'");
    border: 4px solid white;
    margin: 0px 4px;
    padding: 0px 4px;
    background-color: black;
    color: v-bind("$props.color ?? 'white'");
    font: v-bind("$props.font ?? 'inherit'");
    transition: 50ms ease transform, 50ms ease border-color;
    cursor: pointer;
}

.uiButton:hover {
    transform: translateY(-2px);
    border-color: lime;
}

.uiButton:active {
    transform: translateY(2px);
    border-color: red;
}

.uiButton:disabled {
    border-color: gray !important;
    transform: none !important;
    cursor: not-allowed;
}
</style>