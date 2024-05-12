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
    <div class="multipaneSelectorContainer" @mouseout="mouseleave()">
        <slot></slot>
    </div>
</template>

<style scoped>
.multipaneSelectorContainer {
    display: flex;
    flex-direction: column;
    padding-bottom: -4px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>