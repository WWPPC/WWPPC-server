<script setup lang="ts">
import ScrollIndicator from "@/components/ScrollIndicator.vue";
import { AnimateInContainer, CenteredContainer, DoubleCutCornerContainer, IfOnscreenContainer } from "@/components/ui-defaults/UIContainers";
import { GlitchText, UIDivider, UILinkButton, UIIconButton } from "@/components/ui-defaults/UIDefaults";
import ContactFooter from '@/components/ContactFooter.vue';
</script>

<template>
    <div class="centered homeTitle">
        <IfOnscreenContainer>
            <GlitchText text="WWPPC 2024" font-size="var(--font-huge-title)" color="lime" glow shadow :steps=2 :delay=300 random></GlitchText>
        </IfOnscreenContainer>
    </div>
    <div class="fullBlock homeBlock">
        <!-- spacer for title -->
        <div style="height: calc(1.25 * var(--font-huge-title))"></div>
        <div class="homeColumns">
            <AnimateInContainer type="slideUp" :delay=200>
                <DoubleCutCornerContainer style="height: 100%" hover-animation="lift">
                    <CenteredContainer style="height: 100%">
                        <div class="homeVertical">
                            <div style="flex-grow: 1;">
                                <GlitchText text="WWP-Hacks" font-size="var(--font-subtitle)" color="lime" glow shadow :steps=3 :delay=300 random></GlitchText>
                                <GlitchText text="??/??/????" font-size="var(--font-subsubtitle)" color="red" glow :steps=1 :delay=Infinity></GlitchText>
                                <UIDivider color="#AAA"></UIDivider>
                                <p>
                                    WWPHacks is a hackathon - a collaborative programming competition where teams work against the clock to build innovative solutions to real-world problems.
                                </p>
                            </div>
                            <div class="centered">
                                <AnimateInContainer type="fade" :delay=400>
                                    <UILinkButton text="Contest Page" @click="$router.push('/hackathon');" font-size="var(--font-24)" color="lime"></UILinkButton>
                                </AnimateInContainer>
                            </div>
                        </div>
                    </CenteredContainer>
                </DoubleCutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" :delay=100>
                <DoubleCutCornerContainer style="height: 100%" hover-animation="lift">
                    <CenteredContainer style="height: 100%">
                        <div class="homeVertical">
                            <div style="flex-grow: 1;">
                                <GlitchText text="WWP-IT" font-size="var(--font-subtitle)" color="lime" glow shadow :steps=3 :delay=300 random></GlitchText>
                                <GlitchText text="??/??/????" font-size="var(--font-subsubtitle)" color="red" glow :steps=1 :delay=Infinity></GlitchText>
                                <UIDivider color="#AAA"></UIDivider>
                                <p>
                                    WWPIT is a round-based informatics tournament with multiple divisions targeting competitive programmers of all skill levels.
                                </p>
                            </div>
                            <div class="centered">
                                <AnimateInContainer type="fade" :delay=300>
                                    <UILinkButton text="Contest Page" @click="$router.push('/contest');" font-size="var(--font-medium)" color="lime"></UILinkButton>
                                </AnimateInContainer>
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
            <IfOnscreenContainer>
                <GlitchText text="About WWPPC" font-size="var(--font-title)" color="lime" glow shadow random :steps=1></GlitchText>
            </IfOnscreenContainer>
        </div>
        <div style="flex-grow: 1;">
            <p>
                WWPPC is the combined hosts of WWP-IT and WWPHacks, created by members of West Windsor Plainsboro High School South Coding Club.
            </p>
            <p>
                WWPHacks has been featured as an offical <a href="https://mlh.io/" target="_blank">Major League Hacking</a> hackathon in 2021.
            </p>
            <p>
                We hope to foster a passion for competitive programming for all through the inaugural WWPIT tournament!
            </p>
            <p style="text-align: center;">
                <a href="https://discord.gg/rv23HbH7rB" target="_blank" style="text-decoration: none;">
                    <UIIconButton text="Join us on Discord!" img="/assets/discord.svg" color="lime" font-size="var(--font-medium)"></UIIconButton>
                </a>
                <a href="https://github.com/WWPPC" target="_blank" style="text-decoration: none;">
                    <UIIconButton text="GitHub" img="/assets/github.svg" color="lime" font-size="var(--font-medium)"></UIIconButton>
                </a>
                These buttons hate being centered
            </p>
        </div>
        <ScrollIndicator anchor="a[name=pageHomeScrollTo2]"></ScrollIndicator>
    </div>
    <div class="fullBlock homeBlock">
        <div class="centered">
            <a name="pageHomeScrollTo2"></a>
            <IfOnscreenContainer>
                <GlitchText text="Sponsors" font-size="var(--font-title)" color="lime" glow shadow random :steps=1></GlitchText>
            </IfOnscreenContainer>
        </div>
        <div style="flex-grow: 1;">
            <CenteredContainer>
                <!-- if saya gets us a sponsor then put them here -->
            </CenteredContainer>
        </div>
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

@media (max-width: 100vh) {
    .homeColumns {
        grid-template-columns: 1fr;
        grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
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
</style>