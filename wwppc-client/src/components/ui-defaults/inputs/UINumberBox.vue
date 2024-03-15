<script setup lang="ts">
const props = defineProps<{
    min?: number
    max?: number
    step?: number
    defaultValue?: number
    highlightInvalid?: boolean
    title?: string
    width?: string
    height?: string
    font?: string
}>();
const emit = defineEmits<{
    (e: 'input', value: number): void
}>();
const number = defineModel({ default: 0 });
number.value = props.defaultValue ?? 0;
function input() {
    emit('input', number.value);
}
defineExpose({
    value: number
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
    border-radius: 0px;
    background-color: black;
    color: white;
    font: v-bind("$props.font ?? '14px inherit'");
    font-family: 'Source Code Pro', Courier, monospace;
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
    border-color: #888 !important;
    cursor: not-allowed;
}
</style>