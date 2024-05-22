<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRoute } from 'vue-router';
const props = defineProps<{
    show?: boolean
}>();

const route = useRoute();
const showAnyways = ref(route.query.super_secret_scanlines !== undefined || Math.random() < 0.001);
watch(() => route.query.super_secret_scanlines, () => {
    showAnyways.value = route.query.super_secret_scanlines !== undefined || showAnyways.value;
});
</script>

<template>
    <div class="superSecretDiv" v-if="props.show || showAnyways">
        <div class="superSecretNoise"></div>
        <div class="superSecretScanlines"></div>
        <div class="superSecretFlicker"></div>
        <div class="superSecretRadialElectronBeamBending"></div>
        <div class="superSecretStroboscopicScanlineEffect"></div>
    </div>
</template>

<style scoped>
.superSecretDiv {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.1);
    pointer-events: none;
    z-index: 999999;
}

.superSecretRadialElectronBeamBending,
.superSecretFlicker,
.superSecretScanlines,
.superSecretStroboscopicScanlineEffect,
.superSecretNoise {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
}

.superSecretRadialElectronBeamBending {
    background-image: radial-gradient(rgba(255, 200, 160, 0.03) 0%, rgba(0, 0, 0, 0.3) 100%);
}

.superSecretFlicker {
    background-color: rgba(11, 8, 8, 0.1);
    animation: super-secret-flicker 50ms infinite linear;
}

.superSecretScanlines {
    background-image: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.03), rgba(0, 0, 255, 0.06));
    background-size: 100% 2px, 3px 100%;
}

.superSecretStroboscopicScanlineEffect {
    background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0%, transparent 100%);
    background-size: 100% 200px;
    background-repeat: no-repeat;
    animation: super-secret-scanline 5s infinite linear;
}

.superSecretNoise {
    top: -150%;
    left: -50%;
    width: 300%;
    height: 400%;
    background-image: url(/assets/noise.png);
    background-size: auto;
    opacity: 0.2;
    animation: super-secret-grain 8s steps(10) infinite;
}

@keyframes super-secret-flicker {
    0% {
        opacity: 0;
    }

    10% {
        opacity: 0.9;
    }

    20% {
        opacity: 1;
    }

    30% {
        opacity: 0;
    }

    40% {
        opacity: 0.9;
    }

    50% {
        opacity: 1;
    }

    60% {
        opacity: 0;
    }

    70% {
        opacity: 0.9;
    }

    80% {
        opacity: 1;
    }

    90% {
        opacity: 0;
    }

    100% {
        opacity: 0.9;
    }
}

@keyframes super-secret-scanline {
    0% {
        transform: translateY(100%);
    }

    100% {
        transform: translateY(-150px);
    }
}

@keyframes super-secret-grain {

    0%,
    100% {
        transform: translate(0, 0);
    }

    10% {
        transform: translate(-5%, -10%);
    }

    20% {
        transform: translate(-15%, 5%);
    }

    30% {
        transform: translate(7%, -25%);
    }

    40% {
        transform: translate(-5%, 25%);
    }

    50% {
        transform: translate(-15%, 10%);
    }

    60% {
        transform: translate(15%, 0%);
    }

    70% {
        transform: translate(0%, 15%);
    }

    80% {
        transform: translate(3%, 35%);
    }

    90% {
        transform: translate(-10%, 10%);
    }
}
</style>