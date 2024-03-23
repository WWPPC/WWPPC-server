<script setup lang="ts">
import { AnimateInContainer, DoubleCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import { UIIconButton } from '@/components/ui-defaults/UIDefaults';

defineProps<{
    name: string,
    roles: string,
    codeforces?: string,
    github?: string,
    img: string
}>();
</script>

<template>
    <AnimateInContainer type="slideUp" show-on-screen single>
        <DoubleCutCornerContainer hover-animation="lift" height="100%">
            <div class="homeAboutCreditsCardContent">
                <img :src=$props.img class="homeAboutCreditsCardImage">
                <div class="homeAboutCreditsCardName">{{ $props.name }}</div>
                <div class="homeAboutCreditsCardRoles" v-html=$props.roles></div>
            </div>
            <div class="homeAboutCreditsCardIcons">
                <!-- Maybe we should create a reusable component for buttons with external links -->
                <a class="homeAboutCreditsCardIconLink" :href="'https://codeforces.com/profile/' + codeforces" target="_blank" v-if="codeforces != undefined && codeforces != null">
                    <img class="homeAboutCreditsCardIconImage" src="/assets/codeforces.svg"/>
                </a>
                <a class="homeAboutCreditsCardIconLink" :href="'https://github.com/' + github" target="_blank" v-if="github != undefined && github != null">
                    <img class="homeAboutCreditsCardIconImage" src="/assets/github.svg"/>
                </a>
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
    width: 100%;
    text-align: center;
    text-wrap: nowrap;
    font-size: var(--font-24);
    font-weight: bold;
    color: lime;
}
.homeAboutCreditsCardRoles {
    text-align: center;
    padding-top: var(--font-18);
    font-size: var(--font-18);
    color: lime;
}
.homeAboutCreditsCardIcons {
    display: flex;
    justify-content: space-evenly;
}
.homeAboutCreditsCardIconLink {
    text-decoration: none;
}
.homeAboutCreditsCardIconImage {
    height: var(--font-32);
}
</style>