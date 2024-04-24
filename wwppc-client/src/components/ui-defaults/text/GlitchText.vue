<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { glitchTextTransition, randomGlitchTextTransition } from '@/components/ui-defaults/TextTransitions';
import GlowText from './GlowText.vue';
const props = defineProps<{
    text: string
    steps?: number
    delay?: number
    random?: boolean
    fontSize?: string
    color?: string
    glow?: boolean
    shadow?: boolean
}>();

const dispText = ref(props.text.replace(/./g, ' '));
const runGlitch = () => {
    if (props.random) {
        setTimeout(() => randomGlitchTextTransition(dispText.value, props.text, (t) => { dispText.value = t; }, 20, props.steps, true), props.delay);
    } else {
        glitchTextTransition(dispText.value, props.text, (t) => { dispText.value = t; }, 20, 1, props.text.length + (props.delay ?? 0), props.steps, true);
    }
};

onMounted(runGlitch);
watch(() => props.text, runGlitch);
</script>

<template>
    <GlowText :text=dispText :font-size=props.fontSize :color=props.color :glow=props.glow :shadow=props.shadow></GlowText>
</template>

<style></style>