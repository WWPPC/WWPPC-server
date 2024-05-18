<script setup lang="ts">
const props = defineProps<{
    text: string
    fontSize?: string
    color?: string
    glow?: boolean
    shadow?: boolean
    flashing?: boolean
    flashColor?: string
}>();
</script>

<template>
    <div :class="'glowText ' + (props.flashing ? (props.flashColor != undefined ? 'glowTextFlashingColor' : 'glowTextFlashing') : '')">
        {{ props.text }}
    </div>
</template>

<style scoped>
.glowText {
    font-weight: bold;
    font-family: 'Source Code Pro', Courier, monospace;
    font-size: v-bind("$props.fontSize");
    text-wrap: nowrap;
    color: v-bind("$props.color ?? 'white'");
    text-shadow: -0.05em 0.05em 0px color-mix(in srgb, currentColor v-bind("$props.shadow ? '40%' : '0%'"), transparent v-bind("$props.shadow ? '60%' : '100%'")),
        0px 0px max(2px, 0.03em) v-bind("$props.glow ? 'currentColor' : 'transparent'");
}

.glowTextFlashing {
    animation: 500ms linear glow-text-flashing alternate infinite;
}

.glowTextFlashingColor {
    animation: 500ms linear glow-text-flashing-color alternate infinite;
}

@keyframes glow-text-flashing {

    0%,
    49% {
        filter: brightness(0.8);
    }

    50%,
    100% {
        filter: brightness(1);
    }
}

@keyframes glow-text-flashing-color {

    0%,
    49% {
        color: v-bind("$props.color ?? 'white'");
    }

    50%,
    100% {
        color: v-bind("$props.flashColor");
    }
}
</style>