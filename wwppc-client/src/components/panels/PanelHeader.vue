<script setup lang="ts"></script>

<template>
    <header class="panelHeader">
        <div class="panelHeaderSlotContainer">
            <slot></slot>
        </div>
        <div class="panelHeaderTransitionWipeContainer">
            <div class="panelHeaderTransitionWipe"></div>
        </div>
    </header>
</template>

<style scoped>
.panelHeader {
    contain: size layout paint;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    grid-row: 1;
    grid-column: 1;
    background-color: #222;
    border-bottom: 4px solid white;
}

.panelHeaderSlotContainer {
    display: flex;
    grid-row: 1;
    grid-column: 1;
    width: 100%;
    height: 100%;
    flex-direction: row;
    justify-content: start;
}

.panelHeaderTransitionWipeContainer {
    position: relative;
    grid-row: 1;
    grid-column: 1;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
}

.panelHeaderTransitionWipe {
    position: absolute;
    top: -100%;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: #151515;
}

.v-enter-active,
.v-leave-active {
    transition: 500ms;
}

.v-enter-active .panelHeader {
    animation: panel-transition-in 500ms linear;
}

.v-leave-active .panelHeader {
    animation: panel-transition-out 500ms linear;
}

.v-enter-active .panelHeaderTransitionWipe,
.v-leave-active .panelHeaderTransitionWipe {
    animation: panel-wipe 500ms ease;
}

@media (prefers-reduced-motion) {
    .panelHeaderTransitionWipeContainer {
        display: none;
    }

    .v-enter-active,
    .v-leave-active {
        transition: 0ms;
    }

    .v-enter-active .panelHeader,
    .v-leave-active .panelHeader {
        animation-duration: 0ms;
    }
}
</style>