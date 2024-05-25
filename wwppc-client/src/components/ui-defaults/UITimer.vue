<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { GlowText } from '../ui-defaults/UIDefaults';

const props = defineProps<{
    to: Date
    type: 'clock' | 'timer' | 'min-timer' | 'age' | 'min-age'
    countUp?: boolean
    fontSize?: string
    color?: string
    glow?: boolean
    shadow?: boolean
    flashing?: boolean
    flashColor?: string
}>();

const emit = defineEmits<{
    (e: 'zero'): any
}>();

let update: NodeJS.Timeout; // what
let hitZero = false;
const text = ref('');
onMounted(() => {
    clearInterval(update);
    update = setInterval(() => {
        const time = Math.abs(props.to.getTime() - Date.now());
        if (props.type == 'clock') {
            const seconds = ((Math.floor(time / 1000) % 60) / 100).toFixed(2).substring(2);
            const minutes = ((Math.floor(time / 60000) % 60) / 100).toFixed(2).substring(2);
            const hours = ((Math.floor(time / 3600000) % 24) / 100).toFixed(2).substring(2);
            const days = (Math.floor(time / 86400000) * (props.countUp ? -1 : 1)).toString();
            text.value = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else if (props.type == 'timer') {
            const seconds = ((Math.floor(time / 1000) % 60) / 100).toFixed(2).substring(2);
            const minutes = ((Math.floor(time / 60000) % 60) / 100).toFixed(2).substring(2);
            const hours = (Math.floor(time / 3600000) * (props.countUp ? -1 : 1)).toString();
            text.value = `${hours}:${minutes}:${seconds}`;
        } else if (props.type == 'min-timer') {
            const seconds = ((Math.floor(time / 1000) % 60) / 100).toFixed(2).substring(2);
            const minutes = (Math.floor(time / 60000) * (props.countUp ? -1 : 1)).toString();
            text.value = `${minutes}:${seconds}`;
        } else if (props.type == 'age') {
            const seconds = ((Math.floor(time / 1000) % 60) / 100);
            if (seconds != 0) text.value = seconds.toString() + (seconds == 1 ? ' second' : ' seconds');
            const minutes = ((Math.floor(time / 60000) % 60) / 100);
            if (minutes != 0) text.value = minutes.toString() + (seconds == 1 ? ' minute' : ' minutes');
            const hours = ((Math.floor(time / 3600000) % 24) / 100);
            if (hours != 0) text.value = hours.toString() + (seconds == 1 ? ' hour' : ' hours');
            const days = (Math.floor(time / 86400000) % 365);
            if (days != 0) text.value = days.toString() + (seconds == 1 ? ' day' : ' days');
            const years = Math.floor(time / 31536000000);
            if (years != 0) text.value = years.toString() + (seconds == 1 ? ' year' : ' years');
        } else if (props.type == 'min-age') {
            const seconds = ((Math.floor(time / 1000) % 60) / 100);
            if (seconds != 0) text.value = seconds.toString() + 's';
            const minutes = ((Math.floor(time / 60000) % 60) / 100);
            if (minutes != 0) text.value = minutes.toString() + 'm';
            const hours = ((Math.floor(time / 3600000) % 24) / 100);
            if (hours != 0) text.value = hours.toString() + 'h';
            const days = (Math.floor(time / 86400000) % 365);
            if (days != 0) text.value = days.toString() + 'd';
            const years = Math.floor(time / 31536000000);
            if (years != 0) text.value = years.toString() + 'y';
        }
        if (!props.countUp) {
            if (Date.now() >= props.to.getTime() && !hitZero) {
                hitZero = true;
                emit('zero');
            }
        }
    }, 100);
});
onUnmounted(() => {
    clearInterval(update);
    hitZero = false;
});
watch(() => props.to, () => hitZero = false);
</script>

<template>
    <GlowText :text="text" :font-size="props.fontSize" :color="color" :glow="props.glow" :shadow="props.shadow" :flashing="props.flashing" :flashColor="props.flashColor"></GlowText>
</template>