<script setup lang="ts">
import { provide, watch } from 'vue';
import { Multipane, useMultipane } from './Multipane';

const props = defineProps<{
    for: string
    default: string
}>();

const multipane = useMultipane();
provide('multipane-selector-id', props.for);

if (multipane[props.for] == undefined) multipane[props.for] = new Multipane();
multipane[props.for]!.selected = props.default;
</script>
<script lang="ts">
export default {
    mounted() {
        const multipane = useMultipane();
        const panes = multipane[this.$props.for]!;
        watch(() => panes.hovering + '-' + panes.selected, () => {
            this.$el?.querySelector(`div[name=${this.$props.for}-${panes.hovering != '' ? panes.hovering : panes.selected}]`)?.scrollIntoView({ behavior: 'smooth' });
        });
    }
}
</script>

<template>
    <div class="multipanePaneContainer">
        <slot></slot>
    </div>
</template>

<style scoped>
.multipanePaneContainer {
    width: 100%;
    height: 100%;
    scroll-snap-type: x mandatory;
    text-wrap: nowrap;
    word-wrap: none;
    overflow: hidden;
}

.multipanePainContainer {
    width: 999%;
}
</style>