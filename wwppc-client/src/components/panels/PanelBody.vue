<script setup lang="ts">
const props = defineProps<{
    name: string
}>();
</script>

<template>
    <div :class="'panelBody panelName' + props.name.toUpperCase()">
        <slot></slot>
    </div>
</template>

<style>
.panelBody {
    position: absolute;
    bottom: 0px;
    left: 0px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 16px 16px;
    background-color: black;
}
</style>