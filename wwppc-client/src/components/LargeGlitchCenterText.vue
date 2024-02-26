<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { glitchTextTransition } from './ui-defaults/TextTransitions';
const props = defineProps<{
    text: string
    steps?: number
    delay?: number
    fontStyle: string
}>();

const dispText = ref(props.text.replace(/./g, ' '));

onMounted(() => {
    glitchTextTransition(dispText.value, props.text, (t) => { dispText.value = t; }, 20, 1, props.text.length + (props.delay ?? 0), props.steps, true);
});
</script>

<template>
    <div class="centered" :style=props.fontStyle>
        {{ dispText }}
    </div>
</template>