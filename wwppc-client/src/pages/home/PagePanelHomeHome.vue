<script setup lang="ts">
import ScrollIndicator from "@/components/common/ScrollIndicator.vue";
import { AnimateInContainer, CenteredContainer, DoubleCutCornerContainer, ShowOnscreenContainer } from "@/components/ui-defaults/UIContainers";
import { GlitchText, UIDivider, UILinkButton, UIIconButton } from "@/components/ui-defaults/UIDefaults";
import ContactFooter from '@/components/common/ContactFooter.vue';
import HomeHomeSponsorLogo from "@/components/home/home/HomeHomeSponsorLogo.vue";
</script>

<template>
    <div class="centered homeTitle">
        <ShowOnscreenContainer>
            <GlitchText text="WWPPC 2024" font-size="var(--font-huge-title)" color="lime" glow shadow :steps=2 random on-visible></GlitchText>
        </ShowOnscreenContainer>
    </div>
    <div class="fullBlock homeBlock">
        <!-- spacer for title -->
        <div style="height: calc(1.25 * var(--font-huge-title))"></div>
        <div class="homeColumns">
            <div>
                <AnimateInContainer type="slideUp" height="100%" :delay=100>
                    <DoubleCutCornerContainer height="100%" hover-animation="lift">
                        <CenteredContainer height="100%">
                            <div class="homeVertical">
                                <div style="flex-grow: 1;">
                                    <GlitchText text="WWPHacks" font-size="var(--font-subtitle)" color="lime" glow shadow :steps=3 :delay=10 random></GlitchText>
                                    <GlitchText text="??/??/????" font-size="var(--font-subsubtitle)" color="red" glow :steps=1 :delay=Infinity></GlitchText>
                                    <UIDivider color="#AAA"></UIDivider>
                                    <p>
                                        WWPHacks is a hackathon - a collaborative programming competition where teams work against the clock to build innovative solutions to real-world problems.
                                    </p>
                                </div>
                                <div class="centered">
                                    <AnimateInContainer type="fade" :delay=300>
                                        <UILinkButton text="Contest Page" @click="$router.push('/hackathon');" font-size="var(--font-20)" color="lime"></UILinkButton>
                                    </AnimateInContainer>
                                </div>
                            </div>
                        </CenteredContainer>
                    </DoubleCutCornerContainer>
                </AnimateInContainer>
            </div>
            <div>
                <AnimateInContainer type="slideUp" height="100%" :delay=200>
                    <DoubleCutCornerContainer height="100%" hover-animation="lift">
                        <CenteredContainer height="100%">
                            <div class="homeVertical">
                                <div style="flex-grow: 1;">
                                    <GlitchText text="WWPIT" font-size="var(--font-subtitle)" color="lime" glow shadow :steps=3 :delay=10 random></GlitchText>
                                    <GlitchText text="06/02/2024" font-size="var(--font-subsubtitle)" color="red" glow random flashing :delay=10 start-glitched></GlitchText>
                                    <UIDivider color="#AAA"></UIDivider>
                                    <p>
                                        WWPIT is a round-based informatics tournament with multiple divisions targeting competitive programmers of all skill levels.
                                    </p>
                                </div>
                                <div class="centered">
                                    <AnimateInContainer type="fade" :delay=400>
                                        <UILinkButton text="Contest Page" @click="$router.push('/contest');" font-size="var(--font-20)" color="lime"></UILinkButton>
                                    </AnimateInContainer>
                                </div>
                            </div>
                        </CenteredContainer>
                    </DoubleCutCornerContainer>
                </AnimateInContainer>
            </div>
        </div>
        <ScrollIndicator anchor="a[name=pageHomeScrollTo]"></ScrollIndicator>
    </div>
    <div class="fullBlock homeBlock">
        <a name="pageHomeScrollTo"></a>
        <div class="centered">
            <ShowOnscreenContainer>
                <GlitchText text="About WWPPC" font-size="var(--font-title)" color="lime" glow shadow random :steps=2 on-visible></GlitchText>
            </ShowOnscreenContainer>
        </div>
        <div style="flex-grow: 1;">
            <p style="text-wrap: balance;">
                WWPPC is the combined host of WWP-IT and WWPHacks, created by members of West Windsor Plainsboro High School South Coding Club in New Jersey.
            </p>
            <p style="text-wrap: balance;">
                WWPHacks has been featured as an offical <a href="https://mlh.io/" target="_blank">Major League Hacking</a> hackathon in 2021.
            </p>
            <p style="text-wrap: balance;">
                We hope to foster a passion for competitive programming for all through the inaugural WWPIT tournament!
            </p>
            <div class="centered">
                <a href="https://discord.wwppc.tech" target="_blank" style="text-decoration: none;">
                    <UIIconButton text="Join us on Discord!" img="/img/discord-logo.svg" color="lime" font-size="var(--font-medium)" img-hover-color="#5865F2"></UIIconButton>
                </a>
                <a href="https://github.com/WWPPC" target="_blank" style="text-decoration: none;">
                    <UIIconButton text="GitHub" img="/img/github-logo.svg" color="lime" font-size="var(--font-medium)" img-hover-color="#F05032"></UIIconButton>
                </a>
            </div>
        </div>
        <ScrollIndicator anchor="a[name=pageHomeScrollTo2]"></ScrollIndicator>
    </div>
    <div class="fullBlock homeBlock">
        <div class="centered">
            <a name="pageHomeScrollTo2"></a>
            <ShowOnscreenContainer>
                <GlitchText text="Sponsors" font-size="var(--font-title)" color="lime" glow shadow random :steps=2 on-visible></GlitchText>
            </ShowOnscreenContainer>
        </div>
        <div class="sponsors">
            <HomeHomeSponsorLogo src="/img/xyz-logo.svg" url="https://gen.xyz" height="12vh"></HomeHomeSponsorLogo>
            <HomeHomeSponsorLogo src="/img/echo3d-logo.png" url="https://www.echo3d.com/" height="8vh"></HomeHomeSponsorLogo>
            <HomeHomeSponsorLogo src="/img/desmos-logo.svg" url="https://desmos.com/" height="8vh"></HomeHomeSponsorLogo>
            <HomeHomeSponsorLogo src="/img/axure-logo.svg" url="https://axure.com/" height="8vh"></HomeHomeSponsorLogo>
            <HomeHomeSponsorLogo src="/img/cpi-logo.svg" url="https://joincpi.org/" height="14vh"></HomeHomeSponsorLogo>
        </div>
        <div style="flex-grow: 1;"></div>
        <ContactFooter></ContactFooter>
    </div>
</template>

<style scoped>
.homeBlock {
    display: flex;
    flex-direction: column;
}

.homeTitle {
    position: absolute;
    top: 0px;
    left: 0px;
    transform-origin: top;
    transform: translate3D(0px, -20vh, -50px) scale(150%);
    z-index: -1;
}

.homeColumns {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-auto-flow: row;
    row-gap: 24px;
    column-gap: 24px;
    flex-grow: 1;
}

.homeColumns>div {
    height: 100%;
}

@media (max-width: 100vh) {
    .homeColumns {
        grid-template-columns: 1fr;
        grid-template-rows: min-content min-content;
        grid-auto-flow: column;
    }
}

.homeVertical {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-items: stretch;
}

p {
    text-align: center;
}

.sponsors {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    row-gap: 25px;
    column-gap: 50px;
    padding: 2% 10%;
}
</style>