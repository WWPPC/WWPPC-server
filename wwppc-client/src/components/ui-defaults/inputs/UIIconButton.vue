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
    imgColor?: string
    imgHoverColor?: string
    disabled?: boolean
    glitchOnMount?: boolean
}>();
const emit = defineEmits<{
    (e: 'click'): any
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
        <div class="uiIconButtonImage"></div>
        <span class="uiIconButtonText">{{ buttonText }}</span>
    </label>
</template>

<style scoped>
.uiIconButtonLabel {
    display: flex;
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'min-content'");
    height: v-bind("$props.height ?? 'min-content'");
    border: 4px solid white;
    margin: 0px 4px;
    padding: 0.125em 0.2em;
    background-color: v-bind("$props.backgroundColor ?? 'black'");
    color: v-bind("$props.color ?? 'white'");
    font: v-bind("$props.font ?? 'inherit'");
    font-size: v-bind("$props.fontSize ?? 'var(--font-16)'");
    font-family: 'Source Code Pro', Courier, monospace;
    transition: 50ms ease background-position, 50ms ease background-color, 50ms ease transform, 50ms ease border-color;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
}

.uiIconButtonImage {
    width: 1.2em;
    height: 1.2em;
    margin-left: 0.2em;
    mask-size: 1.2em;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-image: v-bind("`url('${$props.img}')`");
    background-color: v-bind("$props.imgColor ?? 'white'");
    transition: 50ms linear background-color;
}

.uiIconButtonText {
    margin: 0px 0.2em;
    text-wrap: nowrap;
    white-space: nowrap;
    font-size: v-bind("$props.fontSize ?? 'var(--font-16)'");
}

.uiIconButtonLabel:hover {
    transform: translateY(-2px);
    border-color: lime;
}

.uiIconButtonLabel:active {
    transform: translateY(2px);
    border-color: red;
}

.uiIconButtonLabel:hover>.uiIconButtonImage {
    background-color: v-bind("$props.imgHoverColor ?? $props.imgColor ?? 'white'");
}

.uiIconButton {
    display: none;
}

.uiIconButtonLabelDisabled {
    border-color: #888 !important;
    transform: none !important;
    opacity: 1;
    cursor: not-allowed;
}
</style>