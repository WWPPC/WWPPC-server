<script setup lang="ts">
import { provide } from 'vue';
import { Multipane, useMultipane } from './Multipane';

const props = defineProps<{
    for: string
}>();

const multipane = useMultipane();
provide('multipane-selector-id', props.for);

const mouseleave = () => {
    if (multipane[props.for] != undefined) multipane[props.for]!.hovering = '';
};
if (multipane[props.for] == undefined) multipane[props.for] = new Multipane();
</script>

<template>
    <div class="multipaneSelectorContainer" @mouseleave="mouseleave()">
        <slot></slot>
    </div>
</template>

<style scoped>
.multipaneSelectorContainer {
    contain: layout;
    display: flex;
    flex-direction: column;
    border-bottom: 4px solid white;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>