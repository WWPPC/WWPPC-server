<script setup lang="ts">
import { autoGlitchTextTransition } from '@/components/ui-defaults/TextTransitions';
import { AnimateInContainer } from '@/components/ui-defaults/UIContainers';
import UIButton from '@/components/ui-defaults/inputs/UIButton.vue';
import { useAccountManager } from '@/scripts/AccountManager';
import { ref } from 'vue';
import { globalModal } from '@/components/ui-defaults/UIDefaults';
import { useServerConnection } from '@/scripts/ServerConnection';

const modal = globalModal();
const serverConnection = useServerConnection();
const accountManager = useAccountManager();

const dispName = autoGlitchTextTransition(() => accountManager.displayName, 40, 1, 10);
const username = autoGlitchTextTransition(() => '@' + accountManager.username, 40, 1, 10);

const fileUpload = ref<HTMLInputElement>();
const changeProfileImage = (event: any) => {
    const file: File | undefined = event.target?.files?.item(0);
    if (file == undefined) return;
    const reader = new FileReader();
    reader.onload = () => {
        if (typeof reader.result != 'string') return; // idk should never happen
        if (/^data:image\/(png|jpeg)/.test(reader.result)) {
            if (reader.result.length > serverConnection.serverConfig.maxProfileImgSize) {
                modal.showModal({ title: 'Image too large', content: 'Due to database restrictions, the maximum file size is an arbitrary small number.', color: 'red' });
                if (fileUpload.value) fileUpload.value.value = '';
                return;
            }
            accountManager.profileImage = reader.result;
            accountManager.writeUserData();
        } else {
            modal.showModal({ title: 'Unsupported file type', content: 'Only .png and .jpg/.jpeg images are allowed.', color: 'red' });
        }
    };
    reader.onerror = () => {
        modal.showModal({ title: 'Error decoding image', content: 'An error occured and your profile image could not be used. Try using a .png or .jpg/.jpeg image instead.', color: 'red' });
    };
    reader.readAsDataURL(file);
};
</script>

<template>
    <div class="accountUserDispWrapper">
        <div class="accountUserDisp">
            <label class="accountUserDispImgContainer">
                <img class="accountUserDispImg" :src=accountManager.profileImage alt="Profile picture">
                <img class="accountuserDispImgReplaceOverlay" src="/assets/upload.svg" title="Upload profile image">
                <input type="file" class="accountUserDispImgUpload" accept="image/png,image/jpeg" @change=changeProfileImage>
            </label>
            <span class="accountUserDisplayName">{{ dispName }}</span>
            <span class="accountUserUsername">{{ username }}</span>
            <div class="accountUserRegistrations">
                <AnimateInContainer type="slideUp" v-for="(reg, i) in accountManager.registrations" :key="i" :delay="i * 200" single>
                    <span class="accountUserRegistrationLine">
                        <div class="registrationStatusDotUpcoming"></div>
                        {{ reg }}
                    </span>
                </AnimateInContainer>
                <AnimateInContainer type="fade" v-for="(reg, i) in accountManager.pastRegistrations" :key="i" :delay="i * 200" single>
                    <span class="accountUserRegistrationLine">
                        <div class="registrationStatusDotCompleted"></div>
                        {{ reg }}
                    </span>
                </AnimateInContainer>
            </div>
            <UIButton text="Sign Out" width="100%" @click="accountManager.signout"></UIButton>
        </div>
    </div>
    <div class="accountScrollboxWrapper">
        <div class="accountScrollbox">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
* {
    --imageSize: max(20vw, 20vh);
    --dispWidth: max(30vw, 20vh);
}

.accountUserDispWrapper {
    display: flex;
    position: absolute;
    top: 16px;
    left: 16px;
    box-sizing: border-box;
    width: var(--dispWidth);
    padding: 0px calc((var(--dispWidth) - var(--imageSize)) / 2);
    justify-content: center;
}

.accountUserDisp {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: var(--imageSize) min-content min-content min-content min-content;
    justify-items: center;
}

.accountUserDispImgContainer {
    display: grid;
    grid-row: 1;
    grid-column: 1;
    width: var(--imageSize);
    height: var(--imageSize);
}

.accountUserDispImg {
    grid-row: 1;
    grid-column: 1;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: 4px solid white;
    border-radius: 50%;
}

.accountuserDispImgReplaceOverlay {
    grid-row: 1;
    grid-column: 1;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20% 20%;
    border-radius: 50%;
    cursor: pointer;
    background-color: #0004;
    opacity: 0;
    transition: 100ms linear opacity;
}

.accountuserDispImgReplaceOverlay:hover {
    opacity: 0.8;
}

.accountUserDispImgUpload {
    display: none;
}

.accountUserDisplayName {
    margin-top: 8px;
    font-size: var(--font-24);
    font-family: 'Source Code Pro', Courier, monospace;
    white-space: pre;
    word-wrap: break-word;
    text-wrap: balance;
    line-break: anywhere;
    word-break: break-all;
    text-overflow: ellipsis;
}

.accountUserUsername {
    font-size: var(--font-18);
    font-family: 'Source Code Pro', Courier, monospace;
    line-break: anywhere;
    word-break: break-all;
}

.accountUserRegistrations {
    font-size: var(--font-20);
    text-align: center;
    padding: 10px 0px;
}

.accountUserRegistrationLine {
    display: flex;
    flex-direction: row;
    column-gap: 4px;
    margin: 4px 0px;
    line-height: 1em;
    text-wrap: nowrap;
    word-wrap: nowrap;
}

.registrationStatusDotUpcoming,
.registrationStatusDotCompleted {
    width: 1em;
    height: 1em;
    min-width: 1em;
    min-height: 1em;
    border-radius: 50%;
}

.registrationStatusDotUpcoming {
    background-color: cyan;
}

.registrationStatusDotCompleted {
    background-color: lime;
}

.accountScrollboxWrapper {
    position: absolute;
    top: 0px;
    right: 0px;
    width: calc(100% - var(--dispWidth) - 48px);
    padding: 16px 16px;
    height: calc(100% - 32px);
    overflow-y: auto;
}

.accountScrollbox {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    column-gap: 16px;
}


@media (max-width: 700px) {
    .accountUserDispWrapper {
        position: static;
        width: 100%;
    }

    .accountScrollboxWrapper {
        position: static;
        width: 100%;
        height: min-content;
        padding: 16px 0px;
    }
}
</style>