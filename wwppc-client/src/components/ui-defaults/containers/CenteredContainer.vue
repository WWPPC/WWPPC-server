<script setup lang="ts">
defineProps<{
    height?: string
}>();
</script>

<template>
    <div class="centered">
        <div class="centered2">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.centered {
    height: v-bind("$props.height ?? 'unset'");
}

.centered2 {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>