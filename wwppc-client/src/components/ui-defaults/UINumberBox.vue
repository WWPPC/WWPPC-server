<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    min?: number,
    max?: number,
    step?: number,
    defaultValue?: number,
    highlightInvalid?: number,
    title?: string,
    width?: string,
    height?: string,
    font?: string
}>();
const emit = defineEmits<{
    (e: 'input', value: number): void
}>();
const number = ref(props.defaultValue ?? 0);
function input() {
    emit('input', number.value);
}
</script>

<template>
    <input type="number" @input=input v-model=number :title=title :min="min" :max=max :step=step>
</template>

<style scoped>
input {
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'initial'");
    height: v-bind("$props.height ?? '32px'");
    margin: 0px 4px;
    padding: 0px 4px;
    border: 4px solid white;
    background-color: black;
    color: white;
    font: v-bind("$props.font ?? '14px inherit'");
    transition: 50ms linear border-color;
}

input:hover {
    border-color: lime !important;
}

input:focus {
    border-color: red !important;
}

input:invalid {
    border-color: v-bind("$props.highlightInvalid ? 'yellow' : ''");
}

input:disabled {
    background-color: #888;
    cursor: not-allowed;
}
</style>