<script setup lang="ts">
import ContactFooter from '@/components/common/ContactFooter.vue';
import ScrollIndicator from '@/components/common/ScrollIndicator.vue';
import { MultipaneSelectorContainer, MultipaneSelector, MultipanePaneContainer, MultipanePane } from '@/components/multipane/Multipane';
import { AnimateInContainer, CenteredContainer, TitledDoubleCutCornerContainer, CutCornerContainer, TitledCollapsible } from '@/components/ui-defaults/UIContainers';
import { GlitchText, UILinkButton, UIIconButton, UITimer } from '@/components/ui-defaults/UIDefaults';
import { nextContest, nextContestEnd } from '@/scripts/ContestManager';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <div class="fullBlock stretchBlock">
        <GlitchText text="WWPIT" class="contestTitle" font-size="var(--font-title)" color="lime" shadow glow :steps=2 :delay=10 random on-visible></GlitchText>
        <div class="contestInfoBlock">
            <AnimateInContainer type="slideUp" show-on-screen :delay=100 style="grid-row: span 2;">
                <TitledDoubleCutCornerContainer title="General Information" height="100%" align="center" hover-animation="lift" flipped>
                    <p>
                        WWP Informatics Tournament (WWPIT) is a USACO / Codeforces-style programming contest in which teams of up to 4 compete in 3 rounds of problems across 2 divisions, ranging from AP CSA to USACO Platinum.
                        <br><br>
                        The contest will be held online, on this website, between two divisions: Novice and Advanced.
                    </p>
                </TitledDoubleCutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen :delay=200 style="grid-column: 1;">
                <TitledDoubleCutCornerContainer title="2024 Season" height="100%" align="center" hover-animation="lift">
                    <div class="centered">
                        <GlitchText text="06/02/2024" font-size="var(--font-huge)" color="red" glow random flashing :steps=5 start-glitched></GlitchText>
                    </div>
                    <div class="centered">
                        <UITimer :to="nextContest" type="clock" font-size="var(--font-large)" color="lime" glow></UITimer>
                    </div>
                </TitledDoubleCutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen :delay=300>
                <CutCornerContainer height="100%" hover-animation="lift" flipped vertical-flipped>
                    <CenteredContainer style="font-size: var(--font-20);" v-if="Date.now() < nextContest.getTime()">
                        <GlitchText text="Registrations open!" font-size="var(--font-28)" color="lime" glow flashing random></GlitchText>
                        <div class="centered" style="margin: 8px;">
                            <UILinkButton text="Register" color="lime" font-size="var(--font-large)" @click="router.push('/account/registrations')"></UILinkButton>
                        </div>
                        <p style="text-align: center; font-size: var(--font-small);">
                            <i>Scroll down to see contest schedule</i>
                        </p>
                    </CenteredContainer>
                    <CenteredContainer style="font-size: var(--font-20);" v-else-if="Date.now() > nextContestEnd.getTime()">
                        <GlitchText text="Contest ended!" font-size="var(--font-28)" color="red" glow random></GlitchText>
                        <div class="centered" style="margin: 8px;">
                            <UILinkButton text="Archive" color="lime" font-size="var(--font-large)" disabled></UILinkButton>
                        </div>
                        <p style="text-align: center">
                            Thanks to all who participated! We hope to see you next year (and in smaller tournaments in-between)!
                        </p>
                    </CenteredContainer>
                    <CenteredContainer style="font-size: var(--font-20);" v-else>
                        <GlitchText text="Contest started!" font-size="var(--font-28)" color="lime" glow flashing flash-color="red" random></GlitchText>
                        <div class="centered" style="margin: 8px;">
                            <UILinkButton text="Contest" color="lime" font-size="var(--font-large)" @click="router.push('/contest/contest')"></UILinkButton>
                        </div>
                        <p style="text-align: center">
                            The contest has started!
                            Join our <a href="https://discord.wwppc.tech">Discord</a> server for important information during the contest!
                        </p>
                        <p style="text-align: center; font-size: var(--font-small);">
                            <i>Scroll down to see contest schedule</i>
                        </p>
                    </CenteredContainer>
                </CutCornerContainer>
            </AnimateInContainer>
        </div>
        <ScrollIndicator anchor="a[name=pageContestScrollTo]"></ScrollIndicator>
    </div>
    <div class="fullBlock stretchBlock">
        <a name="pageContestScrollTo"></a>
        <CenteredContainer>
            <GlitchText text="Schedule" font-size="var(--font-title)" color="lime" glow shadow random :steps=2 on-visible></GlitchText>
        </CenteredContainer>
        <div class="scheduleBlock">
            <AnimateInContainer type="slideUp" show-on-screen>
                <CutCornerContainer height="100%" flipped no-padding>
                    <MultipaneSelectorContainer for="contestSchedule">
                        <div class="scheduleHeader">
                            June 1
                        </div>
                        <MultipaneSelector for="precontest">
                            <div class="scheduleRow">
                                Practice & Testing
                            </div>
                        </MultipaneSelector>
                        <div class="scheduleHeader">
                            June 2
                        </div>
                        <MultipaneSelector for="openingCeremonies">
                            <div class="scheduleRow">
                                <div>10:15-10:45</div>
                                <div>|</div>
                                <div>Opening ceremonies</div>
                            </div>
                        </MultipaneSelector>
                        <MultipaneSelector for="round1">
                            <div class="scheduleRow">
                                <div>11:00-12:00</div>
                                <div>|</div>
                                <div>Round 1</div>
                            </div>
                        </MultipaneSelector>
                        <MultipaneSelector for="round2">
                            <div class="scheduleRow">
                                <div>12:10-1:10</div>
                                <div>|</div>
                                <div>Round 2</div>
                            </div>
                        </MultipaneSelector>
                        <MultipaneSelector for="lunch">
                            <div class="scheduleRow">
                                <div>1:10-2:10</div>
                                <div>|</div>
                                <div>Lunch break</div>
                            </div>
                        </MultipaneSelector>
                        <MultipaneSelector for="round3">
                            <div class="scheduleRow">
                                <div>2:10-3:20</div>
                                <div>|</div>
                                <div>Round 3</div>
                            </div>
                        </MultipaneSelector>
                        <MultipaneSelector for="sponsors">
                            <div class="scheduleRow">
                                <div>3:30-4:40</div>
                                <div>|</div>
                                <div>Sponsor Events</div>
                            </div>
                        </MultipaneSelector>
                        <MultipaneSelector for="closingCeremonies">
                            <div class="scheduleRow">
                                <div>4:55-5:30</div>
                                <div>|</div>
                                <div>Closing ceremonies</div>
                            </div>
                        </MultipaneSelector>
                    </MultipaneSelectorContainer>
                </CutCornerContainer>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen :delay=100 style="min-width: 0px; min-height: 15em;">
                <CutCornerContainer height="100%" vertical-flipped no-padding no-scroll style="font-size: var(--font-medium);">
                    <MultipanePaneContainer for="contestSchedule" default="precontest">
                        <MultipanePane for="precontest">
                            <GlitchText text="Pre-contest Practice & Testing" font-size="var(--font-28)" color="lime" on-visible></GlitchText>
                            <p>
                                Teams (including the WWPPC team) will have a chance to test the contest system with a few practice rounds.
                            </p>
                            <p>
                                The practice contest will be open all day. If you wish to enter the practice, you <b>MUST</b> <a href="/account/registrations" target="_blank">register</a> for the practice contest <b>1 day</b> before the actual contest!
                            </p>
                        </MultipanePane>
                        <MultipanePane for="openingCeremonies">
                            <GlitchText text="Opening Ceremonies" font-size="var(--font-28)" color="lime" on-visible></GlitchText>
                            <p>
                                Opening and closing ceremonies will be held on our Discord server!
                            </p>
                            <div class="centered">
                                <a href="https://discord.wwppc.tech" target="_blank" style="text-decoration: none;">
                                    <UIIconButton text="Join us on Discord!" img="/img/discord-logo.svg" color="lime" font-size="var(--font-medium)" img-hover-color="#5865F2"></UIIconButton>
                                </a>
                            </div>
                            <p>
                                We'll give more details and instructions on the contest format there.
                            </p>
                        </MultipanePane>
                        <MultipanePane for="round1">
                            <GlitchText text="Round 1 Novice" font-size="var(--font-28)" color="lime" on-visible></GlitchText>
                            <p>
                                Round 1 is 60 minutes long with 6 problems. Novice and Advanced divisions will not share problems.
                            </p>
                        </MultipanePane>
                        <MultipanePane for="round2">
                            <GlitchText text="Round 2 Novice / Round 1 Advanced" font-size="var(--font-28)" color="lime" on-visible></GlitchText>
                            <p>
                                Round 2 is 60 minutes long with 6 problems. Novice and Advanced divisions will not share problems.
                            </p>
                        </MultipanePane>
                        <MultipanePane for="lunch">
                            <GlitchText text="Lunch Break" font-size="var(--font-28)" color="lime" on-visible></GlitchText>
                            <p>
                                Lunch is one hour long and we'll be hosting some fun events during the break!
                                <br><br>
                                However, be ready to resume the contest <b>10 minutes</b> before the break ends! The contest will resume <b>IMMEDIATELY</b> after lunch!
                            </p>
                        </MultipanePane>
                        <MultipanePane for="round3">
                            <GlitchText text="Round 3 Novice / Round 2 Advanced" font-size="var(--font-28)" color="lime" on-visible></GlitchText>
                            <p>
                                Round 3 is 70 minutes long with 6 problems. Novice and Advanced divisions will not share problems.
                            </p>
                        </MultipanePane>
                        <MultipanePane for="sponsors">
                            <GlitchText text="Round 3 Advanced" font-size="var(--font-28)" color="lime" on-visible></GlitchText>
                            <p>
                                We will be hosting some events by our sponsors!
                                <br><br>
                                During this time, we will also finalize scores and determine the standings.
                            </p>
                        </MultipanePane>
                        <MultipanePane for="closingCeremonies">
                            <GlitchText text="Closing Ceremonies" font-size="var(--font-28)" color="lime" on-visible></GlitchText>
                            <p>
                                Opening and closing ceremonies will be held on our Discord server!
                            </p>
                            <div class="centered">
                                <a href="https://discord.wwppc.tech" target="_blank" style="text-decoration: none;">
                                    <UIIconButton text="Join us on Discord!" img="/img/discord-logo.svg" color="lime" font-size="var(--font-medium)" img-hover-color="#5865F2"></UIIconButton>
                                </a>
                            </div>
                            <p>
                                We will announce the winners and prizes for each division before closing off the contest.
                            </p>
                        </MultipanePane>
                    </MultipanePaneContainer>
                </CutCornerContainer>
            </AnimateInContainer>
        </div>
        <ScrollIndicator anchor="a[name=pageContestScrollTo2]"></ScrollIndicator>
    </div>
    <div class="fullBlock stretchBlock">
        <a name="pageContestScrollTo2"></a>
        <CenteredContainer>
            <GlitchText text="FAQ" font-size="var(--font-title)" color="lime" glow shadow random :steps=2 :delay=10 on-visible></GlitchText>
        </CenteredContainer>
        <br>
        <div class="faq">
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="When is it?" startCollapsed>
                    <p style="font-size: var(--font-20)">
                        WWPIT 2024 will be on <b>June 2</b>, starting at 10:15 AM EST.
                        It will run until 5:30 PM, with the latest time being 6:00 PM in case of unexpected slowdowns.
                        <br><br>
                        <i>Scroll up to see contest schedule</i>
                    </p>
                </TitledCollapsible>
            </AnimateInContainer>
            <AnimateInContainer type="slideUp" show-on-screen>
                <TitledCollapsible title="How do I compete?" startCollapsed>
                    <p style="font-size: var(--font-20)">
                        You can sign up <b><i><span style="text-decoration: underline;">NOW</span></i></b> by <b>creating an account and registering <i><a href="/account/registrations" target="_blank">RIGHT HERE</a></i></b>, NO prerequisites needed!
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
                        <li>There will be 3 separate timed rounds for each division, running at the same time</li>
                        <li>Each round has 6 problems, only visible <i>after</i> round start and only submittable <i>during</i> rounds</li>
                        <li>Submissions are only graded <i>after</i> the round ends</li>
                        <li>Teams of up to 4 will be ranked by the total amount of problems solved, <i>with partial credit</i></li>
                        <li>Ties will be broken by time submitted</li>
                        <li>Popular CP languages, like Java, C, C++, and Python are supported</li>
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
    transform-origin: top;
    transform: translate3D(0px, -20vh, -50px) scale(150%);
    z-index: -1;
    text-align: center;
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

