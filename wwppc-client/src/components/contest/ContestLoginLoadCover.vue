<script setup lang="ts">
import { useServerConnection } from '@/scripts/ServerConnection';
import { UILoadingSquare } from '../ui-defaults/UIDefaults';

const serverConnection = useServerConnection();
</script>

<template>
    <Transition>
        <div class="contestLoginLoadingCoverContainer" v-if="!serverConnection.handshakeComplete">
            <div class="contestLoginLoadingCoverWrapper">
                <div class="contestLoginLoadingCover">
                    <UILoadingSquare></UILoadingSquare>
                </div>
            </div>
            <div class="contestLoginLoadingText">
                Logging you in...
            </div>
        </div>
    </Transition>
</template>

<style>
.contestLoginLoadingCoverContainer {
    display: flex;
    flex-direction: column;
    grid-row: 1;
    grid-column: 1;
    box-sizing: border-box;
    padding: 20vh 20vw;
    align-items: center;
    justify-content: center;
    transition: 500ms linear opacity;
    background-color: black;
    opacity: 1;
}

.contestLoginLoadingCoverWrapper {
    display: flex;
    min-height: 0px;
    height: 100%;
}

.contestLoginLoadingCover {
    aspect-ratio: 1;
}

.contestLoginLoadingText {
    font-size: 24px;
}
</style>

<style scoped>
.v-leave-active {
    opacity: 0;
}
</style>