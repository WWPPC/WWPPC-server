<script setup lang="ts">
import { BaseContainer } from '@/components/ui-defaults/UIContainers';

const props = defineProps<{
    title: string
    width?: string
    height?: string
    borderStyle?: string
}>();
</script>

<template>
    <BaseContainer class="titledAngleContainer" :width="props.width ?? null" :height="props.height ?? null" :borderStyle="props.borderStyle ?? null">
        <div class="titledAngleContainerBody">
            <slot></slot>
        </div>
        <div class="titledAngleContainerHeader"></div>
        <div class="titledAngleContainerTitle">
            <h2>{{ props.title }}</h2>
        </div>
    </BaseContainer>
</template>

<style>
.titledAngleContainer {
    position: relative;
    box-sizing: border-box;
    background-color: black;
    text-align: left;
    overflow: hidden;
}

.titledAngleContainerTitle {
    position: absolute;
    top: 0px;
    margin-top: 8px;
    margin-left: 12px;
}

.titledAngleContainerHeader {
    content: ' ';
    display: block;
    position: absolute;
    top: 0px;
    left: calc(-50% - 4px);
    width: calc(100% / cos(3deg) + 2px);
    height: 72px;
    border-bottom: v-bind("props.borderStyle ?? '4px solid white'"); /* bad hardcoding */
    transform: rotate(-3deg) translateX(50%);
    background-color: #222;
}

.titledAngleContainerBody {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 12px 12px;
    padding-top: 76px;
    overflow-y: auto;
}

.titledAngleContainerBody::after {
    content: ' ';
    position: absolute;
    bottom: 0px;
    left: -24px;
    width: calc(100% + 48px);
    height: 100%;
    box-shadow: 0px 0px 18px 6px black inset;
    clip-path: xywh(0 0 calc(100% - 40px) 100%);
    pointer-events: none;
}
</style>