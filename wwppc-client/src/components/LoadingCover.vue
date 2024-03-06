<script setup lang="ts">
import { useServerConnection } from '@/scripts/ServerConnection';
import { UILoadingSquare } from './ui-defaults/UIDefaults';
import { useRoute } from 'vue-router';

defineProps<{
    text: string
    ignoreServer?: boolean
}>();

const serverConnection = useServerConnection();
const route = useRoute();
</script>

<template>
    <Transition>
        <div class="loadingCoverContainerWrapper" v-if="!serverConnection.handshakeComplete && (route.query.ignore_server === undefined || !$props.ignoreServer)">
            <div class="loadingCoverContainer">
                <div class="loadingCoverWrapper">
                    <div class="loadingCover">
                        <UILoadingSquare></UILoadingSquare>
                    </div>
                </div>
                <div class="loadingText">
                    {{ $props.text }}
                </div>
            </div>
        </div>
    </Transition>
</template>

<style>
.loadingCoverContainerWrapper {
    grid-row: 1;
    grid-column: 1;
    position: relative;
    transition: 1000ms linear opacity;
    background-color: black;
    opacity: 1;
}

.loadingCoverContainer {
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

.loadingCoverWrapper {
    display: flex;
    min-height: 0px;
    height: 100%;
}

.loadingCover {
    aspect-ratio: 1;
}

.loadingText {
    font-size: 24px;
}
</style>

<style scoped>
.v-leave-active {
    opacity: 0;
}
</style>