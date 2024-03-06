<script setup lang="ts">
import CutCornerContainer from './CutCornerContainer.vue';

defineProps<{
    title: string
    width?: string
    height?: string
    borderColor?: string
}>();
</script>

<template>
    <CutCornerContainer :width=$props.width :height=$props.height :border-color=$props.borderColor>
        <div class="titledCutCornerContainerTitle">
            <h2>{{ $props.title }}</h2>
        </div>
        <div class="titledCutCornerContainerBody">
            <slot></slot>
        </div>
        <div class="titledCutCornerContainerFade"></div>
    </CutCornerContainer>
</template>

<style>
.titledCutCornerContainerTitle {
    position: absolute;
    top: 0px;
    left: 0px;
    box-sizing: border-box;
    width: 100%;
    padding-top: 8px;
    padding-left: 12px;
    padding-bottom: 4px;
    border-bottom: 4px solid;
    border-color: v-bind("$props.borderColor ?? 'white'");
    background-color: #222;
}

.titledCutCornerContainerBody {
    position: absolute;
    top: 0px;
    left: 0px;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 64px);
    margin-top: 64px;
    padding: 12px 12px;
    overflow-x: hidden;
    overflow-y: auto;
}

.titledCutCornerContainerFade {
    content: ' ';
    position: absolute;
    bottom: 0px;
    left: -24px;
    width: calc(100% + 48px);
    height: calc(100% - 64px);
    box-shadow: 0px 0px 18px 6px black inset;
    clip-path: xywh(0 0 calc(100% - 40px) 100%);
    pointer-events: none;
}
</style>