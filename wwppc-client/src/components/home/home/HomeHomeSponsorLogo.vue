<script setup lang="ts">
defineProps<{
    src: string
    url: string
}>();
</script>

<template>
    <a :href="$props.url" target="_blank">
        <img :src=$props.src class="sponsorImg">
    </a>
</template>

<style scoped>
.sponsorImg {
    width: 100%;
    filter: grayscale(1) brightness(1000) contrast(1000);
    transition: 150ms cubic-bezier(0.5, 0.5, 0.5, 1) transform, 50ms linear filter;
    transform: none;
}

.sponsorImg:hover {
    transform: scale(110%);
    filter: none;
    object-fit: contain;
}
</style>