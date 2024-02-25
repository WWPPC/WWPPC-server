<script setup lang="ts"></script>

<template>
    <nav class="panelViewNav">
        <slot></slot>
    </nav>
</template>

<style>
.panelViewNav {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
}
</style>