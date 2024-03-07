  <script setup lang="ts">
import { onMounted, ref } from 'vue';
import { glitchTextTransition, randomGlitchTextTransition } from './ui-defaults/TextTransitions';
const props = defineProps<{
    text: string
    steps?: number
    delay?: number
    random?: boolean
}>();

const dispText = ref(props.text.replace(/./g, ' '));

onMounted(() => {
    if (props.random) {
        setTimeout(() => randomGlitchTextTransition(dispText.value, props.text, (t) => {dispText.value = t; }, 20, props.steps), props.delay);
    } else {
        glitchTextTransition(dispText.value, props.text, (t) => { dispText.value = t; }, 20, 1, props.text.length + (props.delay ?? 0), props.steps, true);
    }
});
</script>

<template>
    <div class="centered glitchText">
        {{ dispText }}
    </div>
</template>

<style>
.glitchText {
    font-family: 'Source Code Pro', Courier, monospace;
}
</style>