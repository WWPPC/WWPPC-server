<script setup lang="ts">
import { reactive, ref } from 'vue';
import UIButton from './UIButton.vue';
import { glitchTextTransition } from './TextTransitions';
import { UITextBox } from './UIDefaults';
</script>
<script lang="ts">
enum ModalMode {
    NOTIFY = 0,
    CONFIRM = 1,
    QUERY = 2
}
const modal = reactive({
    title: '',
    content: '',
    mode: ModalMode.NOTIFY,
    color: 'white',
    open: false
});
let resolve = () => {};
let reject = () => {};
export async function showModal({ title, content, mode = ModalMode.NOTIFY, color = 'white', glitchTitle = false }: { title: string, content: string, mode?: ModalMode, color?: string, glitchTitle?: boolean }) {
    if (glitchTitle) glitchTextTransition(title, title, ref(modal.title), 40, 2, 10, 1, true);
    else modal.title = title;
    modal.content = content;
    modal.mode = mode;
    modal.color = color;
    modal.open = true;
}
</script>

<template>
    <div id="modalContainer" v-bind:style="(modal.open) ? 'opacity: 1; pointer-events: all;' : ''">
        <div id="modal" v-bind:style="(modal.open) ? 'transform: translateY(calc(50vh + 50%))' : ''">
            <h1 id="modalTitle" v-html=modal.title></h1>
            <p id="modalContent" v-html=modal.content></p>
            <UITextBox></UITextBox>
            <br>
            <span v-if="modal.mode == ModalMode.CONFIRM">
                <UIButton text="YES" @click=resolve></UIButton>
                <UIButton text="NO" @click=reject></UIButton>
            </span>
            <span v-else>
                <span v-if="modal.mode == ModalMode.QUERY">
                    <UIButton text="CANCEL" @click=reject></UIButton>
                </span>
                <UIButton text="OK" @click=resolve></UIButton>
            </span>
            <br>
            <br>
        </div>
    </div>
</template>

<style scoped>
#modalContainer {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: 300ms linear opacity;
    backdrop-filter: blur(2px);
    pointer-events: none;
    z-index: 1000;
}

#modal {
    position: fixed;
    bottom: 100vh;
    left: calc(25vw - 20px);
    width: 50vw;
    padding: 4px 16px;
    border: 4px solid;
    border-color: v-bind("modal.color");
    background-color: black;
    text-align: center;
    transition: 400ms ease-in-out transform;
}

#modalContent {
    font-size: 16px;
}

#modalYes,
#modalNo,
#modalCancel,
#modalOk {
    margin: 4px 4px;
    padding: 4px 4px;
    font: 16px Arial;
    font-weight: 600;
}

#modalYes {
    width: 100px;
    background-color: lime;
}

#modalNo {
    width: 100px;
    background-color: red;
}

#modalCancel,
#modalOk {
    width: 100px;
    background-color: black;
}
</style>