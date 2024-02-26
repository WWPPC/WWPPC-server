<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { glitchTextTransition, type AsyncTextTransition } from '../ui-defaults/TextTransitions';
import { useRouter } from 'vue-router';
const props = defineProps<{
    text: string
    title?: string
    for: string
    link?: boolean
}>();
const emit = defineEmits<{
    (e: 'click'): void
}>();
const router = useRouter();

function click() {
    emit('click');
    if (props.link) self.location.replace(props.for);
    else router.push(props.for)
}
const selected = ref(false);
// animations for hover
const buttonText = ref(props.text)
let blockingAnimation: AsyncTextTransition | null = null;
let currentAnimation: AsyncTextTransition | null = null;
function mouseover() {
    if (blockingAnimation?.finished == false) return;
    currentAnimation?.cancel();
    currentAnimation = glitchTextTransition(props.text, props.text, (text) => { buttonText.value = text; }, 40, 2, 5, 1);
}
onMounted(() => {
    blockingAnimation = glitchTextTransition(buttonText.value, props.text, (text) => { buttonText.value = text; }, 40, 2, 15, 2);
});
buttonText.value = props.text.replace(/./g, ' ');
</script>

<template>
    <input type="button" :class="selected ? 'panelNavButton panelNavButtonSelected' : 'panelNavButton'" :value=buttonText @click=click @mouseover=mouseover :title=title>
</template>

<style>
.panelNavButton {
    appearance: none;
    min-width: 128px;
    border: none;
    transition: 100ms cubic-bezier(0.6, 1, 0.5, 1.6) background-color;
    font-size: 18px;
    color: white;
    background-color: transparent;
    font-family: 'Source Code Pro', Courier, monospace;
    cursor: pointer;
}

.panelNavButtonSelected {
    background-color: black;
    font-weight: bold;
}

.panelNavButton:hover {
    background-color: #444;
    font-weight: bold;
}
</style>