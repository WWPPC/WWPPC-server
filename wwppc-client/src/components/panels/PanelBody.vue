<script setup lang="ts"></script>

<template>
    <div class="pagePanel">
        <slot></slot>
    </div>
</template>

<style>
.pagePanel {
    position: absolute;
    bottom: 0px;
    left: 0px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 16px 16px;
    background-color: black;
}
</style>