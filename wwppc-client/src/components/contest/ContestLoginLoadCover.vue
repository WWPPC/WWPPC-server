<script setup lang="ts">
import { useServerConnection } from '@/scripts/ServerConnection';
import { UILoadingSquare } from '../ui-defaults/UIDefaults';

const serverConnection = useServerConnection();
</script>

<template>
    <Transition>
        <div class="contestLoginLoadingCoverContainerWrapper" v-if="!serverConnection.handshakeComplete">
            <div class="contestLoginLoadingCoverContainer">
                <div class="contestLoginLoadingCoverWrapper">
                    <div class="contestLoginLoadingCover">
                        <UILoadingSquare></UILoadingSquare>
                    </div>
                </div>
                <div class="contestLoginLoadingText">
                    Logging you in...
                </div>
            </div>
        </div>
    </Transition>
</template>

<style>
.contestLoginLoadingCoverContainerWrapper {
    grid-row: 1;
    grid-column: 1;
    position: relative;
    transition: 1000ms linear opacity;
    background-color: black;
    opacity: 1;
}

.contestLoginLoadingCoverContainer {
    display: flex;
    flex-direction: column;
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20vh 20vw;
    align-items: center;
    justify-content: center;
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