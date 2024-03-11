<script setup lang="ts">
import { UILoadingSpinner } from './ui-defaults/UIDefaults';

defineProps<{
    text: string
    show: boolean
}>();

</script>

<template>
    <Transition>
        <div class="waitCoverContainer" v-if=$props.show>
            <div class="waitCoverSpinnerWrapper">
                <UILoadingSpinner></UILoadingSpinner>
            </div>
            <div class="waitCoverText">
                {{ $props.text }}
            </div>
        </div>
    </Transition>
</template>

<style>
.waitCoverContainer {
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
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    justify-content: center;
    align-items: center;
}

.waitCoverSpinnerWrapper {
    width: min(25vw, 25vh);
    height: min(25vw, 25vh);
    margin-bottom: min(5vw, 5vh);
}

.waitCoverText {
    font-size: 4vh;
}
</style>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: 200ms linear opacity;
}

.v-enter-to,
.v-leave-from {
    opacity: 1;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>