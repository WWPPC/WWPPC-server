<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    defaultValue?: string
    title?: string
    width?: string
    height?: string
    font?: string
}>();
const emit = defineEmits<{
    (e: 'input', value: string): void
}>();
const text = ref(props.defaultValue ?? '');
function input() {
    emit('input', text.value);
}
defineExpose({
    text
});
</script>

<template>
    <input type="text" class="uiTextBox" @input=input v-model=text :title=props.title>
</template>

<style>
.uiTextBox {
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'unset'");
    height: v-bind("$props.height ?? '32px'");
    margin: 0px 4px;
    padding: 0px 4px;
    border: 4px solid white;
    background-color: black;
    color: white;
    font: v-bind("$props.font ?? '14px inherit'");
    transition: 50ms linear border-color;
}

.uiTextBox:hover {
    border-color: lime;
}

.uiTextBox:focus {
    border-color: red;
}

.uiTextBox:disabled {
    background-color: #888;
    cursor: not-allowed;
}
</style>