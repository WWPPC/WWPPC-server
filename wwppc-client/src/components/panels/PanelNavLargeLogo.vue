<script setup lang="ts">
import { useRouter } from 'vue-router';
defineProps<{
    target?: string
}>();

const router = useRouter();
</script>

<template>
    <img class="wwppcLargeLogo" src="/logo.svg" @click="router.push($props.target ?? '/home/home')">
</template>

<style scoped>
.wwppcLargeLogo {
    max-width: 100%;
    max-height: 100%;
    background-color: transparent;
    align-self: center;
    transition: 50ms linear transform, 500ms ease max-height;
    cursor: pointer;
}

.wwppcLargeLogo:hover {
    transform: scale(1.02);
}
.wwppcLargeLogo:active {
    transform: scale(0.98);
}

@media (max-width: 600px) {
    .wwppcLargeLogo {
        max-height: 40%;
    }
}
</style>