<!-- oops i used options and composition api -->
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { glitchTextTransition } from './TextTransitions';
import { UIButton, UITextBox } from './UIDefaults';

const modalInput = ref(UITextBox);
const modal = reactive({
    title: '',
    content: '',
    mode: ModalMode.NOTIFY,
    color: 'white',
    open: false
});
let modalResolve = () => { };
let modalReject = () => { };
const showModal = ({ title, content, mode = ModalMode.NOTIFY, color = 'white', glitchTitle = false }: { title: string, content: string, mode?: ModalMode, color?: string, glitchTitle?: boolean }): Promise<boolean | string | null> => {
    if (glitchTitle) glitchTextTransition(title, title, (text) => { modal.title = text; return false }, 40, 2, 10, 1, true);
    else modal.title = title;
    modal.content = content;
    modal.mode = mode;
    modal.color = color;
    modalInput.value.text = '';
    modal.open = true;
    return new Promise((resolve) => {
        if (modal.mode == ModalMode.QUERY) {
            modalResolve = () => {
                modal.open = false;
                resolve(modalInput.value.text);
            };
            modalReject = () => {
                modal.open = false;
                resolve(null);
            };
        } else {
            modalResolve = () => {
                modal.open = false;
                resolve(true);
            };
            modalReject = () => {
                modal.open = false;
                resolve(false);
            };
        }
    });
}
defineExpose({ showModal });
</script>
<script lang="ts">
export const enum ModalMode {
    NOTIFY = 0,
    CONFIRM = 1,
    QUERY = 2
}
</script>

<template>
    <div class="modalContainer" v-bind:style="modal.open ? 'opacity: 1; pointer-events: all;' : ''">
        <div class="modalBody" v-bind:style="modal.open ? 'transform: translateY(calc(50vh + 50%))' : ''">
            <h1 v-html=modal.title></h1>
            <p v-html=modal.content></p>
            <span v-if="modal.mode == ModalMode.QUERY">
                <UITextBox ref="modalInput"></UITextBox>
                <br>
            </span>
            <div class="modalButtons">
                <span v-if="modal.mode == ModalMode.CONFIRM">
                    <UIButton text="YES" @click=modalResolve width="80px" background-color="#0D0"></UIButton>
                    <UIButton text="NO" @click=modalReject width="80px" background-color="#D00"></UIButton>
                </span>
                <span v-else>
                    <span v-if="modal.mode == ModalMode.QUERY">
                        <UIButton text="CANCEL" @click=modalReject width="80px"></UIButton>
                    </span>
                    <UIButton text="OK" @click=modalResolve width="80px"></UIButton>
                </span>
            </div>
        </div>
    </div>
</template>

<style>
.modalContainer {
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

.modalBody {
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

.modalBody h1 {
    margin: 0px 0px;
    margin-top: 16px;
}

.modalButtons {
    margin: 8px 0px;
    margin-bottom: 16px;
}
</style>