<script setup lang="ts">
import ContactFooter from '@/components/ContactFooter.vue';
import ScrollIndicator from '@/components/ScrollIndicator.vue';
import { AnimateInContainer, CenteredContainer, ShowOnscreenContainer, TitledDoubleCutCornerContainer, CutCornerContainer, TitledCollapsible } from '@/components/ui-defaults/UIContainers';
import { GlitchText, GlowText, UILinkButton } from '@/components/ui-defaults/UIDefaults';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <div class="centered contestTitle">
        <ShowOnscreenContainer>
            <GlitchText text="WWPIT" font-size="var(--font-title)" color="lime" shadow glow :steps=2 :delay=10 random on-visible></GlitchText>
        </ShowOnscreenContainer>
    </div>
    <div class="fullBlock stretchBlock">
        <!-- spacer -->
        <div style="height: calc(1.25 * var(--font-title))"></div>
        <div class="contestInfoBlock">
            <div>
                <AnimateInContainer type="slideUp" height="100%" :delay=200>
                    <TitledDoubleCutCornerContainer title="2024 Season" height="100%" align="center" hover-animation="lift">
                        <div class="centered">
                            <GlitchText text="06/02/2024" font-size="var(--font-huge)" color="red" glow random flashing :steps=5 start-glitched></GlitchText>
                        </div>
                    </TitledDoubleCutCornerContainer>
                </AnimateInContainer>
            </div>
            <div>
                <AnimateInContainer type="slideUp" height="100%" :delay=300>
                    <CutCornerContainer height="100%" hover-animation="lift" flipped vertical-flipped>
                        <CenteredContainer>
                            <span style="font-size: var(--font-20);">
                                <GlowText text="Registrations open!" font-size="var(--font-28)" color="lime" glow flashing></GlowText>
                                <div class="centered" style="margin: 4px;">
                                    <UILinkButton text="Register" color="lime" font-size="var(--font-24)" @click="router.push('/account/registrations')"></UILinkButton>
                                </div>
                                <p style="text-align: center; text-wrap: balance;">
                                    Register at any point before the contest starts to compete!
                                </p>
                                <p style="text-align: center; font-size: var(--font-small);">
                                    <i>Scroll down to see contest schedule.</i>
                                </p>
                            </span>
                        </CenteredContainer>
                    </CutCornerContainer>
                </AnimateInContainer>
            </div>
            <div style="grid-row: span 2;">
                <AnimateInContainer type="slideUp" height="100%" :delay=100>
                    <TitledDoubleCutCornerContainer title="General Information" height="100%" align="center" hover-animation="lift" flipped>
                        <p>
                            WWP Informatics Tournament (WWPIT) is a USACO / Codeforces-style programming contest in which teams of up to four compete in three rounds of elimination, with problems ranging from AP CS A–USACO Platinum.
                            <br><br>
                            The contest will be held online, on this website, between two divisions: Novice and Advanced.
                        </p>
                    </TitledDoubleCutCornerContainer>
                </AnimateInContainer>
            </div>
        </div>
        <ScrollIndicator anchor="a[name=pageHackathonScrollTo]"></ScrollIndicator>
    </div>
    <!--Put the schedule here?-->
    <div class="fullBlock stretchBlock">
        <a name="pageHackathonScrollTo"></a>
        <CenteredContainer>
            <ShowOnscreenContainer>
                <GlitchText text="Contest Schedule" font-size="var(--font-title)" color="lime" glow shadow random :steps=2 on-visible></GlitchText>
            </ShowOnscreenContainer>
        </CenteredContainer>
        
        <ScrollIndicator anchor="a[name=pageHackathonScrollTo2]"></ScrollIndicator>
    </div>
    <div class="fullBlock stretchBlock">
        <a name="pageHackathonScrollTo2"></a>
        <CenteredContainer>
            <ShowOnscreenContainer>
                <GlitchText text="FAQ" font-size="var(--font-title)" color="lime" glow shadow random :steps=2 :delay=10 on-visible></GlitchText>
            </ShowOnscreenContainer>
        </CenteredContainer>
        <br>
        <div class="faq">
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="When is it?" startCollapsed>
                    <p style="font-size: var(--font-20)">
                        WWPIT 2024 will be on June 2, starting at 10:24 AM EST.
                        <br><br>
                        Scroll up to see the contest schedule.
                    </p>
                </TitledCollapsible>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="Where will it be held?" startCollapsed>
                    <p style="font-size: var(--font-20)">
                        WWPIT will be held on this website!
                        <br><br>
                        You can register <a href="/account/registrations" target="_blank">here</a> at any time before the contest starts.
                    </p>
                </TitledCollapsible>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="What's the contest format?" startCollapsed>
                    <p style="font-size: var(--font-20)">
                        <ul>
                            <li>There will be 4 separate timed rounds of 64 minutes each, 3 for each division</li>
                            <li>Teams will be ranked by the total amount of problems solved, <i>with partial credit</i></li>
                            <li>Submissions are only graded after the round ends</li>
                            <li>Any resource is allowed as long as it was made before the beginning of the contest</li>
                        </ul>
                    </p>
                </TitledCollapsible>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="How can I prepare?" startCollapsed>
                    <p style="font-size: var(--font-20)">
                        For those experienced in programming, helpful resources include <a href="https://usaco.guide" target="_blank">USACO Guide</a> and <a href="https://codeforces.com" target="_blank">Codeforces</a>.
                        <br><br>
                        To learn C++, see <a href="https://cplusplus.com/doc/tutorial/" target="_blank">CPlusPlus.com</a>. To learn Python, a more beginner-friendly language, the <a href="https://runestone.academy/ns/books/published/thinkcspy/index.html" target="_blank">thinkcspy textbook</a> is useful.
                    </p>
                </TitledCollapsible>
            </AnimateInContainer>
        </div>
        <div class="spacer"></div>
        <ContactFooter></ContactFooter>
    </div>
</template>

<style scoped>
.contestTitle {
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

.contestInfoBlock {
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

.contestInfoBlock>div {
    height: 100%;
}

@media (max-width: 100vh) {
    .contestInfoBlock {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: repeat(4, min-content);
        grid-auto-flow: column;
        min-height: min-content;
    }
}

.faq {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(400px, 100%), 1fr));
    width: 100%;
    row-gap: 24px;
    column-gap: 24px;
}

.spacer {
    flex-grow: 1;
}
</style>