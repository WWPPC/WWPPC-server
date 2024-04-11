<!-- oops i used options and composition api -->
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { glitchTextTransition } from './TextTransitions';
import { UIButton, UITextBox } from './UIDefaults';

const modalInput = ref('');
const modal = reactive<{
    title: string
    content: string
    mode: ModalMode
    inputType: 'text' | 'password' | 'email'
    color: string
    open: boolean
}>({
    title: '',
    content: '',
    mode: ModalMode.NOTIFY,
    inputType: 'text',
    color: 'white',
    open: false
});
let modalResolve = () => { };
let modalReject = () => { };
const modalQueue: Array<{ params: ModalParams, resolve: (v: boolean | string | null) => void }> = [];
const showNextModal = async () => {
    const params = modalQueue.shift();
    params?.resolve(await showModal(params?.params));
};
const showModal = async (params: ModalParams): Promise<boolean | string | null> => {
    if (modal.open) return await new Promise((resolve) => {
        modalQueue.push({ params, resolve });
    });
    const { title, content, mode = ModalMode.NOTIFY, inputType = 'text', color = 'white', glitchTitle = false } = params;
    if (glitchTitle) glitchTextTransition(title, title, (text) => { modal.title = text; return false }, 40, 2, 10, 1, true);
    else modal.title = title;
    modal.content = content;
    modal.mode = mode;
    modalInput.value = '';
    modal.inputType = inputType;
    modal.color = color;
    console.log(modal.color)
    modal.open = true;
    return await new Promise((resolve) => {
        if (modal.mode == ModalMode.QUERY) {
            modalResolve = async () => {
                modal.open = false;
                resolve(modalInput.value);
                await showNextModal();
            };
            modalReject = async () => {
                modal.open = false;
                resolve(null);
                await showNextModal();
            };
        } else {
            modalResolve = async () => {
                modal.open = false;
                resolve(true);
                await showNextModal();
            };
            modalReject = async () => {
                modal.open = false;
                resolve(false);
                await showNextModal();
            };
        }
    });
};
const cancelModal = async () => {
    await modalReject();
};
const cancelAllModals = async () => {
    while (modalQueue.length) await modalReject();
};
defineExpose({ showModal, cancelModal, cancelAllModals });
</script>
<script lang="ts">
export const enum ModalMode {
    /**A notification - only an acknowledgement response */
    NOTIFY = 0,
    /**A confirmation - confirm or deny */
    CONFIRM = 1,
    /**A request for text input */
    QUERY = 2,
    /**A request for boolean input - yes or no */
    INPUT = 3
}
export interface ModalParams {
    /**Modal header */
    title: string
    /**Modal body */
    content: string
    /**Modal mode */
    mode?: ModalMode
    /**Input type for `QUERY` mode */
    inputType?: 'text' | 'password' | 'email'
    /**Border color */
    color?: string
    /**Cool title effect? */
    glitchTitle?: boolean
}
</script>

<template>
    <div class="modalContainer" :style="modal.open ? 'opacity: 1; pointer-events: all;' : ''">
        <div class="modalBodyWrapper" :style="modal.open ? 'transform: translateY(calc(50vh + 50%))' : ''">
            <div class="modalBody">
                <h1 v-html=modal.title></h1>
                <p v-html=modal.content></p>
                <span v-if="modal.mode == ModalMode.QUERY">
                    <UITextBox v-model=modalInput :type=modal.inputType autocomplete="off"></UITextBox>
                    <br>
                </span>
                <div class="modalButtons">
                    <span v-if="modal.mode == ModalMode.INPUT">
                        <UIButton text="YES" @click=modalResolve width="5em" color="lime" font="bold var(--font-16) 'Source Code Pro'"></UIButton>
                        <UIButton text="NO" @click=modalReject width="5em" color="red" font="bold var(--font-16) 'Source Code Pro'"></UIButton>
                    </span>
                    <span v-else>
                        <span v-if="modal.mode == ModalMode.QUERY || modal.mode == ModalMode.CONFIRM">
                            <UIButton text="CANCEL" @click=modalReject width="5em" color="red" font="bold var(--font-16) 'Source Code Pro'"></UIButton>
                        </span>
                        <UIButton text="OK" @click=modalResolve width="5em" color="lime" font="bold var(--font-16) 'Source Code Pro'"></UIButton>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.modalContainer {
    display: grid;
    grid-template-rows: 1fr min-content 1fr;
    grid-template-columns: 1fr min-content 1fr;
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
    grid-row: 2;
    grid-column: 2;
    display: flex;
    position: relative;
    bottom: calc(50vh + 50%);
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
    min-width: 0px;
    padding: 4px 1em;
    background-color: black;
    clip-path: polygon(30px 0%, 100% 0%, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0% 100%, 0% 30px);
    text-align: center;
}

.modalBody h1 {
    margin: 0px 0px;
    margin-top: 0.5em;
}

.modalBody p {
    text-align: center;
    font-size: var(--font-small);
}

.modalButtons {
    margin: 8px 0px;
    margin-bottom: 16px;
}
</style>