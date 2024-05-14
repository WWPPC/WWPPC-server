<script setup lang="ts">
import NotFound from '@/pages/NotFound.vue';
</script>

<template>
    <main class="panelViewBody">
        <NotFound></NotFound>
        <slot></slot>
    </main>
</template>

<style scoped>
.panelViewBody {
    contain: size layout;
    display: grid;
    position: relative;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    grid-row: 2;
    grid-column: 1;
    background-color: black;
}
</style>