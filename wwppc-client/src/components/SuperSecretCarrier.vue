<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
    show?: boolean
}>();

const route = useRoute();
const randomShow = ref(Math.random() < 0.001);
const showAnyways = ref(route.query.battlecow !== undefined);
watch(() => route.query.battlecow, () => {
    showAnyways.value = route.query.battlecow !== undefined || showAnyways.value;
});

const j1 = ref(false);
const j2 = ref(false);
const jumping1 = () => {
    j1.value = true;
    setTimeout(() => j1.value = false, 400);
};
const jumping2 = () => {
    j2.value = true;
    setTimeout(() => j2.value = false, 400);
};
</script>

<template>
    <div class="superSecretCarrier" v-if="props.show || randomShow || showAnyways">
        <div class="launcherWrapper">
            <img src="/assets/battlecow/red-launcher.png" :class="'launcher ' + (j1 ? 'jumping' : '')" @click="jumping1()">
        </div>
        <div class="carrierWrapper">
            <img src="/assets/battlecow/blue-carrier.png" :class="'carrier ' + (j2 ? 'jumping' : '')" @click="jumping2()">
        </div>
    </div>
</template>

<style scoped>
.superSecretCarrier {
    contain: size layout;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 8vh;
    pointer-events: none;
    z-index: 999999;
}

.carrierWrapper,
.launcherWrapper {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 8vh;
    animation: 6s linear translate;
    animation-iteration-count: v-bind("showAnyways ? 'infinite' : '1'");
    transform: translateX(-12vh);
}

.carrierWrapper {
    animation-delay: 5s;

}

.launcherWrapper {
    animation-delay: 7s;
}

.carrier,
.launcher {
    position: absolute;
    width: 8vh;
    height: 8vh;
    animation: 150ms cubic-bezier(0.4, 0, 0.6, 1) run alternate infinite;
    border-radius: 3vh;
    background-color: currentColor;
    box-shadow: 0px 0px 2vh 2vh currentColor;
    pointer-events: all;
    cursor: pointer;
}

.carrier {
    color: #0AF4;
}

.launcher {
    color: #F204;
}

.jumping {
    animation: 200ms cubic-bezier(0.1, 0.3, 0.6, 1) jump alternate infinite;
}

@keyframes translate {
    from {
        transform: translateX(-12vh);
    }

    to {
        transform: translateX(calc(100% + 12vh));
    }

}

@keyframes run {
    from {
        transform: rotateZ(-5deg);
    }

    to {
        transform: rotateZ(5deg);
    }
}

@keyframes jump {
    from {
        transform: translateY(0) rotateZ(-10deg);
    }

    to {
        transform: translateY(-6vh) rotateZ(5deg);
    }
}
</style>