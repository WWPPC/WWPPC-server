<script setup lang="ts">
import { useAccountManager } from '@/scripts/AccountManager';

const accountManager = useAccountManager();
</script>

<template>
    <div class="accountUserDisp">
        <img class="accountUserDispImg" :src=accountManager.profileImage>
        <img class="accountuserDispImgReplaceOverlay" :src=accountManager.profileImage>
        <span class="accountUserUsername">{{ accountManager.username }}</span>
    </div>
    <div class="accountScrollbox">
        <slot></slot>
    </div>
</template>

<style scoped>
.accountUserDisp {
    display: grid;
    grid-template-rows: max(20vw, 20vh) 40px;
    position: sticky;
    top: 0px;
    left: 0px;
    width: max(20vw, 20vh);
    justify-items: center;
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
    width: 100%;
    height: 100%;
    border-radius: 50%;
    cursor: pointer;
    background-color: #FFF3;
    opacity: 0;
    transition: 50ms linear opacity;
}

.accountuserDispImgReplaceOverlay:hover {
    opacity: 1;
}

.accountScrollbox {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    margin-left: calc(max(20vw, 20vh) + 16px);
    margin-top: calc(max(20vw, 20vh) * -1 - 48px);
}

@media (max-width: 600px) {
    .accountUserDisp {
        width: 100%;
    }
    .accountScrollbox {
        margin-left: 0px;
        margin-top: 16px;
    }
}
</style>