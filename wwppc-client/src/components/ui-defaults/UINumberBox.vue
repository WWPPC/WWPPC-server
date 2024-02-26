<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    min?: number
    max?: number
    step?: number
    defaultValue?: number
    highlightInvalid?: number
    title?: string
    width?: string
    height?: string
    font?: string
}>();
const emit = defineEmits<{
    (e: 'input', value: number): void
}>();
const number = ref(props.defaultValue ?? 0);
function input() {
    emit('input', number.value);
}
defineExpose({
    number
});
</script>

<template>
    <input type="number" class="uiNumberBox" @input=input v-model=number :title=props.title :min=props.min :max=props.max :step=props.step>
</template>

<style>
.uiNumberBox {
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

.uiNumberBox:hover {
    border-color: lime !important;
}

.uiNumberBox:focus {
    border-color: red !important;
}

.uiNumberBox:invalid {
    border-color: v-bind("$props.highlightInvalid ? 'yellow' : ''");
}

.uiNumberBox:disabled {
    background-color: #888;
    cursor: not-allowed;
}
</style>