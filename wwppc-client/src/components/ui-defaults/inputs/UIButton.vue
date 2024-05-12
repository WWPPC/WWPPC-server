<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { glitchTextTransition } from '../TextTransitions';

const props = defineProps<{
    text: string
    title?: string
    width?: string
    height?: string
    font?: string
    fontSize?: string
    color?: string
    backgroundColor?: string
    type?: 'button' | 'submit'
    glitchOnMount?: boolean
}>();
const emit = defineEmits<{
    (e: 'click'): any
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

<style scoped>
.uiButton {
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'unset'");
    height: v-bind("$props.height ?? 'min-content'");
    margin: 0px 4px;
    padding: 0.125em 0.4em;
    border: 4px solid white;
    border-radius: 0px;
    background-color: v-bind("$props.backgroundColor ?? 'black'");
    color: v-bind("$props.color ?? 'white'");
    font: v-bind("$props.font ?? 'inherit'");
    font-size: v-bind("$props.fontSize ?? 'var(--font-16)'");
    font-family: 'Source Code Pro', Courier, monospace;
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
    border-color: #888 !important;
    transform: none !important;
    opacity: 1;
    cursor: not-allowed;
}
</style>../TextTransitions