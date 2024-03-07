<script setup lang="ts">
import LargeGlitchCenterText from '@/components/LargeGlitchCenterText.vue';
import UIButton from "@/components/ui-defaults/UIButton.vue";
</script>

<template>
  <div class="fullBlock">
    <br><br>
    <LargeGlitchCenterText text="WWPPC 2024" style="
            font-weight: bold;
            font-size: min(20vh, calc(100vw / 8));
            text-wrap: nowrap;
            color: lime;
            text-shadow: -0.05em 0.05em 0px #0F05, 0px 0px 0.02em #0F0;
            " :steps=2 :delay=300 :random=true></LargeGlitchCenterText>
    <br>
    <div class = "row">
      <div class = "column">
        <!-- animate buttons in from let and right -->
        <UIButton class = "hackbutton" text="HACKATHON" font-size="25px" height="50px" @click= "() => {$router.push('/hackathon')}"></UIButton>
        <LargeGlitchCenterText text="9/20/2024" style="
            font-weight: bold;
            font-size: min(calc(50vh - 60px), calc(100vw / 13));
            text-wrap: nowrap;
            color: red;
            display:flex;
            flex:.5;
            text-shadow: 0 0 20px red;
            " :steps=1 :delay=20>
        </LargeGlitchCenterText>
      </div>
<!--      <span class = "space"></span>-->
      <!-- sorry vikram your code will have all of the conflicts -->

      <div class = "column">
        <UIButton class = "informButton" text="INFORMATICS TOURNAMENT" font-size="25px" height="50px" @click="()=> {$router.push('/contest')}"></UIButton>
        <LargeGlitchCenterText text="5/10/2024" style="
            font-weight: bold;
            font-size: min(calc(50vh - 60px), calc(100vw / 13));
            text-wrap: nowrap;
            color: red;
            display:flex;
            flex:.5;
            text-shadow: 0 0 20px red;
            " :steps=1 :delay=20>
        </LargeGlitchCenterText>
      </div>

    </div>
    <br>
    <div class="center" style="text-align: center; font-size: 120%" >
      West Windsor-Plainsboro Programming Competition (WWPPC), comprised of the WWP Informatics Tournament (WWPIT) and
      WWPHacks, will be held eventually in 2024. Join us on <a href="https://discord.gg/rv23HbH7rB">Discord</a>!
    </div>
  </div>
</template>

<style>
.row {
  display:flex;
  flex-flow: row wrap;
  flex-direction: row;
  justify-items: stretch;
  justify-content: space-evenly;
  row-gap: 20px;
}
.column {
  display:flex;
  flex-direction: column;
}

.hackbutton {
  flex:.25;
}
.informButton {
  flex:.25;
}
</style>