<script setup lang="ts">
import { inject } from 'vue';
import { useMultipane } from './Multipane';

const props = defineProps<{
    for: string
}>();

const multipane = useMultipane();
const multipaneId = inject('multipane-selector-id');

if (typeof multipaneId != 'string') throw new Error('MultipaneSelector not placed in MultipaneSelectorContainer');

// mouseenter and mouseover ARE NOT THE SAME!
const panes = multipane[multipaneId];

if (panes == undefined) throw new Error('MultipaneSelector for nonexistent multipane instance');

const mouseenter = () => {
    panes.hovering = props.for;
};
const click = () => {
    panes.selected = props.for;
};
</script>

<template>
    <div :class="'multipaneSelector ' + ((panes.hovering == '' && panes.selected == props.for) ? 'multipaneSelectorSelected ' : '')" @mouseenter="mouseenter()" @click="click()">
        <slot></slot>
    </div>
</template>

<style scoped>
.multipaneSelector {
    background-color: transparent;
    border-bottom: 4px solid white;
    transition: 100ms cubic-bezier(0.2, 1, 0.5, 1.6) background-color;
    padding: 4px 4px;
    cursor: pointer;
}

.multipaneSelector:hover,
.multipaneSelectorSelected {
    background-color: #444;
}

.multipaneSelector:last-child {
    border-bottom: none;
}
</style>