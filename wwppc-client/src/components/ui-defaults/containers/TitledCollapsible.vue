<script setup lang="ts">
import { nextTick, onBeforeUpdate, ref } from 'vue';

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
const body = ref<HTMLDivElement>();
const boxHeight = ref(0);

onBeforeUpdate(async () => {
    await nextTick();
    boxHeight.value = body.value?.getBoundingClientRect().height ?? 0;
});

defineExpose({
    show
});
</script>

<template>
    <div class="headeredCollapsibleContainer">
        <label class="headeredCollapsibleContainerHeader">
            <h2 class="headeredCollapsibleContainerTitle">{{ props.title }}</h2>
            <div class="headeredCollapsibleContainerImage"></div>
            <input type="checkbox" v-model=show style="display: none">
        </label>
        <div class="headeredCollapsibleContainerBodyWrapper">
            <div class="headeredCollapsibleContainerBody" ref="body">
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
    margin-bottom: -4px;
    border-bottom: 4px solid;
    border-color: v-bind("$props.borderColor ?? 'white'");
    background-color: #222;
    align-items: center;
    cursor: pointer;
}

.headeredCollapsibleContainerTitle {
    margin: 0px 0px;
    text-align: v-bind("$props.align ?? 'left'");
    text-wrap: wrap;
    flex-grow: 1;
}

.headeredCollapsibleContainerImage {
    width: 1em;
    height: 1em;
    flex-shrink: 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: v-bind("show ? 'url(/assets/arrow-up.svg)' : 'url(/assets/arrow-down.svg)'");
}

.headeredCollapsibleContainerBodyWrapper {
    display: relative;
    width: 100%;
    max-height: v-bind("show ? (boxHeight + 'px') : '0px'");
    height: v-bind("boxHeight + 'px'");
    transition: v-bind("Math.round(Math.sqrt(boxHeight * 200)) + 'ms'") ease max-height;
    overflow: clip;
}

.headeredCollapsibleContainerBody {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    padding: 12px 12px;
    overflow-x: hidden;
    overflow-y: auto;
}

.headeredCollapsibleContainer:hover {
    transform: v-bind("$props.hoverAnimation == 'lift' ? 'translateY(-8px)' : ($props.hoverAnimation == 'swell' ? 'scale(102%)' : '')");
}
</style>