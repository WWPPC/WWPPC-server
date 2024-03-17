<script setup lang="ts">
import ScrollIndicator from '@/components/ScrollIndicator.vue';
import { AnimateInContainer, CenteredContainer, IfOnscreenContainer, TitledDoubleCutCornerContainer, CutCornerContainer, TitledCollapsible } from '@/components/ui-defaults/UIContainers';
import { GlitchText, UILinkButton } from '@/components/ui-defaults/UIDefaults';
</script>

<template>
    <div class="centered hackathonTitle">
        <IfOnscreenContainer>
            <GlitchText text="WWP HACKS" font-size="var(--font-title)" color="lime" shadow glow :steps=1 :delay=400 random></GlitchText>
        </IfOnscreenContainer>
    </div>
    <div class="fullBlock stretchBlock">
        <!-- spacer -->
        <div style="height: calc(1.25 * var(--font-title))"></div>
        <div class="hacksInfoBlock">
            <AnimateInContainer type="slideUp" :delay=100 style="grid-row: span 2;">
                <TitledDoubleCutCornerContainer title="Come hack with us!" align="center" height="100%" hover-animation="lift">
                    <p>
                        WWPHacks is a hackathon where programmers compete to develop technological solutions to real-world problems within 24 hours. Teams will build projects, attend workshops, and compete for prizes. Judges will evaluate the projects, with winners receiving interesting awards. At the end of the day, participants be leaving the hackathon with technical experience, new friends, and the feeling of fulfillment.
                    </p>
                </TitledDoubleCutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" :delay=200>
                <TitledDoubleCutCornerContainer title="2024 Season" align="center" height="100%" hover-animation="lift" flipped>
                    <div class="centered">
                        <GlitchText text="??/??/????" font-size="min(5vh, calc(50vw / 10))" color="red" glow :steps=1 :delay=Infinity></GlitchText>
                    </div>
                </TitledDoubleCutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" :delay=300>
                <CutCornerContainer height="100%" hover-animation="lift" vertical-flipped>
                    <UILinkButton text="Register"></UILinkButton>
                    <!-- mailing list? -->
                    <!-- other contact information? -->
                    <!-- how to hackathon resources? -->
                    <!-- do something similar to the wwpit homepage -->
                </CutCornerContainer>
            </AnimateInContainer>
        </div>
        <ScrollIndicator anchor="a[name=pageHackathonScrollTo]"></ScrollIndicator>
    </div>
    <div class="fullBlock">
        <a name="pageHackathonScrollTo"></a>
        <CenteredContainer>
            <IfOnscreenContainer>
                <GlitchText text="FAQ" font-size="min(15vh, calc(100vw / 8))" color="lime" glow shadow random :steps=1></GlitchText>
            </IfOnscreenContainer>
        </CenteredContainer>
        <div class="faq">
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="When is it?" height="100%" startCollapsed>
                    <i>wink</i>
                </TitledCollapsible>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="Where will it be held?" height="100%" startCollapsed>
                    We don't know yet, check back later!
                </TitledCollapsible>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="How many people can be on a team?" height="100%" startCollapsed>
                    We plan on small groups of up to 4, but individuals can participate too!
                </TitledCollapsible>
            </AnimateInContainer>
        </div>
    </div>
</template>

<style scoped>
.hackathonTitle {
    position: absolute;
    top: 0px;
    left: 0px;
    transform-origin: top;
    transform: translate3D(0px, -20vh, -50px) scale(150%);
    z-index: -1;
}

.stretchBlock {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
    max-height: 100%;
}

.hacksInfoBlock {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: min-content minmax(0, 1fr);
    grid-auto-flow: column dense;
    row-gap: 24px;
    column-gap: 24px;
    flex: 1;
    min-height: 0px;
    /* flexbox moment */
}

.faq {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    grid-auto-flow: dense;
    width: 100%;
    row-gap: 24px;
    column-gap: 24px;
}
</style>