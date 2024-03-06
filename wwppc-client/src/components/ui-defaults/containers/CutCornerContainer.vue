<script setup lang="ts">
defineProps<{
    width?: string
    height?: string
    borderColor?: string
}>();
</script>

<template>
    <div class="cutCornerContainerWrapper">
        <div class="cutCornerContainer">
            <slot></slot>
        </div>
    </div>
</template>

<style>
.cutCornerContainerWrapper {
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'initial'");
    height: v-bind("$props.height ?? 'initial'");
    padding: 4px 4px;
    clip-path: polygon(0% 0%, calc(100% - 32px) 0%, 100% 32px, 100% 100%, 0% 100%);
    background-color: v-bind("$props.borderColor ?? ' white'");
    text-align: left;
    overflow: hidden;
}

.cutCornerContainer {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 12px 12px;
    clip-path: polygon(0% 0%, calc(100% - 30px) 0%, 100% 30px, 100% 100%, 0% 100%);
    background-color: black;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>