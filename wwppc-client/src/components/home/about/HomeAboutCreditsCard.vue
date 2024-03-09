<script setup lang="ts">
import { AnimateInContainer, DoubleCutCornerContainer } from '@/components/ui-defaults/UIContainers';

defineProps<{
    name: string,
    roles: string,
    img: string
}>();
</script>

<template>
    <AnimateInContainer type="slideUp" single>
        <DoubleCutCornerContainer hover-animation="lift">
            <div class="homeAboutCreditsCardContent">
                <img :src=$props.img class="homeAboutCreditsCardImage">
                <div class="homeAboutCreditsCardName">{{ $props.name }}</div>
                <div class="homeAboutCreditsCardRoles" v-html=$props.roles></div>
            </div>
        </DoubleCutCornerContainer>
    </AnimateInContainer>
</template>

<style>
.homeAboutCreditsCardContent {
    display: grid;
    grid-template-rows: 220px 40px 120px;
    justify-items: center;
    width: 280px;
    height: 380px;
}
.homeAboutCreditsCardImage {
    width: 212px;
    height: 212px;
    border: 4px solid white;
}
.homeAboutCreditsCardName {
    margin-top: 8px;
    width: 280px;
    text-align: center;
    text-wrap: nowrap;
    font-size: 24px;
    font-weight: bold;
    color: lime;
}
.homeAboutCreditsCardRoles {
    text-align: center;
    padding-top: 18px;
    color: lime;
}
</style>