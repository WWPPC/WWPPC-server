<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRoute } from 'vue-router';
const props = defineProps<{
    show?: boolean
}>();

const route = useRoute();
const randomShow = ref(Math.random() < 0.01);
const showAnyways = ref(route.query.battlecow !== undefined);
watch(() => route.query.battlecow, () => {
    showAnyways.value = route.query.battlecow !== undefined || showAnyways.value;
});
</script>

<template>
    <div class="superSecretCarrier" v-if="props.show || randomShow || showAnyways">
        <div class="launcherWrapper">
            <img src="/assets/battlecow/red-launcher.png" class="launcher">
        </div>
        <div class="carrierWrapper">
            <img src="/assets/battlecow/blue-carrier.png" class="carrier">
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
}

.carrier {
    color: #0DF4;
}

.launcher {
    color: #F304;
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
</style>