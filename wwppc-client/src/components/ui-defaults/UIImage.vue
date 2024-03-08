<script setup lang="ts">
defineProps<{
    src: string,
    link?: string,
    round?: boolean,
    radius?: string,
    width?: string,
    height?: string
}>();
</script>

<template>
    <img :src="src" :class="'uiImage ' + ($props.round ? 'uiImageRound' : '')">
</template>

<style>
.uiImage {
    /* prevent image from becoming b i g */
    max-width: 100%;
    max-height: 100%;
    width: v-bind("$props.width");
    height: v-bind("$props.height");
}

.uiImageRound {
    border-radius: v-bind("$props.radius ?? '50%'");
}
</style>