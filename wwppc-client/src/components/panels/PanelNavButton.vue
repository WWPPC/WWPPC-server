<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { glitchTextTransition, type AsyncTextTransition } from '@/components/ui-defaults/TextTransitions';
import { useRouter } from 'vue-router';
import { isMobileRef } from '@/scripts/userAgent';

const props = defineProps<{
    text: string
    title?: string
    for: string
    link?: boolean
    isDefault?: boolean
}>();
const emit = defineEmits<{
    (e: 'click'): void
}>();
const router = useRouter();

function click() {
    emit('click');
    if (props.link) window.location.replace(props.for);
    else router.push(props.for);
}

// animations for hover
const buttonText = ref(props.text.replace(/./g, ' '));
let blockingAnimation: AsyncTextTransition | null = null;
let currentAnimation: AsyncTextTransition | null = null;
function mouseover() {
    if (blockingAnimation?.finished == false) return;
    currentAnimation?.cancel();
    currentAnimation = glitchTextTransition(props.text, props.text, (text) => { buttonText.value = text; }, 40, 2, 5, 1);
}
onMounted(() => {
    blockingAnimation = glitchTextTransition(buttonText.value, props.text, (text) => { buttonText.value = text; }, 40, 1, 15, 1);
});
</script>

<template>
    <input type="button" :class="'panelNavButton ' + (((props.isDefault && $route.params.panel == undefined) || props.for == `/${$route.params.page}/${$route.params.panel}`) ? 'panelNavButtonSelected ' : '') + (isMobileRef ? 'panelNavButtonNoHover' : '')" :value=buttonText @click=click @mouseover=mouseover :title=title>
</template>

<style scoped>
.panelNavButton {
    appearance: none;
    min-width: 128px;
    border: none;
    border-radius: 0px;
    font-size: 18px;
    color: white;
    background-color: transparent;
    font-family: 'Source Code Pro', Courier, monospace;
    transition: 100ms cubic-bezier(0.6, 1, 0.5, 1.6) background-color;
    cursor: pointer;
}

.panelNavButtonSelected {
    background-color: #1A1A1A;
    font-weight: bold;
}

.panelNavButton:hover {
    background-color: #444;
    font-weight: bold;
}

.panelNavButtonNoHover:hover {
    background-color: transparent !important;
    font-weight: normal !important;
}

.panelNavButtonSelected.panelNavButtonNoHover:hover {
    background-color: #1A1A1A !important;
    font-weight: bold !important;
}
</style>