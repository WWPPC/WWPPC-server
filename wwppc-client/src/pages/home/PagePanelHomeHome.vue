<script setup lang="ts">
import ScrollIndicator from "@/components/ScrollIndicator.vue";
import { AnimateInContainer, CenteredContainer, CutCornerContainer } from "@/components/ui-defaults/UIContainers";
import { GlitchText, UIDivider, UILinkButton } from "@/components/ui-defaults/UIDefaults";
</script>

<template>
    <div class="fullBlock pagePanelHomeBlock1">
        <div class="centered">
            <GlitchText text="WWPPC 2024" font-size="min(20vh, calc(100vw / 8))" color="lime" glow shadow :steps=2 :delay=300 :random=true></GlitchText>
        </div>
        <AnimateInContainer type="slideUp" style="flex-grow: 1;">
            <div class="pagePanelHomeSideBySide">
                <CutCornerContainer>
                    <CenteredContainer style="height: 100%">
                        <div class="pagePanelHomeVerticalAlign">
                            <div style="flex-grow: 1;">
                                <GlitchText text="WWPIT" font-size="min(7vh, calc(50vw / 5))" glow shadow color="lime"></GlitchText>
                                <GlitchText text="??/??/????" font-size="min(5vh, calc(50vw / 10))" color="red" glow :steps=1 :delay=Infinity></GlitchText>
                                <UIDivider color="#AAA"></UIDivider>
                                <p style="font-size: 20px;">
                                    WWPIT is a round-based informatics tournament with multiple divisions targeting competitive programmers of all skill levels.
                                </p>
                            </div>
                            <div class="centered">
                                <UILinkButton text="Learn More" @click="$router.push('/contest');" font-size="20px" color="lime"></UILinkButton>
                            </div>
                        </div>
                    </CenteredContainer>
                </CutCornerContainer>
                <CutCornerContainer animate-in="slideUp">
                    <CenteredContainer>
                        <div class="pagePanelHomeVerticalAlign">
                            <div style="flex-grow: 1;">
                                <GlitchText text="WWPHacks" font-size="min(7vh, calc(50vw / 5))" color="lime" glow shadow></GlitchText>
                                <GlitchText text="??/??/????" font-size="min(5vh, calc(50vw / 10))" color="red" glow :steps=1 :delay=Infinity></GlitchText>
                                <UIDivider color="#AAA"></UIDivider>
                                <p style="font-size: 20px;">
                                    WWPHacks is a hackathon - a collaborative programming competition where teams work against the clock to build innovative solutions to real-world problems.
                                </p>
                            </div>
                            <div class="centered">
                                <UILinkButton text="Learn More" @click="$router.push('/hackathon');" font-size="20px" color="lime"></UILinkButton>
                            </div>
                        </div>
                    </CenteredContainer>
                </CutCornerContainer>
            </div>
        </AnimateInContainer>
        <div class="centered pagePanelHomeScrollIndicatorWrapper">
            <ScrollIndicator anchor="a[name=pageHomeScrollTo]"></ScrollIndicator>
        </div>
    </div>
    <div class="fullBlock">
        <a name="pageHomeScrollTo"></a>
        <div class="center" style="text-align: center; font-size: 120%">
            West Windsor-Plainsboro Programming Competition (WWPPC), comprised of the WWP Informatics Tournament (WWPIT) and
            WWPHacks, will be held eventually in 2024. Join us on <a href="https://discord.gg/rv23HbH7rB">Discord</a>!
        </div>
    </div>
</template>

<style>
.pagePanelHomeBlock1 {
    display: flex;
    flex-direction: column;
    justify-items: stretch;
    min-height: 100%;
}

.pagePanelHomeSideBySide {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 24px;
    column-gap: 24px;
}

@media (max-width: 100vh) {
    .pagePanelHomeSideBySide {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
    }
    .pagePanelHomeScrollIndicatorWrapper {
        display: none;
    }
}

.pagePanelHomeVerticalAlign {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-items: stretch;
}
</style>