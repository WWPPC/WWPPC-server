<script setup lang="ts">
import { AnimateInContainer, DoubleCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import HomeAboutCreditsCardIcon from './HomeAboutCreditsCardIcon.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineProps<{
    name: string
    username: string
    roles: string
    codeforces?: string
    github?: string
    discord?: string
    youtube?: string
    bio: string
    img: string
}>();

const router = useRouter();

const slightlyFunAnimation = ref(Math.random() < 0.001);
const funAnimation = ref(Math.random() < 0.001);
</script>

<template>
    <AnimateInContainer type="slideUp" show-on-screen single>
        <div class="cardContainer">
            <div class="card">
                <div class="cardBack">
                    <DoubleCutCornerContainer flipped class="cardFaceContainer">
                        <div class="cardContent2">
                            <div class="cardBio">
                                <span class="cardUserLink" @click="router.push('/user/@' + $props.username)">@{{ $props.username }}</span>
                                <br>
                                {{ $props.bio }}
                            </div>
                            <div class="cardIcons">
                                <HomeAboutCreditsCardIcon profileUrl="https://codeforces.com/profile/" :user=$props.codeforces icon="/img/codeforces-logo.svg" color="#1F8ACB"></HomeAboutCreditsCardIcon>
                                <HomeAboutCreditsCardIcon profileUrl="https://github.com/" :user=$props.github icon="/img/github-logo.svg" color="#F05032"></HomeAboutCreditsCardIcon>
                                <HomeAboutCreditsCardIcon profileUrl="https://discord.com/users/" :user=$props.discord icon="/img/discord-logo.svg" color="#5865F2"></HomeAboutCreditsCardIcon>
                                <HomeAboutCreditsCardIcon profileUrl="https://youtube.com/" :user=$props.youtube icon="/img/youtube-logo.svg" color="#FF0000"></HomeAboutCreditsCardIcon>
                            </div>
                        </div>
                    </DoubleCutCornerContainer>
                </div>
                <div class="cardFront">
                    <DoubleCutCornerContainer class="cardFaceContainer">
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
                </div>
                <div class="cardTop"></div>
                <div class="cardBottom"></div>
                <div class="cardLeft"></div>
                <div class="cardRight"></div>
                <div class="cardCorner1"></div>
                <div class="cardCorner2"></div>
            </div>
        </div>
    </AnimateInContainer>
</template>

<style scoped>
.cardContainer {
    perspective: 1000px;
    width: 312px;
    height: 412px;
}

.card {
    position: relative;
    width: 312px;
    height: 412px;
    transition: v-bind("slightlyFunAnimation ? '3000ms cubic-bezier(1, 0, 1, 1) transform' : '500ms ease transform'");
    transform-style: preserve-3d;
}

.cardContainer:hover>.card {
    transform: v-bind("slightlyFunAnimation ? 'rotateY(165deg) rotateY(5deg)' : 'rotateY(180deg)'");
    animation-name: spinny-carrier;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-duration: v-bind("funAnimation ? '500ms' : ''");
}

@keyframes spinny-carrier {
    from {
        transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
    }
    to {
        transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg);
    }
}

.cardFront,
.cardBack,
.cardTop,
.cardBottom,
.cardLeft,
.cardRight,
.cardCorner1,
.cardCorner2 {
    position: absolute;
    top: 0px;
    left: 0px;
}

.cardFront,
.cardBack {
    width: 312px;
    height: 412px;
}

.cardFront {
    transform: translateZ(10px);
}

.cardBack {
    transform: translateZ(-10px) rotateY(180deg);
}

.cardTop,
.cardBottom,
.cardLeft,
.cardRight,
.cardCorner1,
.cardCorner2 {
    height: 20px;
    transform-origin: 0 0;
    background-color: white;
}

.cardTop,
.cardBottom {
    width: 280px;
    transform: translateZ(-10px) rotateX(90deg) translateX(32px);
}

.cardBottom {
    transform: translateZ(-10px) rotateX(90deg) translateZ(-412px);
}

.cardLeft,
.cardRight {
    width: 380px;
    transform: translateZ(-10px) rotateX(90deg) rotateY(90deg) translateX(32px);
}

.cardRight {
    transform: translateZ(-10px) rotateX(90deg) rotateY(90deg) translateZ(312px);
}

.cardCorner1,
.cardCorner2 {
    width: calc(32px * sqrt(2));
    transform: translateZ(-10px) rotateX(90deg) translateZ(-32px) rotateY(-45deg);
}

.cardCorner2 {
    transform: translateZ(-10px) rotateX(90deg) translateZ(-412px) translateX(280px) rotateY(-45deg);
}

.cardFaceContainer {
    width: 312px;
    height: 412px;
}

.cardContent {
    display: grid;
    grid-template-rows: 220px 40px 90px 30px;
    justify-items: center;
    width: 280px;
    height: 380px;
}

.cardContent2 {
    display: grid;
    grid-template-rows: 350px 30px;
    justify-items: center;
    width: 280px;
    height: 380px;
}

.cardBio {
    text-align: center;
    font-size: var(--font-medium);
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

.cardUserLink {
    color: lime;
    line-height: 1.5em;
    cursor: pointer;
}
</style>