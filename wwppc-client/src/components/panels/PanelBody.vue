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
        <div class="panelBody" v-if="route.params.panel == props.name || (route.params.panel == undefined && props.isDefault)">
            <div class="panelBodySlotContainer">
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
.panelBody {
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
    overflow-y: auto;
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
}
</style>

<style scoped>
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
    animation: panel-wipe-vertical 500ms ease;
}
</style>