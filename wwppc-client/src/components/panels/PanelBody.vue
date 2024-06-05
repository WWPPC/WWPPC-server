<script setup lang="ts">
import { useRoute } from 'vue-router';
import { setTitlePanel } from '@/scripts/title';
import { watch, nextTick, getCurrentInstance } from 'vue';
import { isMobileRef } from '@/scripts/userAgent';

const route = useRoute();
const props = defineProps<{
    name: string
    title?: string
    isDefault?: boolean
    scrollSnap?: boolean
}>();

const instance = getCurrentInstance();
watch(() => route.params, async () => {
    await nextTick();
    if (instance?.isMounted && (route.params.panel == props.name || (route.params.panel == undefined && props.isDefault && route.params.catchAll === undefined))) setTitlePanel(props.title ?? '');
});
if ((route.params.panel === undefined && props.isDefault && route.params.catchAll === undefined) || route.params.panel == props.name) setTitlePanel(props.title ?? '');
</script>

<template>
    <Transition>
        <div class="panelBody" v-if="route.params.panel == props.name || (route.params.panel == undefined && props.isDefault && route.params.catchAll === undefined)">
            <div :class="'panelBodySlotContainer ' + ((isMobileRef || !props.scrollSnap) ? 'noSnap' : '')">
                <slot></slot>
            </div>
            <div class="panelBodyTransitionWipeContainer">
                <div class="panelBodyTransitionWipe">
                    <img class="panelBodyTransitionWipeImg" src="/icon.svg">
                </div>
            </div>
            <div class="panelBodyCopyrightNotice">
                Copyright &copy; 2024 WWPPC
            </div>
        </div>
    </Transition>
</template>

<style>
.fullBlock {
    width: 100%;
    min-height: 100%;
    margin-bottom: 32px;
    scroll-snap-align: start;
    scroll-margin-top: 16px;
    scroll-margin-bottom: 16px;
    will-change: transform;
    transform-style: preserve-3d;
}

.fullBlock:last-child {
    margin-bottom: 0px;
}
</style>

<style scoped>
.panelBody {
    contain: size layout paint;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    grid-row: 1;
    grid-column: 1;
    position: relative;
    width: 100%;
    height: 100%;
}

.panelBodySlotContainer {
    grid-row: 1;
    grid-column: 1;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 16px 16px;
    font-family: 'Jura', sans-serif;
    font-size: 16px;
    background-color: black;
    scroll-snap-type: y mandatory;
    scroll-snap-stop: always;
    scroll-timeline-name: --panelScrollTimeline;
    perspective: 100px;
    overflow-y: auto;
    overflow-x: hidden;
}

@media (max-width: 100vh) {
    .panelBodySlotContainer {
        scroll-snap-type: none !important;
    }
}

.noSnap {
    scroll-snap-type: none !important;
}

.panelBodyTransitionWipeContainer {
    position: relative;
    grid-row: 1;
    grid-column: 1;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
}

.panelBodyTransitionWipe {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: -100%;
    left: 0px;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background-color: #222;
}

.panelBodyTransitionWipeImg {
    max-width: 30%;
    max-height: 30%;
}

.panelBodyCopyrightNotice {
    position: absolute;
    bottom: 4px;
    left: 4px;
    font-size: 12px;
    font-family: 'Source Code Pro', Courier, monospace;
    pointer-events: none;
}

.v-enter-active,
.v-leave-active {
    transition: 500ms;
}

.v-enter-active .panelBodySlotContainer {
    animation: panel-transition-in 500ms linear;
}

.v-leave-active .panelBodySlotContainer {
    animation: panel-transition-out 500ms linear;
}

.v-enter-active .panelBodyTransitionWipe,
.v-leave-active .panelBodyTransitionWipe {
    animation: panel-wipe 500ms ease;
}

@media (prefers-reduced-motion) {
    .panelBodyTransitionWipeContainer {
        display: none;
    }

    .v-enter-active,
    .v-leave-active {
        transition: 0ms;
    }

    .v-enter-active .panelBodySlotContainer,
    .v-leave-active .panelBodySlotContainer {
        animation-duration: 0ms;
    }
}
</style>