<script setup lang="ts"></script>

<template>
    <header class="panelHeader">
        <slot></slot>
        <div class="panelHeaderTransitionWipeContainer">
            <div class="panelHeaderTransitionWipe"></div>
        </div>
    </header>
</template>

<style>
.panelHeader {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 96px;
    background-color: #222;
    border-bottom: 4px solid white;
}

.panelHeaderTransitionWipeContainer {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
}

.panelHeaderTransitionWipe {
    position: absolute;
    top: 0px;
    left: -100%;
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
    animation: panel-wipe-horizontal 500ms ease;
}
</style>