<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    name: string,
    visible?: boolean
}>();
const visible = ref(props.visible);
defineExpose({
    visible
});
</script>
<script lang="ts">
// cheese
import { usePanelStore } from './PanelManager';
export default {
    mounted() {
        const panels = usePanelStore();
        panels.addPanel(this.$el);
    }
}
</script>

<template>
    <div :class="'panelBody panelName' + props.name.toUpperCase() + (visible ? ' hidden' : '')">
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

.hidden {
    display: none;
}
</style>