<script setup lang="ts">
import { UIButton, GlitchText } from "@/components/ui-defaults/UIDefaults";
</script>

<template>
    <div class="fullBlock">
        <div class="centered">
            <GlitchText text="WWPPC 2024" font-size="min(20vh, calc(100vw / 8))" color="lime" glow shadow :steps=2 :delay=300 :random=true></GlitchText>
        </div>
        <br>
        <div class="row">
            <div class="column">
                <UIButton class="hackbutton" text="HACKATHON" font-size="25px" height="50px" @click="() => { $router.push('/hackathon') }"></UIButton>
                <GlitchText text="9/20/2024" font-size="min(calc(50vh - 60px), calc(100vw / 13))" color="red" glow :steps=1 :delay=20></GlitchText>
            </div>
            <div class="column">
                <UIButton class="informButton" text="INFORMATICS TOURNAMENT" font-size="25px" height="50px" @click="() => { $router.push('/contest') }"></UIButton>
                <GlitchText text="5/10/2024" font-size="min(calc(50vh - 60px), calc(100vw / 13))" color="red" glow :steps=1 :delay=20></GlitchText>
            </div>
        </div>
        <br>
        <div class="center" style="text-align: center; font-size: 120%">
            West Windsor-Plainsboro Programming Competition (WWPPC), comprised of the WWP Informatics Tournament (WWPIT) and
            WWPHacks, will be held eventually in 2024. Join us on <a href="https://discord.gg/rv23HbH7rB">Discord</a>!
        </div>
    </div>
</template>

<style>
.row {
    display: flex;
    flex-flow: row wrap;
    flex-direction: row;
    justify-items: stretch;
    justify-content: space-evenly;
    row-gap: 20px;
}

.column {
    display: flex;
    flex-direction: column;
}

.hackbutton {
    flex: .25;
}

.informButton {
    flex: .25;
}
</style>