<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    title: string
    width?: string
    height?: string
    borderColor?: string
    align?: 'left' | 'center' | 'right'
    startCollapsed?: boolean
    hoverAnimation?: 'lift' | 'swell'
}>();

const show = ref(props.startCollapsed == false);
</script>

<template>
    <div class="headeredCollapsibleContainer">
        <label class="headeredCollapsibleContainerHeader">
            <h2 class="headeredCollapsibleContainerTitle">{{ props.title }}</h2>
            <div class="headeredCollapsibleContainerImage"></div>
            <input type="checkbox" v-model=show style="display: none">
        </label>
        <div class="headeredCollapsibleContainerBodyWrapper">
            <div class="headeredCollapsibleContainerBody">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style>
.headeredCollapsibleContainer {
    position: relative;
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'initial'");
    border: 4px solid;
    border-color: v-bind("$props.borderColor ?? ' white'");
    background-color: black;
    text-align: left;
    overflow: hidden;
}

.headeredCollapsibleContainerHeader {
    display: flex;
    flex-direction: row;
    padding: 8px 12px;
    border-bottom: 4px solid;
    border-color: v-bind("$props.borderColor ?? 'white'");
    background-color: #222;
    align-items: center;
    cursor: pointer;
}

.headeredCollapsibleContainerTitle {
    margin: auto;
    text-align: v-bind("$props.align ?? 'left'");
    text-wrap: wrap;
    flex-grow: 1;
}

.headeredCollapsibleContainerImage {
    width: 1em;
    height: 1em;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: v-bind("show ? 'url(/assets/arrow-up.svg)' : 'url(/assets/arrow-down.svg)'");
    transition: 200ms ease transform;
}

.headeredCollapsibleContainerHeader:hover>.headeredCollapsibleContainerImage {
    transform: scale(110%);
}

.headeredCollapsibleContainerBodyWrapper {
    width: 100%;
    min-height: 0px;
    /* min-height: v-bind("show ? ($props.height ?? '100%') : '0px'"); */
    max-height: v-bind("show ? ($props.height ?? '100%') : '0px'");
    margin-top: -4px;
    transition: 500ms ease max-height;
    overflow: clip;
}

.headeredCollapsibleContainerBody {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 12px 12px;
    overflow-x: hidden;
    overflow-y: auto;
}

.headeredCollapsibleContainer:hover {
    transform: v-bind("$props.hoverAnimation == 'lift' ? 'translateY(-8px)' : ($props.hoverAnimation == 'swell' ? 'scale(102%)' : '')");
}
</style>