<script setup lang="ts">
defineProps<{
    color?: string
    margin?: string
}>();
</script>

<template>
    <div class="uiDivider"></div>
</template>

<style scoped>
.uiDivider {
    display: inline-block;
    box-sizing: content-box;
    width: calc(100% - 64px);
    height: 4px;
    margin: v-bind("$props.margin ?? '8px'") 32px;
    background-color: v-bind("$props.color ?? 'white'");
}
</style>