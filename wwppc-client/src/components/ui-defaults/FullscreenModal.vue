<script setup lang="ts">
import { reactive, ref } from 'vue';
import { glitchTextTransition } from './TextTransitions';
import { UIButton, UITextBox } from './UIDefaults';
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
let modalResolve = () => { };
let modalReject = () => { };
const modalInput = ref(null);
export async function showModal({ title, content, mode = ModalMode.NOTIFY, color = 'white', glitchTitle = false }: { title: string, content: string, mode?: ModalMode, color?: string, glitchTitle?: boolean }): Promise<boolean | string | null> {
    if (glitchTitle) glitchTextTransition(title, title, (text) => { modal.title = text; return false }, 40, 2, 10, 1, true);
    else modal.title = title;
    modal.content = content;
    modal.mode = mode;
    modal.color = color;
    modal.open = true;
    return await new Promise((resolve) => {
        if (modal.mode == ModalMode.QUERY) {
            modalResolve = () => {
                modal.open = false;
                resolve(modalInput.value);
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
</script>

<template>
    <div id="container" v-bind:style="(modal.open) ? 'opacity: 1; pointer-events: all;' : ''">
        <div id="modal" v-bind:style="(modal.open) ? 'transform: translateY(calc(50vh + 50%))' : ''">
            <h1 v-html=modal.title></h1>
            <p v-html=modal.content></p>
            <UITextBox ref="modalTextbox"></UITextBox>
            <br>
            <div id="buttons">
                <span v-if="modal.mode == ModalMode.CONFIRM">
                    <UIButton text="YES" @click=modalResolve width="60px"></UIButton>
                    <UIButton text="NO" @click=modalReject width="60px"></UIButton>
                </span>
                <span v-else>
                    <span v-if="modal.mode == ModalMode.QUERY">
                        <UIButton text="CANCEL" @click=modalReject width="60px"></UIButton>
                    </span>
                    <UIButton text="OK" @click=modalResolve width="60px"></UIButton>
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
#container {
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

#content {
    font-size: 16px;
}

#buttons {
    margin: 8px 0px;
}

#buttonYes,
#buttonNo,
#buttonCancel,
#buttonOk {
    margin: 4px 4px;
    padding: 4px 4px;
    font: 16px Arial;
    font-weight: 600;
}

#buttonYes {
    width: 100px;
    background-color: lime;
}

#buttonNo {
    width: 100px;
    background-color: red;
}

#buttonCancel,
#buttonOk {
    width: 100px;
    background-color: black;
}
</style>