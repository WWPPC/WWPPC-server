<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { glitchTextTransition } from '../TextTransitions';

const props = defineProps<{
    text: string
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
    <label :class="'uiLinkButtonLabel ' + (props.disabled ? 'uiLinkButtonLabelDisabled' : '')">
        <input type="button" class="uiLinkButton" @click=click :title=title :disabled=props.disabled>
        <span class="uiLinkButtonText">{{ buttonText }}</span>
        <div class="uiLinkButtonArrow"></div>
    </label>
</template>

<style scoped>
.uiLinkButtonLabel {
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

.uiLinkButtonText {
    margin: 0px 0.2em;
    text-wrap: nowrap;
    white-space: nowrap;
    font-size: v-bind("$props.fontSize ?? 'var(--font-16)'");
}

.uiLinkButtonLabel:hover {
    transform: translateY(-2px);
    border-color: lime;
}

.uiLinkButtonLabel:active {
    transform: translateY(2px);
    border-color: red;
}

.uiLinkButton {
    display: none;
}

.uiLinkButtonArrow {
    width: 2em;
    height: 1em;
    background-position: left;
    background-repeat: repeat-x;
    background-size: 50% 100%;
    background-image: url(/assets/arrow-right.svg);
    transition: 200ms ease background-position;
}

.uiLinkButtonLabel:hover .uiLinkButtonArrow {
    background-position: right;
}

.uiLinkButtonLabel:active .uiLinkButtonArrow {
    transition: 500ms ease background-position;
    background-position: 500% 0%;
}

.uiLinkButtonLabelDisabled {
    border-color: #888 !important;
    transform: none !important;
    opacity: 1;
    cursor: not-allowed;
}

.uiLinkButtonLabelDisabled .uiLinkButtonArrow {
    background-position: left !important;
}
</style>