<script setup lang="ts">
import UIButton from '@/components/ui-defaults/inputs/UIButton.vue';
import { toDivName, useAccountManager } from '@/scripts/AccountManager';

const accountManager = useAccountManager();

const changeProfileImage = () => {

};
</script>

<template>
    <div class="accountContainer">
        <div class="accountUserDispWrapper">
            <div class="accountUserDisp">
                <label class="accountUserDispImgContainer">
                    <img class="accountUserDispImg" :src=accountManager.profileImage alt="Profile picture">
                    <img class="accountuserDispImgReplaceOverlay" src="/assets/upload.svg" title="Upload profile image">
                    <input type="file" class="accountUserDispImgUpload" accept="image/*" @change=changeProfileImage>
                </label>
                <span class="accountUserUsername">{{ accountManager.username }}</span>
                <div class="accountUserRegistrations">
                    <span v-for="reg in accountManager.registrations" :key="reg.contest + reg.division">
                        {{ reg.contest }}&nbsp;{{ toDivName(reg.division) }}&nbsp;Division
                        <br>
                    </span>
                </div>
                <UIButton text="Sign Out" width="100%" @click="accountManager.signOut()"></UIButton>
            </div>
        </div>
        <div class="accountScrollbox">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.accountContainer {
    --imageSize: max(20vw, 20vh);
    --dispWidth: max(30vw, 20vh);
}

.accountUserDispWrapper {
    display: flex;
    position: absolute;
    top: 16px;
    left: 16px;
    width: var(--dispWidth);
    justify-content: center;
}

.accountUserDisp {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: var(--imageSize) 40px 1fr 1fr 1fr;
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

.accountUserUsername {
    font-size: var(--font-24);
}

.accountUserRegistrations {
    font-size: var(--font-20);
    text-align: center;
}

.accountScrollbox {
    display: flex;
    flex-direction: column;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    margin-left: calc(var(--dispWidth) + 16px);
    row-gap: 16px;
    column-gap: 16px;
}

@media (max-width: 700px) {
    .accountUserDispWrapper {
        position: static;
        width: 100%;
    }

    .accountScrollbox {
        margin-left: 0px;
        margin-top: 16px;
    }
}
</style>