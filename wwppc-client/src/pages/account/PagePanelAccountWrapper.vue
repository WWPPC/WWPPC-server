<script setup lang="ts">
import { toDivName, useAccountManager } from '@/scripts/AccountManager';

const accountManager = useAccountManager();
</script>

<template>
    <div class="accountUserDispWrapper">
        <div class="accountUserDisp">
            <img class="accountUserDispImg" :src=accountManager.profileImage alt="Profile picture">
            <img class="accountuserDispImgReplaceOverlay" src="/assets/upload.svg" title="Upload profile image">
            <span class="accountUserUsername">{{ accountManager.username }}</span>
            <div class="accountUserRegistrations">
                <span v-for="reg in accountManager.registrations" :key="reg.contest + reg.division">
                    {{ reg.contest }}&nbsp;{{ toDivName(reg.division) }}&nbsp;Division
                    <br>
                </span>
            </div>
        </div>
    </div>
    <div class="accountScrollbox">
        <slot></slot>
    </div>
</template>

<style scoped>
.accountUserDispWrapper {
    display: flex;
    position: sticky;
    top: 0px;
    left: 0px;
    width: max(20vw, 20vh);
    justify-content: center;
}

.accountUserDisp {
    display: grid;
    grid-template-rows: max(20vw, 20vh) 40px 1fr;
    justify-items: center;
}

.accountUserDispImg {
    grid-row: 1;
    grid-column: 1;
    box-sizing: border-box;
    width: max(20vw, 20vh);
    height: max(20vw, 20vh);
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

.accountUserRegistrations {
    text-align: center;
}

.accountScrollbox {
    display: flex;
    flex-direction: column;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    margin-left: calc(max(20vw, 20vh) + 16px);
    margin-top: calc(max(20vw, 20vh) * -1 - 40px);
    row-gap: 16px;
    column-gap: 16px;
}

@media (max-width: 600px) {
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