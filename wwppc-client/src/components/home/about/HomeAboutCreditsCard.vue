<script setup lang="ts">
import { AnimateInContainer, DoubleCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import HomeAboutCreditsCardIcon from './HomeAboutCreditsCardIcon.vue';

defineProps<{
    name: string,
    roles: string,
    codeforces?: string,
    github?: string,
    discord?: string,
    youtube?: string,
    img: string
}>();
</script>

<template>
    <AnimateInContainer type="slideUp" show-on-screen single>
        <DoubleCutCornerContainer hover-animation="lift">
            <div class="cardContent">
                <img :src=$props.img class="cardImage">
                <div class="cardName">{{ $props.name }}</div>
                <div class="cardRoles" v-html=$props.roles></div>
                <div class="cardIcons">
                    <HomeAboutCreditsCardIcon profileUrl="https://codeforces.com/profile/" :user=$props.codeforces icon="/img/codeforces-logo.svg" color="#1F8ACB"></HomeAboutCreditsCardIcon>
                    <HomeAboutCreditsCardIcon profileUrl="https://github.com/" :user=$props.github icon="/img/github-logo.svg" color="#F05032"></HomeAboutCreditsCardIcon>
                    <HomeAboutCreditsCardIcon profileUrl="https://discord.com/users/" :user=$props.discord icon="/img/discord-logo.svg" color="#5865F2"></HomeAboutCreditsCardIcon>
                    <HomeAboutCreditsCardIcon profileUrl="https://youtube.com/" :user=$props.youtube icon="/img/youtube-logo.svg" color="#FF0000"></HomeAboutCreditsCardIcon>
                </div>
            </div>
        </DoubleCutCornerContainer>
    </AnimateInContainer>
</template>

<style scoped>
.cardContent {
    display: grid;
    grid-template-rows: 220px 40px 90px 30px;
    justify-items: center;
    width: 280px;
    height: 380px;
}

.cardImage {
    width: 212px;
    height: 212px;
    border: 4px solid white;
}

.cardName {
    margin-top: 8px;
    width: 100%;
    text-align: center;
    text-wrap: nowrap;
    font-size: var(--font-24);
    font-weight: bold;
    color: lime;
}

.cardRoles {
    text-align: center;
    margin-top: 8px;
    font-size: var(--font-18);
    color: lime;
}

.cardIcons {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
}
</style>