<script setup lang="ts">
import LargeGlitchCenterText from '@/components/LargeGlitchCenterText.vue';
</script>

<template>
    <div class="fullBlock">
        <br><br>
        <LargeGlitchCenterText text="WWPPC 2024" fontStyle="
            font-weight:bold;
            font-size: min(calc(50vh - 50px), calc(100vw / 12));
            text-wrap: nowrap;
            color: lime;
            text-shadow: -0.05em 0.05em 0px #0F05, 0px 0px 0.02em #0F0;
            " :steps=1 :delay=10></LargeGlitchCenterText>
        <br>
        <LargeGlitchCenterText text="??/??" fontStyle="
             font-weight:bold;
            font-size: min(calc(50vh - 50px), calc(100vw / 12));
            text-wrap: nowrap;
            color: red;
            " :steps=1 :delay=10></LargeGlitchCenterText>
        <br>
        <div class="center" style="text-align: center">
            West Windsor-Plainsboro Programming Competition (WWPPC) will be held eventually in 2024. Join us on <a href="https://discord.gg/rv23HbH7rB" style="color: lime;">Discord</a>! 
        </div>
    </div>
    <div class="fullBlock">
        
    </div>
</template>