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
interface ModalParams {
    title: string
    content: string
    mode?: ModalMode
    color?: string
    glitchTitle?: boolean
}
let modalResolve = () => { };
let modalReject = () => { };
const modalQueue: Array<{ params: ModalParams, resolve: (v: boolean | string | null) => void }> = [];
const showNextModal = async () => {
    const params = modalQueue.shift();
    params?.resolve(await showModal(params?.params));
}
const showModal = (params: ModalParams): Promise<boolean | string | null> => {
    if (modal.open) return new Promise((resolve) => {
        modalQueue.push({ params, resolve });
    });
    const { title, content, mode = ModalMode.NOTIFY, color = 'white', glitchTitle = false } = params;
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
                showNextModal();
            };
            modalReject = () => {
                modal.open = false;
                resolve(null);
                showNextModal();
            };
        } else {
            modalResolve = () => {
                modal.open = false;
                resolve(true);
                showNextModal();
            };
            modalReject = () => {
                modal.open = false;
                resolve(false);
                showNextModal();
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
    <div class="modalContainer" :style="modal.open ? 'opacity: 1; pointer-events: all;' : ''">
        <div class="modalBodyWrapper" :style="modal.open ? 'transform: translateY(calc(50vh + 50%))' : ''">
            <div class="modalBody">
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

.modalBodyWrapper {
    display: flex;
    position: fixed;
    bottom: 100vh;
    left: calc(25vw - 20px);
    width: 50vw;
    padding: 4px 4px;
    background-color: v-bind("modal.color");
    box-shadow: 0px 0px 8px v-bind("modal.color");
    clip-path: polygon(32px 0%, 100% 0%, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0% 100%, 0% 32px);
    transition: 400ms ease-in-out transform;
}

.modalBody {
    flex-grow: 1;
    display: inline-block;
    padding: 4px 16px;
    background-color: black;
    clip-path: polygon(30px 0%, 100% 0%, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0% 100%, 0% 30px);
    text-align: center;
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