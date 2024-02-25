<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { glitchTextTransition, type AsyncTextTransition } from '../ui-defaults/TextTransitions';
const props = defineProps<{
    text: string,
    title?: string,
    link?: boolean
}>();
const emit = defineEmits<{
    (e: 'click'): void
}>();
function click() {
    emit('click');
}
// animations for hover
const buttonText = ref(props.text)
let currentAnimation: AsyncTextTransition | null = null;
function mouseover() {
    currentAnimation?.cancel();
    currentAnimation = glitchTextTransition(buttonText.value, props.text, (text) => { buttonText.value = text; }, 40, 2, 15, 1, !currentAnimation?.finished);
}
onMounted(() => {
    currentAnimation = glitchTextTransition(buttonText.value, props.text, (text) => { buttonText.value = text; }, 40, 2, 15, 2, !currentAnimation?.finished);
});
</script>

<template>
    <input type="button" class="panelNavButton" :value=buttonText @click=click @mouseover=mouseover :title=title>
</template>

<style>
.panelNavButton {
    appearance: none;
    width: 128px;
    margin-bottom: -4px;
    border: none;
    border-bottom: 4px solid white;
    transition: 100ms cubic-bezier(0.6, 1, 0.5, 1.6) background-color;
    font-size: 18px;
    color: white;
    background-color: transparent;
    font-family: 'Source Code Pro', Courier, monospace;
    cursor: pointer;
}

.panelNavButton:hover {
    background-color: #444;
    font-weight: bold;
}
</style>