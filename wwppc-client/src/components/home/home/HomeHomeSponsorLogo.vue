<script setup lang="ts">
import { isMobileRef } from '@/scripts/userAgent';

defineProps<{
    src: string
    url: string
    height: string
}>();
</script>

<template>
    <a :href="$props.url" target="_blank" class="sponsorImgWrapper">
        <img :src=$props.src :class="'sponsorImg ' + (isMobileRef ? 'noFilter' : '')" loading="lazy">
    </a>
</template>

<style scoped>
.sponsorImgWrapper {
    display: flex;
    align-items: center;
}

.sponsorImg {
    width: 100%;
    height: v-bind("$props.height");
    filter: grayscale(1) brightness(1000) contrast(1000);
    transition: 150ms cubic-bezier(0.5, 0.5, 0.5, 2) transform, 50ms linear filter;
    transform: none;
    object-fit: contain;
    object-position: center;
}

.noFilter {
    filter: none !important;
}

.sponsorImg:hover {
    transform: scale(110%);
    filter: none;
}
</style>