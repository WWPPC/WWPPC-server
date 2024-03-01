<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
const props = defineProps<{
    name: string
    isDefault?: boolean
}>();
</script>

<template>
    <Transition>
        <div class="panelView" v-if="route.params.page == props.name || (route.params.page == undefined && props.isDefault)">
            <slot></slot>
        </div>
    </Transition>
</template>

<style>
.panelView {
    display: grid;
    grid-template-rows: 100px minmax(0, 1fr);
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
}

.v-enter-active {
    animation: panel-transition-in 500ms linear;
}

.v-leave-active {
    animation: panel-transition-out 500ms linear;
}

@keyframes panel-wipe-vertical {
    0% {
        transform: none;
    }

    50% {
        transform: translateY(100%);
    }

    100% {
        transform: translateY(200%);
    }
}

@keyframes panel-wipe-horizontal {
    0% {
        transform: none;
    }

    50% {
        transform: translatex(100%);
    }

    100% {
        transform: translatex(200%);
    }
}

@keyframes panel-transition-in {
    0% {
        visibility: hidden;
    }

    50% {
        visibility: hidden;
    }

    100% {
        visibility: visible;
    }
}

@keyframes panel-transition-out {
    0% {
        visibility: visible;
    }

    50% {
        visibility: hidden;
    }

    100% {
        visibility: hidden;
    }
}
</style>