<script setup lang="ts"></script>

<template>
    <nav class="panelHeaderRight">
        <slot></slot>
    </nav>
</template>

<style>
.panelHeaderRight {
    display: flex;
    flex-direction: row;
}
</style>