<script setup lang="ts">
import { glitchTextTransition } from '@/components/ui-defaults/TextTransitions';
import { AnimateInContainer } from '@/components/ui-defaults/UIContainers';
import UIButton from '@/components/ui-defaults/inputs/UIButton.vue';
import { toDivName, useAccountManager } from '@/scripts/AccountManager';
import { onMounted, ref, watch } from 'vue';
import { globalModal } from '@/components/ui-defaults/UIDefaults';

const modal = globalModal();
const accountManager = useAccountManager();

// random nullish coalescers fix weird bug in dev
const dispName = ref('');
const username = ref('');
watch(() => accountManager.displayName, () => {
    glitchTextTransition(dispName.value, accountManager.displayName ?? '', (t) => { dispName.value = t; }, 40, 1, 20);
});
watch(() => accountManager.username, () => {
    glitchTextTransition(username.value, '@' + accountManager.username ?? '', (t) => { username.value = t; }, 40, 1, 20);
});
onMounted(() => {
    glitchTextTransition(dispName.value, accountManager.displayName ?? '', (t) => { dispName.value = t; }, 40, 1, 20);
    glitchTextTransition(username.value, '@' + accountManager.username ?? '', (t) => { username.value = t; }, 40, 1, 20);
});

const fileUpload = ref<HTMLInputElement>();
const changeProfileImage = () => {
    const file: File | undefined | null = fileUpload.value?.files?.item(0);
    if (fileUpload.value == undefined || file == undefined) return;
    if (file.size > 40960) {
        fileUpload.value.value = '';
        modal.showModal({ title: 'Image too large', content: 'The maximum file size for profile images is 40kB<br>(this is due to a database limitation)', color: 'red' });
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        if (typeof reader.result != 'string') return; // idk should never happen
        if (/^data:image\/(png|jpeg)/.test(reader.result)) {
            accountManager.profileImage = reader.result;
        } else {
            modal.showModal({ title: 'Unsupported file type', content: 'Only .png and .jpg/.jpeg images are allowed.', color: 'red'});
        }
    };
    reader.onerror = () => {
        modal.showModal({ title: 'Error decoding image', content: 'An error occured and your profile image could not be used. Try using a .png or .jpg/.jpeg image instead.', color: 'red'});
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
                <AnimateInContainer type="slideUp" v-for="(reg, i) in accountManager.registrations" :key="reg.contest + reg.division" :delay="i * 200">
                    {{ reg.contest }}&nbsp;{{ toDivName(reg.division) }}&nbsp;Division
                </AnimateInContainer>
            </div>
            <UIButton text="Sign Out" width="100%" @click="accountManager.signOut()"></UIButton>
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
    grid-template-rows: var(--imageSize) 1fr 1fr 1fr 1fr;
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
    background-color: #FFF3;
    opacity: 0;
    transition: 100ms linear opacity;
}

.accountuserDispImgReplaceOverlay:hover {
    opacity: 0.5;
}

.accountUserDispImgUpload {
    display: none;
}

.accountUserDisplayName {
    margin-top: 8px;
    font-size: var(--font-24);
    font-family: 'Source Code Pro', Courier, monospace;
}

.accountUserUsername {
    font-size: var(--font-18);
    font-family: 'Source Code Pro', Courier, monospace;
}

.accountUserRegistrations {
    font-size: var(--font-20);
    text-align: center;
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