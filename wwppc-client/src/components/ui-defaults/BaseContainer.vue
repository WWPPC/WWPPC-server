<script setup lang="ts">
const props = defineProps<{
    width?: string
    height?: string
    borderStyle?: string
}>();
</script>

<template>
    <div class="baseContainerContainer">
        <slot></slot>
    </div>
</template>

<style>
.baseContainerContainer {
    width: v-bind("props.width ?? 'initial'");
    height: v-bind("props.height ?? 'initial'");
    border: v-bind("props.borderStyle ?? '2px solid white'");
}
</style>