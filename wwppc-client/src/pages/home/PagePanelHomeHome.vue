<script setup lang="ts">
import ScrollIndicator from "@/components/ScrollIndicator.vue";
import { AnimateInContainer, CenteredContainer, DoubleCutCornerContainer } from "@/components/ui-defaults/UIContainers";
import { GlitchText, UIDivider, UILinkButton } from "@/components/ui-defaults/UIDefaults";
</script>

<template>
    <div class="fullBlock homeBlock">
        <div class="centered">
            <GlitchText text="WWPPC 2024" font-size="min(20vh, calc(100vw / 8))" color="lime" glow shadow :steps=2 :delay=300 random></GlitchText>
        </div>
        <div class="homeColumns">
            <AnimateInContainer type="slideUp" :delay=100>
                <DoubleCutCornerContainer style="height: 100%" hover-animation="swell">
                    <CenteredContainer style="height: 100%">
                        <div class="homeVertical">
                            <div style="flex-grow: 1;">
                                <GlitchText text="WWPIT" font-size="min(7vh, calc(50vw / 5))" color="lime" glow shadow :steps=3 :delay=300 random></GlitchText>
                                <GlitchText text="??/??/????" font-size="min(5vh, calc(50vw / 10))" color="red" glow :steps=1 :delay=Infinity></GlitchText>
                                <UIDivider color="#AAA"></UIDivider>
                                <p style="font-size: 20px;">
                                    WWPIT is a round-based informatics tournament with multiple divisions targeting competitive programmers of all skill levels.
                                </p>
                            </div>
                            <div class="centered">
                                <AnimateInContainer type="fade" :delay=300>
                                    <UILinkButton text="Learn More" @click="$router.push('/contest');" font-size="20px" color="lime"></UILinkButton>
                                </AnimateInContainer>
                            </div>
                        </div>
                    </CenteredContainer>
                </DoubleCutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" :delay=200>
                <DoubleCutCornerContainer style="height: 100%" hover-animation="swell">
                    <CenteredContainer style="height: 100%">
                        <div class="homeVertical">
                            <div style="flex-grow: 1;">
                                <GlitchText text="WWPHacks" font-size="min(7vh, calc(50vw / 5))" color="lime" glow shadow :steps=3 :delay=300 random></GlitchText>
                                <GlitchText text="??/??/????" font-size="min(5vh, calc(50vw / 10))" color="red" glow :steps=1 :delay=Infinity></GlitchText>
                                <UIDivider color="#AAA"></UIDivider>
                                <p style="font-size: 20px;">
                                    WWPHacks is a hackathon - a collaborative programming competition where teams work against the clock to build innovative solutions to real-world problems.
                                </p>
                            </div>
                            <div class="centered">
                                <AnimateInContainer type="fade" :delay=400>
                                    <UILinkButton text="Learn More" @click="$router.push('/hackathon');" font-size="20px" color="lime"></UILinkButton>
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
        <div class="center" style="text-align: center; font-size: 120%">
            West Windsor-Plainsboro Programming Competition (WWPPC), comprised of the WWP Informatics Tournament (WWPIT) and
            WWPHacks, will be held eventually in 2024. Join us on <a href="https://discord.gg/rv23HbH7rB">Discord</a>!
        </div>
        <!-- we need more here, specifically about what WWPPC is as a whole (mission statement?) -->
        <!-- just copy the discord button from wwphacks or something -->
        <!-- make sure to add row of contact buttons (email?) -->
    </div>
</template>

<style scoped>
.homeBlock {
    display: flex;
    flex-direction: column;
    justify-items: stretch;
    min-height: 100%;
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
</style>