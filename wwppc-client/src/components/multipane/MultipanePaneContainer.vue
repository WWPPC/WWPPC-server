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
let added = false;
export default {
    mounted() {
        const multipane = useMultipane();
        const panes = multipane[this.$props.for]!;
        const scroll = () => {
            const container: HTMLElement | undefined = this.$el?.children[0];
            if (container== undefined) return;
            const element: HTMLElement | null = container.querySelector(`div[name=${this.$props.for}-${panes.hovering != '' ? panes.hovering : panes.selected}]`);
            const children: HTMLCollection = container.children;
            const rect: DOMRect = container.getBoundingClientRect();
            if (element == null) return;
            container.style.transform = `translateX(${Array.from(children).findIndex((el) => el.isSameNode(element)) * -rect.width}px)`;
        };
        watch(() => panes.hovering + '-' + panes.selected, scroll);
        if (added) return;
        added = true;
        window.addEventListener('resize', scroll);
    }
}
</script>

<template>
    <div class="multipanePaneContainerWrapper">
        <div class="multipanePaneContainer">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.multipanePaneContainerWrapper {
    width: 100%;
    height: 100%;
}

.multipanePaneContainer {
    width: 100%;
    height: 100%;
    transition: 250ms ease transform;
    text-wrap: nowrap;
    overflow: visible;
}

.multipanePainContainer {
    width: 999%;
}
</style>