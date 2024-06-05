<script setup lang="ts">
import ScrollIndicator from '@/components/common/ScrollIndicator.vue';
import { AnimateInContainer, CenteredContainer, DoubleCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import { GlowText, GlitchText, UIDivider, UILinkButton, UIIconButton, UISponsorLogo } from '@/components/ui-defaults/UIDefaults';
import ContactFooter from '@/components/common/ContactFooter.vue';
import { nextContest, nextContestEnd } from '@/scripts/ContestManager';
</script>

<template>
    <div class="fullBlock homeBlock">
        <GlitchText text="WWPPC 2024" class="homeTitle" font-size="var(--font-huge-title)" color="lime" glow shadow :delay=10 :steps=2 random on-visible></GlitchText>
        <div class="homeColumns">
            <AnimateInContainer type="slideUp" show-on-screen :delay=100>
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
                            <div style="display: flex; flex-direction: column;">
                                <GlowText text="" font-size="var(--font-28)" color="lime" glow flashing></GlowText>
                                <div class="centered" style="margin-top: 0.5em;">
                                    <AnimateInContainer type="fade" :delay=400>
                                        <UILinkButton text="Contest Page" @click="$router.push('/hackathon');" font-size="var(--font-large)" color="lime"></UILinkButton>
                                    </AnimateInContainer>
                                </div>
                            </div>
                        </div>
                    </CenteredContainer>
                </DoubleCutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen :delay=200>
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
                            <div style="display: flex; flex-direction: column;">
                                <GlitchText text="Registrations open!" font-size="var(--font-28)" color="lime" glow flashing random v-if="Date.now() < nextContest.getTime()"></GlitchText>
                                <GlitchText text="Contest ended!" font-size="var(--font-28)" color="red" glow random v-else-if="Date.now() > nextContestEnd.getTime()"></GlitchText>
                                <GlitchText text="Contest started!" font-size="var(--font-28)" color="lime" glow flashing flash-color="red" random v-else></GlitchText>
                                <div class="centered" style="margin-top: 0.5em;">
                                    <AnimateInContainer type="fade" :delay=400>
                                        <UILinkButton text="Contest Page" @click="$router.push('/contest');" font-size="var(--font-large)" color="lime"></UILinkButton>
                                    </AnimateInContainer>
                                </div>
                            </div>
                        </div>
                    </CenteredContainer>
                </DoubleCutCornerContainer>
            </AnimateInContainer>
        </div>
        <ScrollIndicator anchor="a[name=pageHomeScrollTo]"></ScrollIndicator>
    </div>
    <div class="fullBlock homeBlock">
        <a name="pageHomeScrollTo"></a>
        <div class="centered">
            <GlitchText text="About WWPPC" font-size="var(--font-title)" color="lime" glow shadow random :steps=2 on-visible></GlitchText>
        </div>
        <div class="homeGeneralInfoColumns" style="font-size: var(--font-medium);">
            <AnimateInContainer type="slideUp" show-on-screen style="grid-row: span 2;">
                <DoubleCutCornerContainer height="100%" hover-animation="lift">
                    <div class="centered" style="height: 4em;">
                        <img src="/icon2.png">
                    </div>
                    <p style="text-wrap: balanced;">
                        WWPPC is a programming competition consisting of WWPHacks and WWPIT, created by members of the WW-P HSS Absolute Coding Club in New Jersey.
                    </p>
                    <p style="text-wrap: balanced; color: lime;">
                        WWPPC is a 501c3 nonprofit organization.
                    </p>
                </DoubleCutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <DoubleCutCornerContainer height="100%" hover-animation="lift">
                    <div class="centered" style="height: 2em;">
                        <img src="/img/mlh-logo.svg">
                    </div>
                    <p style="text-wrap: balanced;">
                        WWPHacks has been featured as an offical <a href="https://mlh.io/" target="_blank">Major League Hacking</a> hackathon in 2022.
                    </p>
                </DoubleCutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen style="grid-row: span 2;">
                <DoubleCutCornerContainer height="100%" hover-animation="lift">
                    <p style="text-wrap: balance; font-size: var(--font-20);">
                        <span style="color: lime;">WWPPC</span>:
                        West Windsor-Plainsboro Programming Contests
                    </p>
                    <p style="text-wrap: balance; font-size: var(--font-20);">
                        <span style="color: lime;">WWPIT</span>:
                        West Windsor-Plainsboro Informatics Tournament
                    </p>
                    <p style="text-wrap: balance; font-size: var(--font-20);">
                        <span style="color: lime;">WWPHacks</span>:
                        WWPHacks <i>(not an acronym)</i>
                    </p>
                    <UIDivider></UIDivider>
                    <p style="text-wrap: balance; font-size: var(--font-16);">
                        <i>WWPPC is not affiliated with or endorsed by the West Windsor-Plainsboro Regional School District</i>
                    </p>
                </DoubleCutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <DoubleCutCornerContainer height="100%" hover-animation="lift">
                    <div style="text-align: center;">
                        <a href="https://discord.wwppc.tech" target="_blank" class="centered" style="text-decoration: none;">
                            <UIIconButton text="Join us on Discord!" img="/img/discord-logo.svg" color="lime" font-size="var(--font-medium)" img-hover-color="#5865F2"></UIIconButton>
                        </a>
                        <div style="height: 0.5em;"></div>
                        <a href="https://github.com/WWPPC" target="_blank" class="centered" style="text-decoration: none;">
                            <UIIconButton text="GitHub" img="/img/github-logo.svg" color="lime" font-size="var(--font-medium)" img-hover-color="#F05032"></UIIconButton>
                        </a>
                    </div>
                </DoubleCutCornerContainer>
            </AnimateInContainer>
        </div>
        <ScrollIndicator anchor="a[name=pageHomeScrollTo2]"></ScrollIndicator>
    </div>
    <div class="fullBlock homeBlock">
        <div class="centered">
            <a name="pageHomeScrollTo2"></a>
            <GlitchText text="Sponsors" font-size="var(--font-title)" color="lime" glow shadow random :steps=2 on-visible></GlitchText>
        </div>
        <div class="sponsorColumns">
            <div>
                <GlowText text="PARTNERS" font-size="var(--font-huge)" color="lime" shadow></GlowText>
                <UISponsorLogo src="/img/cpi-logo.svg" url="https://joincpi.org/" height="12vh"></UISponsorLogo>
            </div>
            <div>
                <GlowText text="GOLD" font-size="var(--font-huge)" color="#FD0" shadow></GlowText>
                <UISponsorLogo src="/img/x-camp-logo.png" url="https://x-camp.academy/" height="10vh"></UISponsorLogo>
            </div>
            <div>
                <GlowText text="SILVER" font-size="var(--font-huge)" color="#CCC" shadow></GlowText>
                <UISponsorLogo src="/img/icode-logo.png" url="https://icodeschool.com/" height="10vh"></UISponsorLogo>
            </div>
        </div>
        <UIDivider color="#AAA"></UIDivider>
        <div class="sponsors">
            <UISponsorLogo src="/img/desmos-logo.svg" url="https://desmos.com/" height="5.5vh"></UISponsorLogo>
            <UISponsorLogo src="/img/aops-logo.svg" url="https://artofproblemsolving.com/" height="12vh"></UISponsorLogo>
            <UISponsorLogo src="/img/xyz-logo.svg" url="https://gen.xyz" height="9vh"></UISponsorLogo>
            <UISponsorLogo src="/img/echo3d-logo.png" url="https://www.echo3d.com/" height="5.5vh"></UISponsorLogo>
            <UISponsorLogo src="/img/axure-logo.svg" url="https://axure.com/" height="6vh"></UISponsorLogo>
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
    transform-origin: top;
    transform: translate3D(0px, -20vh, -50px) scale(150%);
    z-index: -1;
    text-align: center;
}

.homeColumns {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    row-gap: 24px;
    column-gap: 24px;
    flex-grow: 1;
}

@media (max-width: 100vh) {
    .homeColumns {
        grid-template-columns: 1fr;
        grid-template-rows: min-content min-content;
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

.homeGeneralInfoColumns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    flex-grow: 1;
    justify-items: stretch;
    row-gap: 24px;
    column-gap: 24px;
}

.sponsorColumns {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 0px 5%;
}

.sponsorColumns>div {
    width: 40vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.sponsors {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    row-gap: 25px;
    column-gap: 50px;
    padding: 0px 5%;
}
</style>