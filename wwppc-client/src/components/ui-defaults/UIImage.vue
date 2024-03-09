<script setup lang="ts">
defineProps<{
    src: string,
    alt?: string,
    round?: boolean,
    radius?: string,
    width?: string,
    height?: string
}>();
</script>

<template>
    <img :src=$props.src class="uiImage" :alt=$props.alt>
</template>

<style>
.uiImage {
    /* prevent image from becoming b i g */
    max-width: 100%;
    max-height: 100%;
    width: v-bind("$props.width ?? 'initial'");
    height: v-bind("$props.height ?? 'initial'");
    border-radius: v-bind("$props.round ? ($props.radius ?? '50%') : '0'");
}
</style>