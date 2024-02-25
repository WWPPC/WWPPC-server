<script setup lang="ts"></script>

<template>
    <header class="panelViewHeader">
        <slot></slot>
    </header>
</template>

<style>
.panelViewHeader {
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
</style>