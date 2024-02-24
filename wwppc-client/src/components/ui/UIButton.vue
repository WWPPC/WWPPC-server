<script setup lang="ts">
defineProps<{
    text: string,
    title?: string,
    width?: string,
    height?: string,
    font?: string
}>();
const emit = defineEmits<{
    (e: 'click'): void
}>();
function click() {
    emit('click');
}
</script>

<template>
    <input type="button" :value=text @click=click :title=title>
</template>

<style scoped>
input {
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'unset'");
    height: v-bind("$props.height ?? '32px'");
    border: 4px solid white;
    margin: 0px 0px;
    padding: 0px 4px;
    background-color: black;
    color: white;
    font: v-bind("$props.font ?? 'inherit'");
    transition: 50ms ease transform, 50ms ease border-color;
    cursor: pointer;
}

input:hover {
    transform: translateY(-2px);
    border-color: lime;
}

input:active {
    transform: translateY(2px);
    border-color: red;
}

input:disabled {
    border-color: gray !important;
    transform: none !important;
    cursor: not-allowed;
}
</style>