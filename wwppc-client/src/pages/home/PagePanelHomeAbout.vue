<script setup lang="ts">
import ContactFooter from '@/components/common/ContactFooter.vue';
import HomeAboutCreditsCard from '@/components/home/about/HomeAboutCreditsCard.vue';
import { GlitchText } from '@/components/ui-defaults/UIDefaults';
</script>

<template>
    <div class="fullBlock">
        <a name="pageAboutScrollTo"></a>
        <div class="centered">
            <GlitchText text="WWPPC Team" font-size="var(--font-title)" color="lime" glow shadow random :steps=2 on-visible></GlitchText>
        </div>
        <br>
        <br>
        <div class="aboutCreditsTable">
            <HomeAboutCreditsCard name="Rishikesh Anabathula" roles="Project Lead<br>Outreach<br>Problemsetter" img="/img/rishikesh-anabathula.png" codeforces="CutSandstone" github="CutSandstone" discord="559131662143979534" bio="put sandstone in stonecutter. USACO Platinum"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Jie Gao" roles="Development Lead<br>Website Developer" img="/img/jie-gao.jpg" github="spsquared" discord="587770060462882854" youtube="@sp-squared?sub_confirmation=1" bio="Full stack JavaScript main and robotics nerd. 2x WRO Future Engineers Internationals Top 4 and Battlecode 2024 high-school 3rd place team. Made most of the website frontend and servers."></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Erik Ji" roles="Outreach Lead<br>Problemsetter<br>Logistics" img="/img/erik-ji.jpg" codeforces="passwordisa" github="erikji" discord="688018118492291080" bio="Goated in logistics and outreach. Battlecode 2024 high-school 3rd place team"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Suvanth Erranki" roles="Problemsetter<br>Contest Backend Developer" img="/img/suvanth-erranki.jpg" codeforces="susvant" github="Suvanth-Erranki" discord="812014506724556820" bio="omg susvant Battlecode 2024 high-school 3rd place team"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Vikram Karamsetty" roles="Logistics Lead<br>Website Developer" img="/img/vikram-karamsetty.jpeg" github="VikramKaramsetty" discord="660497297074814976" bio="insert bio here"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Maitian Sha" roles="Problemsetter" img="/img/maitian-sha.jpg" codeforces="spuh" github="SampleProvider" discord="706967946198777867" youtube="watch?v=dQw4w9WgXcQ" bio="sp confirmed! Probably qualified for AIME in 8th grade and has linear CodeForces ranking trend. Also 2x WRO Future Engineers Internationals Top 4 and Battlecode 2024 high-school 3rd place team USACO gold."></HomeAboutCreditsCard>
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
    row-gap: 24px;
    column-gap: 24px;
}
</style>