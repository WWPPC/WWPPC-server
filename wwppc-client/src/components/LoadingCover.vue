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
        <div class="loadingCoverContainer" v-if="!serverConnection.handshakeComplete && (route.query.ignore_server === undefined || !$props.ignoreServer)">
            <div class="loadingCoverSquareWrapper">
                <UILoadingSquare></UILoadingSquare>
            </div>
            <div class="loadingCoverText">
                {{ $props.text }}
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.loadingCoverContainer {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    width: 100%;
    height: 100%;
    padding: 20vh 20vw;
    background-color: black;
    align-items: center;
    justify-content: center;
    transition: 500ms linear opacity;
    opacity: 1;
}

.loadingCoverSquareWrapper {
    width: min(50vw, 50vh);
    height: min(50vw, 50vh);
    margin-bottom: min(5vw, 5vh);
}

.loadingCoverText {
    font-size: 4vh;
}
</style>

<style scoped>
.v-leave-active {
    opacity: 0;
}
</style>