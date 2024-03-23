<script setup lang="ts">
import ContactFooter from '@/components/ContactFooter.vue';
import HomeAboutCreditsCard from '@/components/home/about/HomeAboutCreditsCard.vue';
import { GlitchText } from '@/components/ui-defaults/UIDefaults';
</script>

<template>
    <div class="fullBlock">
        <a name="pageAboutScrollTo"></a>
        <div class="centered">
            <GlitchText text="WWPPC Team" font-size="var(--font-title)" color="lime" glow shadow random :steps=1></GlitchText>
        </div>
        <br>
        <br>
        <div class="aboutCreditsTable">
            <HomeAboutCreditsCard name="Rishikesh Anabathula" roles="Project Lead<br>Lead Problem Setter<br>Backend Developer" img="oof" codeforces="CutSandstone" github="CutSandstone"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Jie Gao" roles="Lead Frontend Developer<br>Lead Backend Developer" img="oof" github="spsquared"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Suvanth Erranki" roles="Problem Setter<br>Backend Developer" img="oof" codeforces="susvant" github="Suvanth-Erranki"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Erik Ji" roles="Frontend Developer<br>Backend Developer<br>Problem Setter" img="oof" codeforces="passwordisa" github="erikji"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Vikram Karamsetty" roles="Frontend Developer" img="oof" github="VikramKaramsetty"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Maitian Sha" roles="Problem Setter" img="oof" codeforces="spuh" github="SampleProvider"></HomeAboutCreditsCard>
        </div>
        <ContactFooter></ContactFooter>
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