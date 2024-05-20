<script setup lang="ts">
import { isMobileRef } from '@/scripts/userAgent';

defineProps<{
    width?: string
    height?: string
    borderColor?: string
    flipped?: boolean
    hoverAnimation?: 'lift' | 'swell'
    noPadding?: boolean
    noScroll?: boolean
}>();
</script>

<template>
    <div :class="'doubleCutCornerContainerWrapper ' + ($props.flipped ? 'doubleCutCornerContainerWrapperReversed ' : '') + (isMobileRef ? 'noHover' : '')">
        <div :class="'doubleCutCornerContainer ' + ($props.noPadding ? 'noPadding ' : '') + ($props.flipped ? 'doubleCutCornerContainerReversed' : '')">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.doubleCutCornerContainerWrapper {
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'initial'");
    height: v-bind("$props.height ?? 'initial'");
    padding: 4px 4px;
    clip-path: polygon(32px 0%, 100% 0%, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0% 100%, 0% 32px);
    background-color: v-bind("$props.borderColor ?? ' white'");
    text-align: left;
    transition: 200ms ease transform;
    will-change: transform;
    overflow: hidden;
}

.doubleCutCornerContainer {
    contain: layout;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 12px 12px;
    clip-path: polygon(30px 0%, 100% 0%, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0% 100%, 0% 30px);
    background-color: black;
    overflow-x: hidden;
    overflow-y: v-bind("$props.noScroll ? 'hidden' : 'auto'");
}

.doubleCutCornerContainerWrapperReversed {
    clip-path: polygon(100% 32px, calc(100% - 32px) 0, 0 0, 0 calc(100% - 32px), 32px 100%, 100% 100%);
}

.doubleCutCornerContainerReversed {
    clip-path: polygon(100% 30px, calc(100% - 30px) 0, 0 0, 0 calc(100% - 30px), 30px 100%, 100% 100%);
}

.doubleCutCornerContainerWrapper:hover,
.doubleCutCornerContainerWrapperReverse:hover {
    transform: v-bind("$props.hoverAnimation == 'lift' ? 'translateY(-8px)' : ($props.hoverAnimation == 'swell' ? 'scale(102%)' : '')");
}

.noPadding {
    padding: 0px 0px;
}

.noHover {
    transform: none !important;
}
</style>