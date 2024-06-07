<script setup lang="ts">
import DoubleCutCornerContainer from './DoubleCutCornerContainer.vue';

defineProps<{
    title: string
    width?: string
    height?: string
    borderColor?: string
    align?: 'left' | 'center' | 'right'
    fontSize?: string
    hoverAnimation?: 'lift' | 'swell'
    noPadding?: boolean
    noScroll?: boolean
}>();
</script>

<template>
    <DoubleCutCornerContainer class="doubleCutCornerContainerNoPadding" :width=$props.width :height=$props.height :border-color=$props.borderColor :hover-animation=$props.hoverAnimation no-padding>
        <div class="titledDoubleCutCornerContainerTitle">
            <h2>{{ $props.title }}</h2>
        </div>
        <div :class="'titledDoubleCutCornerContainerBody ' + ($props.noPadding ? 'noPadding' : '')">
            <slot></slot>
        </div>
        <div class="titledDoubleCutCornerContainerFade"></div>
    </DoubleCutCornerContainer>
</template>

<style>
.doubleCutCornerContainerNoPadding>.doubleCutCornerContainer {
    display: grid;
    grid-template-rows: min-content 1fr;
    overflow: hidden;
}
</style>

<style scoped>
.titledDoubleCutCornerContainerTitle {
    contain: layout;
    grid-row: 1;
    grid-column: 1;
    box-sizing: border-box;
    width: 100%;
    padding: 8px 12px;
    border-bottom: 4px solid;
    border-color: v-bind("$props.borderColor ?? 'white'");
    background-color: #222;
    text-align: v-bind("$props.align ?? 'left'");
    font-size: v-bind("$props.fontSize ?? 'initial'");
}

.titledDoubleCutCornerContainerTitle>h2 {
    margin: 0px 0px;
    white-space-collapse: pre-wrap;
}

.titledDoubleCutCornerContainerBody {
    contain: layout;
    position: relative;
    grid-row: 2;
    grid-column: 1;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 12px 12px;
    overflow-x: hidden;
    overflow-y: auto;
}

.titledDoubleCutCornerContainerFade {
    content: ' ';
    grid-row: 2;
    grid-column: 1;
    position: relative;
    left: -12px;
    width: calc(100% + 24px);
    height: 100%;
    box-shadow: 0px 0px 12px black inset;
    clip-path: xywh(0 0 calc(100% - 28px) 100%);
    pointer-events: none;
}

.noPadding {
    padding: 0px 0px;
}
</style>