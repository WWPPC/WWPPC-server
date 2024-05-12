<script setup lang="ts">
import { watch } from 'vue';
import { glitchTextTransition, randomGlitchTextTransition, type AsyncTextTransition } from '@/components/ui-defaults/TextTransitions';
import GlowText from './GlowText.vue';

defineProps<{
    text: string
    steps?: number
    delay?: number
    random?: boolean
    fontSize?: string
    color?: string
    glow?: boolean
    shadow?: boolean
    flashing?: boolean
    onVisible?: boolean
}>();
</script>
<script lang="ts">
export default {
    data() {
        return {
            activated: false,
            dispText: this.$props.text.replace('/.g', ' ')
        };
    },
    mounted() {
        if (this.activated) return;
        this.activated = true;
        let running: AsyncTextTransition | null = null;
        const runGlitch = () => {
            if (running) running.cancel();
            if (this.$props.random) {
                running = randomGlitchTextTransition(this.dispText, this.$props.text, (t) => { this.dispText = t; }, 20, this.$props.steps, true, this.$props.delay);
            } else {
                running = glitchTextTransition(this.dispText, this.$props.text, (t) => { this.dispText = t; }, 20, 1, this.$props.text.length + (this.$props.delay ?? 0), this.$props.steps, true);
            }
        };
        if (this.$props.onVisible) {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) runGlitch();
            }, { threshold: 0 });
            observer.observe(this.$el);
        }
        watch(() => this.$props.text, runGlitch);
        runGlitch();
    },
}
</script>

<template>
    <GlowText :text=dispText :font-size=$props.fontSize :color=$props.color :glow=$props.glow :shadow=$props.shadow :flashing=$props.flashing></GlowText>
</template>

<style scoped></style>