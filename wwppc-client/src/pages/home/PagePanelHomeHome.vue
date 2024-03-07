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
      <UIButton class = "hackbutton" text="HACKATHON" font-size="25px" height="50px" @click= "() => {$router.push('/hackathon')}"></UIButton>
      <!-- sorry vikram your code will have all of the conflicts -->
      <LargeGlitchCenterText text="2/2024" style="
            font-weight: bold;
            font-size: min(calc(50vh - 50px), calc(100vw / 12));
            text-wrap: nowrap;
            color: red;
            display:flex;
            flex:.5;
            text-shadow: 0 0 20px red;
            " :steps=1 :delay=20>
      </LargeGlitchCenterText>
      <UIButton class = "informButton" text="INFORMATICS TOURNAMENT" font-size="25px" height="50px" @click="()=> {$router.push('/contest')}"></UIButton>
    </div>
    <br>
    <div class="center" style="text-align: center; font-size: 120%" >
      West Windsor-Plainsboro Programming Competition (WWPPC), comprised of the WWP Informatics Tournament (WWPIT) and
      WWPHacks, will be held eventually in 2024. Join us on <a href="https://discord.gg/rv23HbH7rB">Discord</a>!
    </div>
  </div>
</template>

<style>
.hackbutton {
  flex:.25;
}
.informButton {
  flex:.25;
}
</style>