.scheduleBlock {
    display: grid;
    grid-template-columns: min-content 1fr;
    row-gap: 16px;
    column-gap: 16px;
    flex-grow: 1;
}

@media (max-width: 100vh) {
    .contestInfoBlock {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: repeat(4, min-content);
        grid-auto-flow: column;
        min-height: min-content;
    }

    .scheduleBlock {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: min-content min-content;
    }
}

.scheduleHeader {
    padding: 4px 4px;
    border-bottom: 4px solid white;
    background-color: #222;
    text-align: center;
    font-size: var(--font-medium);
    font-weight: bold;
}

.scheduleRow {
    display: flex;
    flex-direction: row;
    margin: 0px 4px;
    align-items: center;
    font-size: var(--font-20);
    text-wrap: nowrap;
    word-wrap: none;
}

.scheduleRow>div:nth-child(1) {
    text-align: right;
    width: 5.2em;
}

.scheduleRow>div:nth-child(2) {
    font-weight: 900;
    margin: 0px 0.4em;
    color: #AAA;
}

.faq {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(400px, 100%), 1fr));
    grid-auto-flow: dense;
    width: 100%;
    row-gap: 24px;
    column-gap: 24px;
}

ul>li {
    margin-bottom: 0.5em;
}

.spacer {
    flex-grow: 1;
}
</style>