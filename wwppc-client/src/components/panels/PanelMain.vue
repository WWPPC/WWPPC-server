<script lang="ts" setup>
</script>

<template>
    <main class="panelViewBody">
        <slot></slot>
    </main>
</template>

<style>
.panelViewBody {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100vw;
    height: calc(100vh - 100px);
}
</style>