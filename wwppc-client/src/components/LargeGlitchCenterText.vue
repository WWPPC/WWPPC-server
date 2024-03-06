<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { glitchTextTransition, randomGlitchTextTransition } from './ui-defaults/TextTransitions';
const props = defineProps<{
    text: string
    steps?: number
    delay?: number
    fontStyle?: string
    random?: boolean
}>();

const dispText = ref(props.text.replace(/./g, ' '));

onMounted(() => {
    if (props.random) {
        randomGlitchTextTransition(dispText.value, props.text, (t) => {dispText.value = t; }, 20, 0.2);
    } else {
        glitchTextTransition(dispText.value, props.text, (t) => { dispText.value = t; }, 20, 1, props.text.length + (props.delay ?? 0), props.steps, true);
    }
});
</script>

<template>
    <div class="centered glitchText" :style=props.fontStyle>
        {{ dispText }}
    </div>
</template>

<style>
.glitchText {
    font-family: 'Source Code Pro', Courier, monospace;
}
</style>