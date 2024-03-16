<script setup lang="ts">
import ScrollIndicator from '@/components/ScrollIndicator.vue';
import { AnimateInContainer, CenteredContainer, IfOnscreenContainer, TitledDoubleCutCornerContainer, CutCornerContainer, TitledCollapsible } from '@/components/ui-defaults/UIContainers';
import { GlitchText, UIDivider, UILinkButton } from '@/components/ui-defaults/UIDefaults';
</script>

<template>
    <div class="fullBlock stretchBlock">
        <div class="centered">
            <GlitchText text="WWPIT" font-size="min(15vh, calc(100vw / 8))" color="lime" shadow glow :steps=1 :delay=400 random></GlitchText>
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
                    <CenteredContainer>
                        <span style="font-size: var(--font-20);">
                            You can register to compete here:
                            <div class="centered" style="margin-top: 4px;">
                                <UILinkButton text="Register" color="lime" width="40%" disabled></UILinkButton>
                            </div>
                            <i style="font-size: var(--font-16)">Registrations are not open yet, check back later!</i>
                        </span>
                    </CenteredContainer>
                    <UIDivider></UIDivider>
                    <ul>
                        <li>Anyone can register! All you need is an account!</li>
                        <!-- other info? -->
                    </ul>
                </CutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" :delay=100 style="grid-row: span 2;">
                <TitledDoubleCutCornerContainer title="General Information" align="center" height="100%" hover-animation="lift" flipped>
                    <p style="font-size: var(--font-20);">
                        WWP Informatics Tournament (WWPIT) is a ICPC / Codeforces / USACO-style programming contest in which teams of up to 2 compete in six rounds of elimination, with problems ranging from AP CS A to USACO Platinum.
                        <br><br>
                        The contest will be held online between two divisions: Beginner and Advanced, with some difficulty overlap.
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
        <br>
        <div class="faq">
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="When is it?" height="100%" startCollapsed>
                    Sometime in 2024
                </TitledCollapsible>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="Where will it be held?" height="100%" startCollapsed>
                    WWPIT will be held online, on this website!
                    <br><br>
                    You can register <a href="/account/registrations/new" target="_blank"> here</a> at any time before the contest starts.
                </TitledCollapsible>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="What's the contest format?" height="100%" startCollapsed>
                    <ul>
                        <li>There will be n separate timed rounds of roughly 45 minutes each</li>
                        <li>Teams will be ranked by their total score, with partial credit for problems</li>
                        <li>Submissions are only graded after the round ends</li>
                        <li>Any resource is allowed as long as it was made before the beginning of the contest</li>
                    </ul>
                </TitledCollapsible>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="How can I prepare?" height="100%" startCollapsed>
                    For those experienced in programming, helpful resources include <a href="https://usaco.guide" target="_blank">USACO Guide</a> and <a href="https://codeforces.com" target="_blank">Codeforces</a>.
                    <br><br>
                    To learn C++, see <a href="https://cplusplus.com/doc/tutorial/" target="_blank">CPlusPlus.com</a>. To learn Python, a more beginner-friendly language, the <a href="https://runestone.academy/ns/books/published/thinkcspy/index.html" target="_blank">thinkcspy textbook</a> is useful.
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