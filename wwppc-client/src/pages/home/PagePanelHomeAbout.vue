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
            <HomeAboutCreditsCard name="Rishikesh Anabathula" roles="Project Lead<br>Lead Problem Setter<br>Backend Developer" img="oof" codeforces="CutSandstone" github="CutSandstone" discord="559131662143979534"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Jie Gao" roles="Lead Frontend Developer<br>Lead Backend Developer" img="/img/jie-gao.jpg" github="spsquared" discord="587770060462882854" youtube="@sp-squared"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Erik Ji" roles="Frontend Developer<br>Backend Developer<br>Problem Setter" img="https://raw.githubusercontent.com/spsquared/SPARK_Future-Engineers_2023/master/SPARK-Util/SPARK-Control/assets/rickastley.png" codeforces="passwordisa" github="erikji" discord="688018118492291080"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Suvanth Erranki" roles="Problem Setter<br>Backend Developer" img="/assets/susvant.jpg" codeforces="susvant" github="Suvanth-Erranki" discord="812014506724556820"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Vikram Karamsetty" roles="Frontend Developer" img="oof" github="VikramKaramsetty" discord="660497297074814976"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Maitian Sha" roles="Problem Setter" img="/img/not-jie-gao.jpeg" codeforces="spuh" github="SampleProvider" discord="706967946198777867" youtube="watch?v=dQw4w9WgXcQ"></HomeAboutCreditsCard>
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