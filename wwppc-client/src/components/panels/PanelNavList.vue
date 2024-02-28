<script setup lang="ts"></script>

<template>
    <div class="panelNavOuter">
        <nav class="panelNav">
            <slot></slot>
        </nav>
    </div>
</template>

<style>
.panelNavOuter {
    position: relative;
    display: flex;
    flex-grow: 1;
    overflow-y: hidden;
}

.panelNav {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    padding: 0px 16px;
    overflow-x: scroll;
}

.panelNav::-webkit-scrollbar {
    height: 0px;
}

.panelNavOuter::after {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: calc(100% + 64px);
    margin: 0px 0px;
    padding: 0px 0px;
    box-shadow: 0px -32px 12px 4px #222 inset;
    pointer-events: none;
}
</style>