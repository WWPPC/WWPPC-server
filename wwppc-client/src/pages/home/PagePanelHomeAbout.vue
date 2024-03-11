<script setup lang="ts">
import HomeAboutCreditsCard from '@/components/home/about/HomeAboutCreditsCard.vue';
import { ShowOnscreenContainer } from '@/components/ui-defaults/UIContainers';
import { GlitchText } from '@/components/ui-defaults/UIDefaults';
</script>

<template>
    <div class="fullBlock">
        <div class="centered">
            <GlitchText text="About WWPPC" font-size="min(15vh, calc(100vw / 8))" color="lime" glow shadow random :steps=1></GlitchText>
        </div>
        <p>
            WWPPC is the combined hosts of WWP-IT and WWPHacks, created by members of West Windsor Plainsboro High School South's Coding Clubs. insert more description here
        </p>
    </div>
    <div class="fullBlock">
        <div class="centered">
            <ShowOnscreenContainer single>
                <GlitchText text="WWPPC Team" font-size="min(15vh, calc(100vw / 8))" color="lime" glow shadow random :steps=1></GlitchText>
            </ShowOnscreenContainer>
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
.aboutCreditsTable {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    width: 100%;
    justify-items: center;
    row-gap: 16px;
    column-gap: 16px;
}
</style>