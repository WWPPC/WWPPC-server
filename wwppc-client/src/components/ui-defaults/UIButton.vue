<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { glitchTextTransition } from './TextTransitions';

const props = defineProps<{
    text: string
    title?: string
    width?: string
    height?: string
    font?: string
    color?: string
    backgroundColor?: string
    type?: 'button' | 'submit'
    glitchOnMount?: boolean
    fontSize?: string
}>();
const emit = defineEmits<{
    (e: 'click'): void
}>();
function click() {
    emit('click');
}

const buttonText = ref(props.glitchOnMount ? props.text.replace(/./g, ' ') : props.text);
if (props.glitchOnMount) {
    onMounted(() => {
        glitchTextTransition(buttonText.value, props.text, (text) => { buttonText.value = text; }, 40, 1, 15, 1);
    });
}
watch(() => props.text, () => buttonText.value = props.text);
</script>

<template>
    <input :type="props.type ?? 'button'" class="uiButton" :value=buttonText @click=click :title=props.title>
</template>

<style>
.uiButton {
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'unset'");
    height: v-bind("$props.height ?? 'initial'");
    margin: 0px 4px;
    padding: 0px 4px;
    border: 4px solid white;
    border-radius: 0px;
    background-color: v-bind("$props.backgroundColor ?? 'black'");
    color: v-bind("$props.color ?? 'white'");
    font: v-bind("$props.font ?? 'inherit'");
    font-family: 'Source Code Pro', Courier, monospace;
    transition: 50ms ease transform, 50ms ease border-color;
    font-size: v-bind("$props.fontSize ?? '16px'");
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