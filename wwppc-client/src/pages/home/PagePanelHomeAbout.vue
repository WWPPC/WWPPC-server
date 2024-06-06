<script setup lang="ts">
import ContactFooter from '@/components/common/ContactFooter.vue';
import HomeAboutCreditsCard from '@/components/home/about/HomeAboutCreditsCard.vue';
import { GlitchText } from '@/components/ui-defaults/UIDefaults';
</script>

<template>
    <div class="fullBlock">
        <GlitchText text="WWPPC Team" class="aboutTitle" font-size="var(--font-title)" color="lime" shadow glow :steps=2 :delay=10 random on-visible></GlitchText>
        <div class="aboutCreditsTable">
            <HomeAboutCreditsCard name="Rishikesh Anabathula" username="wwppc-rishikesh" roles="Project Lead<br>Outreach<br>Problemsetter" img="/img/rishikesh-anabathula.jpg" codeforces="CutSandstone" github="CutSandstone" discord="559131662143979534" bio="USACO Platinum, running enjoyer, AIME qualifier, leetcoder. Also likes short biographies, so I made this long sentence for him."></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Jie Gao" username="spsquared" roles="Development Lead<br>Website Developer<br>Contest Backend Developer" img="/img/jie-gao.jpg" github="spsquared" discord="587770060462882854" youtube="@sp-squared?sub_confirmation=1" bio="Full stack JavaScript main and robotics nerd. 2x WRO Future Engineers Internationals Top 4 (Team SPARK) and Battlecode 2024 HS 3rd place. Made most of the website frontend and servers."></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Erik Ji" username="erikji" roles="Problemsetter<br>Logistics & Outreach" img="/img/erik-ji.jpg" codeforces="passwordisa" github="erikji" discord="688018118492291080" bio="Candidate Master on Codeforces and qualified for AIME in 8th grade. (Still stuck in Silver despite that) Battlecode 2024 HS 3rd place."></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Suvanth Erranki" username="susvant" roles="Problemsetter<br>Contest Backend Developer" img="/img/suvanth-erranki.jpg" codeforces="susvant" github="Suvanth-Erranki" discord="812014506724556820" bio="omg susvant! Battlecode 2024 HS 3rd place"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Vikram Karamsetty" username="vikramk" roles="" img="/img/vikram-karamsetty.jpeg" codeforces="vikram.karamsetty" github="VikramKaramsetty" discord="660497297074814976" bio="avid programmer (usaco silver), dedicated roboticist (First Tech Challenge #14481), track runner, problem solver, and engineer!"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Maitian Sha" username="sp" roles="Problemsetter" img="/img/maitian-sha.jpg" codeforces="spuh" github="SampleProvider" discord="706967946198777867" youtube="watch?v=dQw4w9WgXcQ" bio="sp confirmed! Probably qualified for AIME in 6th grade. Also 2x WRO Future Engineers Internationals Top 4 (Team SPARK) and USACO gold. Battlecode 2024 HS 3rd place and made USAJMO as well."></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Advik Vermani" username="avermani10" roles="Outreach Lead" img="/img/advik-vermani.jpg" discord="891834348263862293" bio="Coding enjoyer (USACO Silver) and cybersecurity enthuiast. Also loves music and playing the viola, soccer (actually a Chelsea fan), travelling, chess, and spending time with friends."></HomeAboutCreditsCard>
        </div>
        <ContactFooter></ContactFooter>
    </div>
</template>

<style scoped>
.aboutTitle {
    transform-origin: top;
    transform: translate3D(0px, -20vh, -50px) scale(150%);
    z-index: -1;
    text-align: center;
}

.aboutCreditsTable {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    width: 100%;
    justify-items: center;
    row-gap: 24px;
    column-gap: 24px;
}
</style>