<script setup lang="ts">
import { isMobileRef } from '@/scripts/userAgent';

defineProps<{
    width?: string
    height?: string
    borderColor?: string
    flipped?: boolean
    verticalFlipped?: boolean
    hoverAnimation?: 'lift' | 'swell'
    noPadding?: boolean
    noScroll?: boolean
}>();
</script>

<template>
    <div :class="'cutCornerContainerWrapper ' + ($props.flipped ? 'cutCornerContainerWrapperReversed ' : '') + ($props.verticalFlipped ? 'cutCornerContainerWrapperReversed2 ' : '') + (isMobileRef ? 'noHover' : '')">
        <div :class="'cutCornerContainer ' + ($props.noPadding ? 'noPadding ' : '') + ($props.flipped ? 'cutCornerContainerReversed ' : '') + ($props.verticalFlipped ? 'cutCornerContainerReversed2' : '')">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.cutCornerContainerWrapper {
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'initial'");
    height: v-bind("$props.height ?? 'initial'");
    padding: 4px 4px;
    clip-path: polygon(0% 0%, calc(100% - 32px) 0%, 100% 32px, 100% 100%, 0% 100%);
    background-color: v-bind("$props.borderColor ?? ' white'");
    text-align: left;
    transition: 200ms ease transform;
    will-change: transform;
    overflow: hidden;
}

.cutCornerContainer {
    contain: layout;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 12px 12px;
    clip-path: polygon(0% 0%, calc(100% - 30px) 0%, 100% 30px, 100% 100%, 0% 100%);
    background-color: black;
    overflow-x: hidden;
    overflow-y: v-bind("$props.noScroll ? 'hidden' : 'auto'");
}

/* spaghet */
.cutCornerContainerWrapperReversed {
    clip-path: polygon(32px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 32px);
}

.cutCornerContainerWrapperReversed2 {
    clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0% 100%);
}

.cutCornerContainerWrapperReversed.cutCornerContainerWrapperReversed2 {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 32px 100%, 0% calc(100% - 32px));
}

.cutCornerContainerReversed {
    clip-path: polygon(30px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 30px);
}

.cutCornerContainerReversed2 {
    clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0% 100%);
}

.cutCornerContainerReversed.cutCornerContainerReversed2 {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 30px 100%, 0% calc(100% - 30px));
}

.cutCornerContainerWrapper:hover {
    transform: v-bind("$props.hoverAnimation == 'lift' ? 'translateY(-8px)' : ($props.hoverAnimation == 'swell' ? 'scale(102%)' : '')");
}

.noPadding {
    padding: 0px 0px;
}

.noHover {
    transform: none !important;
}
</style>