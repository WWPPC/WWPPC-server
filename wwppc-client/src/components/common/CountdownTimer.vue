<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { GlowText } from '../ui-defaults/UIDefaults';

const props = defineProps<{
    to: Date
    type: 'clock' | 'timer' | 'min-timer'
    fontSize?: string
    color?: string
    glow?: boolean
    shadow?: boolean
    flashing?: boolean
    flashColor?: string
}>();

let update: NodeJS.Timeout; // what
const text = ref('');
onMounted(() => {
    clearInterval(update);
    if (props.type == 'clock') {
        update = setInterval(() => {
            const time = props.to.getTime() - Date.now();
            const seconds = ((Math.floor(time / 1000) % 60) / 100).toFixed(2).substring(2);
            const minutes = ((Math.floor(time / 60000) % 60) / 100).toFixed(2).substring(2);
            const hours = ((Math.floor(time / 3600000) % 24) / 100).toFixed(2).substring(2);
            const days = Math.floor(time / 86400000).toString();
            text.value = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }, 100);
    } else if (props.type == 'timer') {
        update = setInterval(() => {
            const time = props.to.getTime() - Date.now();
            const seconds = ((Math.floor(time / 1000) % 60) / 100).toFixed(2).substring(2);
            const minutes = ((Math.floor(time / 60000) % 60) / 100).toFixed(2).substring(2);
            const hours = ((Math.floor(time / 3600000) % 24) / 100).toFixed(2).substring(2);
            text.value = `${hours}:${minutes}:${seconds}`;
        }, 100);
    } else if (props.type == 'min-timer') {
        update = setInterval(() => {
            const time = props.to.getTime() - Date.now();
            const seconds = ((Math.floor(time / 1000) % 60) / 100).toFixed(2).substring(2);
            const minutes = ((Math.floor(time / 60000) % 60) / 100).toFixed(2).substring(2);
            text.value = `${minutes}:${seconds}`;
        }, 100);
    }
});
onUnmounted(() => {
    clearInterval(update);
})
</script>

<template>
    <GlowText :text="text" :font-size="props.fontSize" :color="color" :glow="props.glow" :shadow="props.shadow" :flashing="props.flashing" :flashColor="props.flashColor"></GlowText>
</template>