<script setup lang="ts">
import ScrollIndicator from '@/components/ScrollIndicator.vue';
import HomeAboutCreditsCard from '@/components/home/about/HomeAboutCreditsCard.vue';
import { AnimateInContainer, IfOnscreenContainer } from '@/components/ui-defaults/UIContainers';
import { GlitchText } from '@/components/ui-defaults/UIDefaults';
</script>

<template>
    <div class="fullBlock aboutBlock">
        <div class="centered">
            <IfOnscreenContainer>
                <GlitchText text="About WWPPC" font-size="min(15vh, calc(100vw / 8))" color="lime" glow shadow random :steps=1></GlitchText>
            </IfOnscreenContainer>
        </div>
        <div class="aboutBody">
            <p>
                WWPPC is the combined hosts of WWP-IT and WWPHacks, created by members of West Windsor Plainsboro High School South Coding Club.
            </p>
            <p>
                WWPHacks has been featured as an offical <a href="https://mlh.io/" target="_blank">Major League Hacking</a> hackathon in 2021.
                <br>
                <a href="https://wwphacks.github.io" target="_blank">2021 Contest Page</a>
            </p>
            <p>
                We hope to continue the legacy as well as creating a new round-based informatics tournament!
            </p>
        </div>
        <div class="centered aboutScrollIndicator">
            <AnimateInContainer type="fade" :delay=1000 show-on-screen>
                <ScrollIndicator anchor="a[name=pageAboutScrollTo]"></ScrollIndicator>
            </AnimateInContainer>
        </div>
    </div>
    <div class="fullBlock">
        <a name="pageAboutScrollTo"></a>
        <div class="centered">
            <IfOnscreenContainer>
                <GlitchText text="WWPPC Team" font-size="min(15vh, calc(100vw / 8))" color="lime" glow shadow random :steps=1></GlitchText>
            </IfOnscreenContainer>
        </div>
        <br>
        <br>
        <div class="aboutCreditsTable">
            <HomeAboutCreditsCard name="Rishikesh Anabathula" roles="Project Lead<br>Lead Problem Setter<br>Backend Developer" img="oof"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Jie Gao" roles="Lead Frontend Developer<br>Lead Backend Developer" img="oof"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Suvanth Erranki" roles="Backend Developer<br>Problem Setter" img="oof"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Vikram Karamsetty" roles="Frontend Developer" img="oof"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Erik Ji" roles="Frontend Developer<br>Problem Setter" img="oof"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Maitian Sha" roles="Problem Setter" img="oof"></HomeAboutCreditsCard>
        </div>
    </div>
</template>

<style scoped>
.aboutBlock {
    display: flex;
    flex-direction: column;
    justify-items: stretch;
}

.aboutBody {
    flex-grow: 1;
}

.aboutBody p {
    font-size: 24px;
    text-align: center;
}

@media (max-width: 100vh) {
    .aboutScrollIndicator {
        display: none;
    }
}

.aboutCreditsTable {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    width: 100%;
    justify-items: center;
    row-gap: 16px;
    column-gap: 16px;
}
</style>