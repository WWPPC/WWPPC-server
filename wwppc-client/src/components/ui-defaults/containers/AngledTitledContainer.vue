<script setup lang="ts">
import { isMobileRef } from '@/scripts/userAgent';

defineProps<{
    title: string
    width?: string
    height?: string
    borderColor?: string
    align?: 'left' | 'center' | 'right'
    fontSize?: string
    hoverAnimation?: 'lift' | 'swell'
    noPadding?: boolean
}>();
</script>

<template>
    <div :class="'titledAngleContainer ' + ($props.noPadding ? 'noPadding ' : '') + (isMobileRef ? 'noHover' : '')">
        <div class="titledAngleContainerBody">
            <slot></slot>
        </div>
        <div class="titledAngleContainerFade"></div>
        <div class="titledAngleContainerHeader"></div>
        <div class="titledAngleContainerTitle">
            <h2>{{ $props.title }}</h2>
        </div>
    </div>
</template>

<style scoped>
.titledAngleContainer {
    position: relative;
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'initial'");
    height: v-bind("$props.height ?? 'initial'");
    border: 4px solid;
    border-color: v-bind("$props.borderColor ?? ' white'");
    background-color: black;
    text-align: left;
    transition: 200ms ease transform;
    will-change: transform;
    overflow: hidden;
}

.titledAngleContainerTitle {
    position: absolute;
    top: 0px;
    padding: 8px 12px;
    text-align: v-bind("$props.align ?? 'left'");
    font-size: v-bind("$props.fontSize ?? 'initial'");
}

.titledAngleContainerTitle>h2 {
    white-space: pre-wrap;
}

.titledAngleContainerHeader {
    display: block;
    position: absolute;
    top: 0px;
    left: calc(-50% - 4px);
    width: calc(100% / cos(3deg) + 2px);
    height: 80px;
    border-bottom: 4px solid;
    border-color: v-bind("$props.borderColor ?? 'white'");
    transform: rotate(-3deg) translateX(50%);
    background-color: #222;
}

.titledAngleContainerBody {
    contain: layout;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 12px 12px;
    padding-top: 88px;
    overflow-x: hidden;
    overflow-y: auto;
}

.noPadding>.titledAngleContainerBody {
    padding: 0px 0px;
    padding-top: 64px;
}

.titledAngleContainerFade {
    content: ' ';
    position: absolute;
    bottom: 0px;
    left: -24px;
    left: -12px;
    width: calc(100% + 24px);
    height: 100%;
    box-shadow: 0px 0px 12px black inset;
    clip-path: xywh(0 0 calc(100% - 12px) 100%);
    pointer-events: none;
}

.titledAngleContainer:hover {
    transform: v-bind("$props.hoverAnimation == 'lift' ? 'translateY(-8px)' : ($props.hoverAnimation == 'swell' ? 'scale(102%)' : '')");
}

.noHover {
    transform: none !important;
}
</style>