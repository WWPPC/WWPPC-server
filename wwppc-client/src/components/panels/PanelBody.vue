<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
const props = defineProps<{
    name: string
    isDefault?: boolean
}>();
</script>

<template>
    <Transition>
        <div :class="'panelBody panelName' + props.name.toUpperCase()" v-if="route.params.panel == props.name || (route.params.panel == undefined && props.isDefault)">
            <slot></slot>
        </div>
    </Transition>
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
    font-family: 'Jura', sans-serif;
    font-size: 16px;
    background-color: black;
    scrollbar-color: #555 #222;
    overflow-y: auto;
}
.v-enter-active {
    transition: 200ms linear transform;
}
.v-leave-active {
    transition: 200ms linear transform;
}
.v-enter-from {
    transform: translateX(-100vw);
}
.v-leave-to {
    transform: translateX(100vw);
}
</style>