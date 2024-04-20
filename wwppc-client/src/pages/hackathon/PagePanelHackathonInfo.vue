<script setup lang="ts">
import ContactFooter from '@/components/ContactFooter.vue';
import ScrollIndicator from '@/components/ScrollIndicator.vue';
import { AnimateInContainer, CenteredContainer, ShowOnscreenContainer, TitledDoubleCutCornerContainer, CutCornerContainer, TitledCollapsible } from '@/components/ui-defaults/UIContainers';
import { GlitchText, UILinkButton } from '@/components/ui-defaults/UIDefaults';
</script>

<template>
    <div class="centered hackathonTitle">
        <ShowOnscreenContainer>
            <GlitchText text="WWP HACKS" font-size="var(--font-title)" color="lime" shadow glow :steps=1 :delay=400 random></GlitchText>
        </ShowOnscreenContainer>
    </div>
    <div class="fullBlock stretchBlock">
        <!-- spacer -->
        <div style="height: calc(1.25 * var(--font-title))"></div>
        <div class="hacksInfoBlock">
            <div style="grid-row: span 2;">
                <AnimateInContainer type="slideUp" height="100%" :delay=100>
                    <TitledDoubleCutCornerContainer title="Come hack with us!" height="100%" align="center" hover-animation="lift">
                        <p>
                            WWPHacks is a hackathon where programmers compete to develop technological solutions to real-world problems within 24 hours. Teams will build projects, attend workshops, and compete for prizes. Judges will evaluate the projects, with winners receiving interesting awards. At the end of the day, participants will leave the hackathon with technical experience, new friends, and fulfillment.
                        </p>
                    </TitledDoubleCutCornerContainer>
                </AnimateInContainer>
            </div>
            <div>
                <AnimateInContainer type="slideUp" height="100%" :delay=200>
                    <TitledDoubleCutCornerContainer title="2024 Season" height="100%" align="center" hover-animation="lift" flipped>
                        <div class="centered">
                            <GlitchText text="??/??/????" font-size="min(5vh, calc(50vw / 10))" color="red" glow :steps=1 :delay=Infinity></GlitchText>
                        </div>
                    </TitledDoubleCutCornerContainer>
                </AnimateInContainer>
            </div>
            <div>
                <AnimateInContainer type="slideUp" height="100%" :delay=300>
                    <CutCornerContainer height="100%" hover-animation="lift" vertical-flipped>
                        <CenteredContainer>
                            <span style="font-size: var(--font-20);">
                                <div class="centered" style="margin: 4px;">
                                    <UILinkButton text="Register" color="lime" width="max(40%, min-content)" disabled></UILinkButton>
                                </div>
                                <i style="font-size: var(--font-16)">Registrations are not open yet, check back later!</i>
                            </span>
                        </CenteredContainer>
                    </CutCornerContainer>
                </AnimateInContainer>
            </div>
        </div>
        <ScrollIndicator anchor="a[name=pageHackathonScrollTo]"></ScrollIndicator>
    </div>
    <div class="fullBlock stretchBlock">
        <a name="pageHackathonScrollTo"></a>
        <CenteredContainer>
            <ShowOnscreenContainer>
                <GlitchText text="FAQ" font-size="min(15vh, calc(100vw / 8))" color="lime" glow shadow random :steps=1></GlitchText>
            </ShowOnscreenContainer>
        </CenteredContainer>
        <div class="faq">
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="When is it?" startCollapsed>
                    <i>wink</i>
                </TitledCollapsible>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="Where will it be held?" startCollapsed>
                    TBD
                </TitledCollapsible>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="How many people can be on a team?" startCollapsed>
                    TBD, but between 1-4.
                </TitledCollapsible>
            </AnimateInContainer>
        </div>
        <div class="spacer"></div>
        <ContactFooter></ContactFooter>
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
}

.hacksInfoBlock {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: min-content minmax(0, 1fr);
    grid-auto-flow: column dense;
    /* flexbox moment */
    min-height: 0px;
    row-gap: 24px;
    column-gap: 24px;
    flex: 1;
}

.hacksInfoBlock>div {
    height: 100%;
}

@media (max-width: 100vh) {
    .hacksInfoBlock {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: repeat(4, min-content);
        grid-auto-flow: column;
        min-height: min-content;
    }
}

.faq {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(400px, 100%), 1fr));
    grid-auto-flow: dense;
    width: 100%;
    row-gap: 24px;
    column-gap: 24px;
}

.spacer {
    flex-grow: 1;
}

.faq>div {
    max-width: 100%;
}
</style>