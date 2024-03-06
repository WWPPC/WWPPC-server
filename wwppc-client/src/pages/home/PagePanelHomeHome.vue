<script setup lang="ts">
import LargeGlitchCenterText from '@/components/LargeGlitchCenterText.vue';
</script>

<template>
    <div class="fullBlock">
        <br><br>
        <LargeGlitchCenterText text="WWPPC 2024" fontStyle="
            font-weight: bold;
            font-size: min(20vh, calc(100vw / 8));
            text-wrap: nowrap;
            color: lime;
            text-shadow: -0.05em 0.05em 0px #0F05, 0px 0px 0.02em #0F0;
            " :steps=1 :delay=15 :random=true></LargeGlitchCenterText>
        <br>
        <!-- sorry vikram your code will have all of the conflicts -->
        <LargeGlitchCenterText text="??/??" fontStyle="
            font-weight: bold;
            font-size: min(calc(50vh - 50px), calc(100vw / 12));
            text-wrap: nowrap;
            color: red;
            " :steps=1 :delay=40></LargeGlitchCenterText>
        <br>
        <div class="center" style="text-align: center">
            West Windsor-Plainsboro Programming Competition (WWPPC), comprised of the WWP Informatics Tournament (WWPIT) and WWPHacks, will be held eventually in 2024. Join us on <a href="https://discord.gg/rv23HbH7rB">Discord</a>! 
        </div>
    </div>
    <div class="fullBlock">
        
    </div>
</template>