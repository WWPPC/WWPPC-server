<script setup lang="ts">
const props = defineProps<{
    value: string
}>();

const copy = () => {
    navigator.clipboard.writeText(props.value);
};
</script>

<template>
    <img src="/assets/copy.svg" class="uiCopyButton" @click="copy()" title="Copy to clipboard">
</template>

<style scoped>
.uiCopyButton {
    width: 1em;
    height: 1em;
    margin-top: 0.2em;
    cursor: copy;
}
</style>