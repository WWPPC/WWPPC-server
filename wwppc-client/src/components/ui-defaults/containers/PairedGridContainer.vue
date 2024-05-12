<script setup lang="ts">
defineProps<{
    width?: string
    height?: string
}>();
</script>

<template>
    <div class="pairedGridContainer">
        <slot></slot>
    </div>
</template>

<style scoped>
.pairedGridContainer {
    display: grid;
    grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
    width: v-bind("$props.width ?? 'unset'");
    height: v-bind("$props.height ?? 'unset'");
    text-align: left;
    justify-items: left;
    align-items: center;
    row-gap: 8px;
    column-gap: 8px;
}

.pairedGridContainer>*:nth-child(odd) {
    text-align: right;
    justify-self: right;
}
</style>