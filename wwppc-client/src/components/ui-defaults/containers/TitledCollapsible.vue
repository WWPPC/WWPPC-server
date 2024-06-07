<script setup lang="ts">
import { isMobileRef } from '@/scripts/userAgent';
import { nextTick, onBeforeUpdate, onMounted, ref, watch } from 'vue';

const props = defineProps<{
    title: string
    width?: string
    height?: string
    borderColor?: string
    align?: 'left' | 'center' | 'right'
    fontSize?: string
    startCollapsed?: boolean
    hoverAnimation?: 'lift' | 'swell'
    noPadding?: boolean
}>();

const show = ref(props.startCollapsed == false);
const body = ref<HTMLDivElement>();
const boxHeight = ref(0);

onBeforeUpdate(async () => {
    await nextTick();
    boxHeight.value = body.value?.getBoundingClientRect().height ?? 0;
});
onMounted(async () => {
    await nextTick();
    boxHeight.value = body.value?.getBoundingClientRect().height ?? 0;
});
window.addEventListener('resize', () => {
    boxHeight.value = body.value?.getBoundingClientRect().height ?? 0;
});

const emit = defineEmits<{
    (e: 'open'): any
    (e: 'close'): any
    (e: 'click'): any
}>();
watch(show, () => {
    emit('click');
    if (show.value) emit('open');
    else emit('close');
});
defineExpose({
    show
});
</script>

<template>
    <div :class="'headeredCollapsibleContainer ' + ($props.noPadding ? 'noPadding ' : '') + (isMobileRef ? 'noHover' : '')">
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

<style scoped>
.headeredCollapsibleContainer {
    position: relative;
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'initial'");
    border: 4px solid;
    border-color: v-bind("$props.borderColor ?? ' white'");
    background-color: black;
    text-align: left;
    will-change: transform;
    overflow: hidden;
}

.headeredCollapsibleContainerHeader {
    contain: layout;
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
    font-size: v-bind("$props.fontSize ?? 'var(--font-large)'"); /* idk why */
    flex-grow: 1;
    white-space: pre-wrap;
}

.headeredCollapsibleContainerImage {
    width: 1em;
    height: 1em;
    flex-shrink: 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url(/assets/arrow-down.svg);
    transition: 200ms ease transform;
    transform: v-bind("show ? 'scaleY(-1)' : 'scaleY(1)'");
}

.headeredCollapsibleContainerBodyWrapper {
    width: 100%;
    max-height: v-bind("show ? ($props.height ?? (boxHeight + 'px')) : '0px'");
    height: v-bind("$props.height ?? (boxHeight + 'px')");
    transition: v-bind("Math.round(Math.sqrt(boxHeight * 200)) + 'ms'") ease max-height;
    will-change: max-height;
    overflow: hidden;
}

.headeredCollapsibleContainerBody {
    contain: layout;
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

.noPadding>.headeredCollapsibleContainerBodyWrapper>.headeredCollapsibleContainerBody {
    padding: 0px 0px;
}

.noHover {
    transform: none !important;
}
</style>