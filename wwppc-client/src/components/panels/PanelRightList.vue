<script setup lang="ts"></script>

<template>
    <nav class="panelHeaderRight">
        <slot></slot>
    </nav>
</template>

<style scoped>
.panelHeaderRight {
    display: flex;
    flex-direction: row;
}
</style>