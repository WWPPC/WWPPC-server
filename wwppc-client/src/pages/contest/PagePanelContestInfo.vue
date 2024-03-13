<script setup lang="ts">
import ScrollIndicator from '@/components/ScrollIndicator.vue';
import { AnimateInContainer, CenteredContainer, IfOnscreenContainer, TitledDoubleCutCornerContainer, CutCornerContainer, TitledCollapsible } from '@/components/ui-defaults/UIContainers';
import { GlitchText, UILinkButton } from '@/components/ui-defaults/UIDefaults';
</script>

<template>
    <div class="fullBlock stretchBlock">
        <div class="centered">
            <GlitchText text="WWP IT" font-size="min(15vh, calc(100vw / 8))" color="lime" shadow glow :steps=1 :delay=400 random></GlitchText>
        </div>
        <!-- a couple of containers containing information about what WWPHacks is (what is a hackathon?) -->
        <div class="contestInfoBlock">
            <AnimateInContainer type="slideUp" :delay=200>
                <TitledDoubleCutCornerContainer title="2024 Season" align="center" height="100%" hover-animation="lift">
                    <div class="centered">
                        <GlitchText text="??/??/????" font-size="min(5vh, calc(50vw / 10))" color="red" glow :steps=1 :delay=Infinity></GlitchText>
                    </div>
                </TitledDoubleCutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" :delay=300>
                <CutCornerContainer height="100%" hover-animation="lift" flipped vertical-flipped>
                    <UILinkButton text="Register"></UILinkButton>
                    <!-- mailing list? -->
                    <!-- other contact information? -->
                    <!-- how to hackathon resources? -->
                </CutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" :delay=100 style="grid-row: span 2;">
                <TitledDoubleCutCornerContainer title="Contest Information" align="center" height="100%" hover-animation="lift" flipped>
                    <p>
                        WWP Informatics Tournament is a IPCP / CodeForces / USACO-style programming contest in which teams of up to 2 compete in six rounds of elimination, with problems ranging from AP CSA to USACO Platinum.
                        <br><br>
                        The contest will be held online between two divisions with some overlap between problem difficulty.
                        <br><br>
                        We hope that you'll have fun competing! :)
                    </p>
                </TitledDoubleCutCornerContainer>
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
                    <i>We're still not telling you...</i>
                </TitledCollapsible>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="Where will it be held?" height="100%" startCollapsed>
                    WWP-IT will be held online, on this website!
                    <br><br>
                    You can <a href="" target="_blank">register here</a> at any time before the contest starts.
                </TitledCollapsible>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="What's the contest format?" height="100%" startCollapsed>
                    We plan on hosting a blend between ICPC and CodeForces contest format:
                    <br><br>
                    <ul>
                        <li>The competition will be split into separate timed rounds, problems are only visible during the rounds</li>
                        <li>Teams will be ranked by their total scores; partial scores for individual problems will be given</li>
                        <li>Submission results are only visible once the round ends; teams are allowed to upload a submission at any time during around but only see their scores at the round end</li>
                        <li>As usual, no outside sources are allowed, be a good sport and let people have fun!</li>
                    </ul>
                </TitledCollapsible>
            </AnimateInContainer>
        </div>
    </div>
</template>

<style scoped>
.stretchBlock {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
    max-height: 100%;
}

.contestInfoBlock {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: min-content 1fr;
    grid-auto-flow: column dense;
    row-gap: 24px;
    column-gap: 24px;
    flex: 1;
    min-height: 0px;
    /* flexbox moment */
}

.faq {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    grid-auto-flow: dense;
    width: 100%;
    row-gap: 24px;
    column-gap: 24px;
}
</style>