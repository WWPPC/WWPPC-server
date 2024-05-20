<script setup lang="ts">
import { inject } from 'vue';

defineProps<{
    for: string
}>();

const multipaneId = inject('multipane-selector-id');

if (typeof multipaneId != 'string') throw new Error('MultipaneSelector not placed in MultipaneSelectorContainer');
</script>

<template>
    <div class="multipanePane" :name="multipaneId + '-' + $props.for">
        <slot></slot>
    </div>
</template>

<style scoped>
.multipanePane {
    contain: layout;
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 12px 12px;
    text-wrap: initial;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>