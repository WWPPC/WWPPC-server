<script setup lang="ts">
const props = defineProps<{
    text: string
    fontSize?: string
    color?: string
    glow?: boolean
    shadow?: boolean
}>();
</script>

<template>
    <div class="glowText">
        {{ props.text }}
    </div>
</template>

<style>
.glowText {
    font-weight: bold;
    font-family: 'Source Code Pro', Courier, monospace;
    font-size: v-bind("$props.fontSize");
    text-wrap: nowrap;
    color: v-bind("$props.color ?? 'white'");
    text-shadow: -0.05em 0.05em 0px color-mix(in srgb, currentColor v-bind("$props.shadow ? '40%' : '0%'"), transparent v-bind("$props.shadow ? '60%' : '100%'")),
        0px 0px max(2px, 0.03em) v-bind("$props.glow ? 'currentColor' : 'transparent'");
}
</style>