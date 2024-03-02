<script setup lang="ts">
const props = defineProps<{
    text: string
    title?: string
    width?: string
    height?: string
    font?: string
    color?: string
    backgroundColor?: string
    disabled?: boolean
}>();
const emit = defineEmits<{
    (e: 'click'): void
}>();
function click() {
    emit('click');
}
</script>

<template>
    <label class="uiLinkButtonLabel" :disabled=props.disabled>
        <input type="button" class="uiLinkButton" @click=click :title=title>
        {{ props.text }}
        <div class="uiLinkButtonArrow"></div>
    </label>
</template>

<style>
.uiLinkButtonLabel {
    display: flex;
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'unset'");
    height: v-bind("$props.height ?? '32px'");
    border: 4px solid white;
    margin: 0px 4px;
    padding: 0px 4px;
    background-color: v-bind("$props.backgroundColor ?? 'black'");
    color: v-bind("$props.color ?? 'white'");
    font: v-bind("$props.font ?? 'inherit'");
    font-family: 'Source Code Pro', Courier, monospace;
    transition: 50ms ease background-position, 50ms ease background-color, 50ms ease transform, 50ms ease border-color;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.uiLinkButtonLabel:hover {
    transform: translateY(-2px);
    border-color: lime;
}

.uiLinkButtonLabel:active {
    transform: translateY(2px);
    border-color: red;
}

.uiLinkButtonLabel:disabled {
    background-color: gray !important;
    transform: none !important;
    cursor: not-allowed;
}

.uiLinkButton {
    display: none;
}

.uiLinkButtonArrow {
    margin-left: 0.2em;
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
</style>