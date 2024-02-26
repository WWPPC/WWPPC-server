<script setup lang="ts"></script>

<template>
    <nav class="panelRightList">
        <slot></slot>
    </nav>
</template>

<style>
.panelRightList {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    align-self: flex-start;
}
</style>