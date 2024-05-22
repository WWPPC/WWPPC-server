<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { GlowText } from './UIDefaults';

const props = defineProps<{
    time: number
    form: 'long' | 'short'
    showComplete?: boolean
    showMillis?: boolean
    fontSize?: string
    color?: string
    glow?: boolean
    shadow?: boolean
    flashing?: boolean
    flashColor?: string
}>();

const timeMaps = {
    long: {
        y: 'years',
        mm: 'months',
        d: 'days',
        h: 'hours',
        m: 'minutes',
        s: 'seconds',
        ms: 'milliseconds'
    },
    short: {
        y: 'y',
        mm: 'mo',
        d: 'd',
        h: 'h',
        m: 'm',
        s: 's',
        ms: 'ms'
    }
}
const text = ref('');
const update = () => {
    // reset to UTC year 0
    const time = new Date(Math.abs(props.time) - 62167219200000);
    const map = timeMaps[props.form];
    let showFollowing = false;
    let t = '';
    if (time.getUTCFullYear() != 0) {
        showFollowing = true;
        t += time.getUTCFullYear() + map.y + ' ';
    }
    if (time.getUTCMonth() != 0 || (showFollowing && props.showComplete)) {
        showFollowing = true;
        t += time.getUTCMonth() + map.mm + ' ';
    }
    if (time.getUTCDate() != 1 || (showFollowing && props.showComplete)) {
        showFollowing = true;
        t += (time.getUTCDate() - 1) + map.d + ' ';
    }
    if (time.getUTCHours() != 0 || (showFollowing && props.showComplete)) {
        showFollowing = true;
        t += time.getUTCHours() + map.h + ' ';
    }
    if (time.getUTCMinutes() != 0 || (showFollowing && props.showComplete)) {
        showFollowing = true;
        t += time.getUTCMinutes() + map.m + ' ';
    }
    if (time.getUTCSeconds() != 0 || (showFollowing && props.showComplete)) {
        showFollowing = true;
        t += time.getUTCSeconds() + map.s + ' ';
    }
    if (time.getUTCMilliseconds() != 0 || (showFollowing && props.showComplete)) {
        showFollowing = true;
        t += time.getUTCMilliseconds() + map.ms + ' ';
    }
    if (!showFollowing) t = props.showMillis ? '0ms' : '0s';
    text.value = t;
    // const time = Math.abs(props.time);
    // const millis = (time % 1000) / 1000;
    // const seconds = (Math.floor(time / 1000) % 60) / 100;
    // const minutes = (Math.floor(time / 60000) % 60) / 100;
    // const hours = (Math.floor(time / 3_600_000) % 24) / 100;
    // const days = Math.floor(time / 86_400_000) % 7;
    // const weeks = Math.floor(time / 604_800_000) % 4;
    // // showing weeks and months at the same time is weird
    // if (props.type == 'clock') {
    //     if (days != 0) text.value = `${days}d ${hours.toFixed(2).substring(2)}h ${minutes.toFixed(2).substring(2)}m ${seconds.toFixed(2).substring(2)}${props.showMillis ? '.' + millis.toFixed(3).substring(2) : ''}`;
    //     else if (hours != 0) text.value = `${hours * 100}h ${minutes.toFixed(2).substring(2)}m ${seconds.toFixed(2).substring(2)}${props.showMillis ? '.' + millis.toFixed(3).substring(2) : ''}`;
    //     else if (minutes != 0) text.value = `${minutes * 100}m ${seconds.toFixed(2).substring(2)}s ${props.showMillis ? millis.toFixed(3).substring(2) + 'ms' : ''}`;
    //     else if (seconds != 0) text.value = `${seconds * 100}s ${props.showMillis ? millis.toFixed(3).substring(2) + 'ms' : ''}`;
    //     else if (millis != 0 && props.showMillis) text.value = `${millis * 1000}ms`;
    //     else text.value = '0' + (props.showMillis ? 'ms' : 's');
    // } else if (props.type == 'timer') {
    //     if (days != 0) text.value = `${days}d ${hours.toFixed(2).substring(2)}:${minutes.toFixed(2).substring(2)}:${seconds.toFixed(2).substring(2)}${props.showMillis ? '.' + millis.toFixed(3).substring(2) : ''}`;
    //     else if (hours != 0) text.value = `${hours * 100}:${minutes.toFixed(2).substring(2)}:${seconds.toFixed(2).substring(2)}${props.showMillis ? '.' + millis.toFixed(3).substring(2) : ''}`;
    //     else if (minutes != 0) text.value = `${minutes * 100}:${seconds.toFixed(2).substring(2)}${props.showMillis ? '.' + millis.toFixed(3).substring(2) : ''}`;
    //     else if (seconds != 0) text.value = `${seconds * 100}${props.showMillis ? '.' + millis.toFixed(3).substring(2) : ''}`;
    //     else if (millis != 0 && props.showMillis) text.value = `${millis.toFixed(3).substring(2)}`;
    //     else text.value = '0' + (props.showMillis ? 'ms' : 's');
    // }
};

watch(() => props.time, update);
watch(() => props.form, update);
watch(() => props.showMillis, update);
onMounted(update);
</script>

<template>
    <GlowText :text="text" :font-size="props.fontSize" :color="color" :glow="props.glow" :shadow="props.shadow" :flashing="props.flashing" :flashColor="props.flashColor"></GlowText>
</template>