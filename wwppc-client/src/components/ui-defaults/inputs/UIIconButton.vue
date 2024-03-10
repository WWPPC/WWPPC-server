<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { glitchTextTransition } from '../TextTransitions';

const props = defineProps<{
    text: string
    img: string
    title?: string
    width?: string
    height?: string
    font?: string
    fontSize?: string
    color?: string
    backgroundColor?: string
    disabled?: boolean
    glitchOnMount?: boolean
}>();
const emit = defineEmits<{
    (e: 'click'): void
}>();
function click() {
    emit('click');
}

const buttonText = ref(props.glitchOnMount ? props.text.replace(/./g, ' ') : props.text);
if (props.glitchOnMount) {
    onMounted(() => {
        glitchTextTransition(buttonText.value, props.text, (text) => { buttonText.value = text; }, 40, 1, 15, 1);
    });
}
watch(() => props.text, () => buttonText.value = props.text);
</script>

<template>
    <label :class="'uiIconButtonLabel ' + (props.disabled ? 'uiIconButtonLabelDisabled' : '')">
        <input type="button" class="uiIconButton" @click=click :title=title :disabled=props.disabled>
        <img :src=props.img class="uiIconButtonImage">
        <span class="uiIconButtonText">{{ buttonText }}</span>
    </label>
</template>

<style>
.uiIconButtonLabel {
    display: flex;
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'min-content'");
    height: v-bind("$props.height ?? 'min-content'");
    border: 4px solid white;
    margin: 0px 4px;
    padding: 0.2em 0.2em;
    background-color: v-bind("$props.backgroundColor ?? 'black'");
    color: v-bind("$props.color ?? 'white'");
    font: v-bind("$props.font ?? 'inherit'");
    font-size: v-bind("$props.fontSize ?? '16px'");
    font-family: 'Source Code Pro', Courier, monospace;
    transition: 50ms ease background-position, 50ms ease background-color, 50ms ease transform, 50ms ease border-color;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
}

.uiIconButtonImage {
    height: 1.2em;
}

.uiIconButtonText {
    margin: 0px 0.2em;
    text-wrap: nowrap;
}

.uiIconButtonLabel:hover {
    transform: translateY(-2px);
    border-color: lime;
}

.uiIconButtonLabel:active {
    transform: translateY(2px);
    border-color: red;
}

.uiIconButton {
    display: none;
}

.uiIconButtonLabelDisabled {
    border-color: gray !important;
    transform: none !important;
    cursor: not-allowed;
}
</style>