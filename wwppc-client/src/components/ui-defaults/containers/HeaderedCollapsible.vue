<script setup lang="ts">
import { UIImage } from "@/components/ui-defaults/UIDefaults";
import { ref } from 'vue';
defineProps<{
    title: string
    width?: string
    height?: string
    borderColor?: string
    // initial?: boolean //default collapsed or shown  probably should implement this 
    hoverAnimation?: 'lift' | 'swell'
}>();
</script>

<script lang="ts">
const toShow = ref(false);
</script>

<template>
    <div class="headeredCollapsibleContainer">
        <div class="headeredCollapsibleContainerHeader" @click="toShow = !toShow">
            <h2 class="headeredCollapsibleContainerTitle">{{ $props.title }}</h2>
            <UIImage src="/assets/arrow-down.svg" width="40px" v-show="!toShow"></UIImage>
            <UIImage src="/assets/arrow-up.svg" width="40px" v-show="toShow"></UIImage>
        </div>
        <div class="headeredCollapsibleContainerBody" v-show="toShow">
            <slot></slot>
        </div>
    </div>
</template>

<style>
.headeredCollapsibleContainer {
    position: relative;
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'initial'");
    height: v-bind("$props.height ?? 'initial'");
    border: 4px solid;
    border-color: v-bind("$props.borderColor ?? ' white'");
    background-color: black;
    text-align: left;
    overflow: hidden;
}

.headeredCollapsibleContainerHeader {
    content: ' ';
    display: flex;
    height: min-content;
    padding: 10px 12px;
    border-bottom: v-bind("toShow ? '4px solid' : 'none'");
    border-color: v-bind("$props.borderColor ?? 'white'");
    background-color: #222;
}

.headeredCollapsibleContainerTitle {
    margin: auto;
    text-align: center;
    text-wrap: wrap;
}

.headeredCollapsibleContainerBody {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 12px 12px;
    overflow-x: hidden;
    overflow-y: auto;
    transition: 500ms;
}

.headeredCollapsibleContainer:hover {
    transform: v-bind("$props.hoverAnimation == 'lift' ? 'translateY(-8px)' : ($props.hoverAnimation == 'swell' ? 'scale(102%)' : '')");
}
</style>