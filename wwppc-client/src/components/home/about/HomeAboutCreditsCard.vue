<script setup lang="ts">
import { AnimateInContainer, DoubleCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import HomeAboutCreditsCardIcon from './HomeAboutCreditsCardIcon.vue';

defineProps<{
    name: string,
    roles: string,
    codeforces?: string,
    github?: string,
    discord?: string,
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
                <div class="homeAboutCreditsCardIcons">
                    <HomeAboutCreditsCardIcon profileUrl="https://codeforces.com/profile/" :user=$props.codeforces icon="/assets/codeforces.svg" color="#1F8ACB"></HomeAboutCreditsCardIcon>
                    <HomeAboutCreditsCardIcon profileUrl="https://github.com/" :user=$props.github icon="/assets/github.svg" color="#F05032"></HomeAboutCreditsCardIcon>
                    <HomeAboutCreditsCardIcon profileUrl="https://discord.com/users/" :user=$props.discord icon="/assets/discord.svg" color="#5865F2"></HomeAboutCreditsCardIcon>
                </div>
            </div>
        </DoubleCutCornerContainer>
    </AnimateInContainer>
</template>

<style>
.homeAboutCreditsCardContent {
    display: grid;
    grid-template-rows: 220px 40px 90px 30px;
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
    margin-top: 8px;
    font-size: var(--font-18);
    color: lime;
}

.homeAboutCreditsCardIcons {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
}
</style>