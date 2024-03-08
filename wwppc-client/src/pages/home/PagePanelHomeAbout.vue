<script setup lang="ts">
import HomeAboutCreditsCard from '@/components/home/about/HomeAboutCreditsCard.vue';
import { ShowOnscreenContainer } from '@/components/ui-defaults/UIContainers';
import { GlitchText } from '@/components/ui-defaults/UIDefaults';
</script>

<template>
    <div class="fullBlock">

    </div>
    <div class="fullBlock">
        <div class="centered">
            <ShowOnscreenContainer>
                <GlitchText text="WWPPC Team" font-size="80px" color="lime" glow shadow :delay=10></GlitchText>
            </ShowOnscreenContainer>
        </div>
        <br>
        <br>
        <div class="aboutCreditsTable">
            <HomeAboutCreditsCard name="Rishikesh Anabathula" roles="Project Lead, Lead Problem Setter, Backend Developer" img="oof"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Jie Gao" roles="Lead Developer" img="oof"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Suvanth Erranki" roles="Backend Developer, Problem Setter" img="oof"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Vikram Karamsetty" roles="Frontend Developer" img="oof"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Erik Ji" roles="Frontend Developer, Problem Setter" img="oof"></HomeAboutCreditsCard>
            <HomeAboutCreditsCard name="Arav Maheria" roles="oof" img="oof"></HomeAboutCreditsCard>
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