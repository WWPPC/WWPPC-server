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
    <LargeGlitchCenterText text="??/24" style="
            font-weight: bold;
            font-size: min(calc(50vh - 50px), calc(100vw / 12));
            text-wrap: nowrap;
            color: red;
            display:flex;
            flex:.5;
            text-shadow: 0 0 20px red;
            " :steps=1 :delay=20>
      </LargeGlitchCenterText>
    <br>
    <UIButton text="Informatics Tournament" font-size="calc(3vw + 5px)" width="100%" height="calc(6vw + 10px)" :glitchOnMount=true @click="()=> {$router.push('/contest')}"></UIButton>
    <br><br>
    <UIButton text="Hackathon" font-size="calc(3vw + 5px)" width="100%" height="calc(6vw + 10px)" :glitchOnMount=true @click= "() => {$router.push('/hackathon')}"></UIButton>
    <br><br>
    <div class="center" style="text-align: center; font-size: calc(1vw + 10px)" >
      West Windsor-Plainsboro Programming Competition (WWPPC), comprised of the WWP Informatics Tournament (WWPIT) and
      WWPHacks, will be held eventually in 2024. Join us on <a href="https://discord.gg/rv23HbH7rB">Discord</a>!
    </div>
  </div>
</template>

<style>
</style>