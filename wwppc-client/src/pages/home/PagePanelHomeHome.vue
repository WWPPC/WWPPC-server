<script setup lang="ts">
import ScrollIndicator from "@/components/ScrollIndicator.vue";
import { AnimateInContainer, CenteredContainer, DoubleCutCornerContainer, ShowOnscreenContainer, TitledCollapsible } from "@/components/ui-defaults/UIContainers";
import { GlitchText, UIDivider, UILinkButton, UIIconButton } from "@/components/ui-defaults/UIDefaults";
</script>

<template>
    <div class="centered homeTitle">
        <GlitchText text="WWPPC 2024" font-size="min(20vh, calc(100vw / 8))" color="lime" glow shadow :steps=2 :delay=300 random></GlitchText>
    </div>
    <div class="fullBlock homeBlock">
        <!-- spacer for title -->
        <div style="height: min(25vh, calc(125vw / 8));"></div>
        <div class="homeColumns">
            <AnimateInContainer type="slideUp" :delay=100 single>
                <DoubleCutCornerContainer style="height: 100%" hover-animation="swell">
                    <CenteredContainer style="height: 100%">
                        <div class="homeVertical">
                            <div style="flex-grow: 1;">
                                <GlitchText text="WWP-IT" font-size="min(7vh, calc(50vw / 5))" color="lime" glow shadow :steps=3 :delay=300 random></GlitchText>
                                <GlitchText text="??/??/????" font-size="min(5vh, calc(50vw / 10))" color="red" glow :steps=1 :delay=Infinity></GlitchText>
                                <UIDivider color="#AAA"></UIDivider>
                                <p style="font-size: min(20px, calc(50vw / 10))" >
                                    WWPIT is a round-based informatics tournament with multiple divisions targeting competitive programmers of all skill levels.
                                </p>
                            </div>
                            <div class="centered">
                                <AnimateInContainer type="fade" :delay=300 single>
                                    <UILinkButton text="Learn More" @click="$router.push('/contest');" font-size="min(24px, calc(50vw / 5))" color="lime"></UILinkButton>
                                </AnimateInContainer>
                            </div>
                        </div>
                    </CenteredContainer>
                </DoubleCutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" :delay=200 single>
                <DoubleCutCornerContainer style="height: 100%" hover-animation="swell">
                    <CenteredContainer style="height: 100%">
                        <div class="homeVertical">
                            <div style="flex-grow: 1;">
                                <GlitchText text="WWP-Hacks" font-size="min(7vh, calc(50vw / 5))" color="lime" glow shadow :steps=3 :delay=300 random></GlitchText>
                                <GlitchText text="??/??/????" font-size="min(5vh, calc(50vw / 10))" color="red" glow :steps=1 :delay=Infinity></GlitchText>
                                <UIDivider color="#AAA"></UIDivider>
                                <p style="font-size: min(20px, calc(50vw / 10))">
                                    WWPHacks is a hackathon - a collaborative programming competition where teams work against the clock to build innovative solutions to real-world problems.
                                </p>
                            </div>
                            <div class="centered">
                                <AnimateInContainer type="fade" :delay=400 single>
                                    <UILinkButton text="Learn More" @click="$router.push('/hackathon');" font-size="min(24px, calc(50vw / 5))" color="lime"></UILinkButton>
                                </AnimateInContainer>
                            </div>
                        </div>
                    </CenteredContainer>
                </DoubleCutCornerContainer>
            </AnimateInContainer>
        </div>
        <div class="centered homeScrollIndicator">
            <AnimateInContainer type="fade" :delay=1000>
                <ScrollIndicator anchor="a[name=pageHomeScrollTo]"></ScrollIndicator>
            </AnimateInContainer>
        </div>
    </div>
    <div class="fullBlock">
        <a name="pageHomeScrollTo"></a>
        <CenteredContainer style="font-size: 24px">
            West Windsor-Plainsboro Programming Competition (WWPPC), comprised of the WWP Informatics Tournament (WWPIT) and
            WWPHacks, will be held virtually in 2024!
            <div class="centered" style="margin-top: 16px">
                <a href="https://discord.gg/rv23HbH7rB" target="_blank" style="text-decoration: none;">
                    <UIIconButton text="Join us on Discord!" img="/assets/discord-white.svg" color="lime" font-size="24px"></UIIconButton>
                </a>
                <!-- other contact methods -->
            </div>
        </CenteredContainer>
        <UIDivider margin="32px"></UIDivider>
        <CenteredContainer>
            <ShowOnscreenContainer>
                <GlitchText text="FAQ" font-size="min(15vh, calc(100vw / 8))" color="lime" glow shadow random :steps=1></GlitchText>
            </ShowOnscreenContainer>
        </CenteredContainer>
        <div class="homeFAQ">
            <div class="homeFAQ">
                <h2 class="centered">WWPIT</h2>
                <AnimateInContainer type="slideUp" single>
                    <TitledCollapsible title="When is it?" height="100%" startCollapsed>
                        Eventually in 2024
                        <br>
                        <br>
                    </TitledCollapsible>
                </AnimateInContainer>
                <AnimateInContainer type="slideUp" single>
                    <TitledCollapsible title="Where will it be held?" height="100%" startCollapsed>
                        WWPIT will be held online.
                    </TitledCollapsible>
                </AnimateInContainer>
                <AnimateInContainer type="slideUp" single>
                    <TitledCollapsible title="What is the contest format?" height="100%" startCollapsed>
                        Teams of up to x participants will participate in six successively harder rounds of Codeforces-style informatics problems in Novice and Advanced divisions.
                    </TitledCollapsible>
                </AnimateInContainer>
            </div>
            <div class="homeFAQ">
                <h2 class="centered">WWPHacks</h2>
                <AnimateInContainer type="slideUp" single>
                    <TitledCollapsible title="When is it?" height="100%" startCollapsed>
                        Eventually in 2024
                        <br>
                        <br>
                    </TitledCollapsible>
                </AnimateInContainer>
                <AnimateInContainer type="slideUp" single>
                    <TitledCollapsible title="Where will it be held?" height="100%" startCollapsed>
                        WWPHacks is TBD.
                    </TitledCollapsible>
                </AnimateInContainer>
            </div>
        </div>
        <div class="centered">
        </div>
        <!-- more content needed, esp. mission statement -->
    </div>
</template>

<style scoped>
.homeBlock {
    display: flex;
    flex-direction: column;
    justify-items: stretch;
    min-height: 100%;
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
    grid-template-columns: 1fr 1fr;
    row-gap: 24px;
    column-gap: 24px;
    flex-grow: 1;
}

@media (max-width: 100vh) {
    .homeColumns {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
    }

    .homeScrollIndicator {
        display: none;
    }
}

.homeVertical {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-items: stretch;
}

.homeFAQ {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr));
    align-items: start;
    row-gap: 24px;
    column-gap: 24px;
}
</style>