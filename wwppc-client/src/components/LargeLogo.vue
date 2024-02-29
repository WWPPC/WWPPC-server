<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <img class="wwppcLargeLogo" src="/logo.svg" @click="router.push('/home/home')">
</template>

<style>
.wwppcLargeLogo {
    height: 100%;
    cursor: pointer;
    background-color: transparent;
    transition: 50ms linear transform;
}

.wwppcLargeLogo:hover {
    transform: scale(1.02);
}
.wwppcLargeLogo:active {
    transform: scale(0.98);
}
</style>