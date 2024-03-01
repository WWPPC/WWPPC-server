<script setup lang="ts">
import LargeGlitchCenterText from '@/components/LargeGlitchCenterText.vue';
</script>

<template>
    <div class="fullBlock">
        <br><br>
        <LargeGlitchCenterText text="WWP-IT + WWP-HACKS" fontStyle="
             font-weight:bold;
            font-size: min(calc(50vh - 50px), calc(100vw / 12));
            text-wrap: nowrap;
            color: lime;
            text-shadow: -0.05em 0.05em 0px #0F05, 0px 0px 0.02em #0F0;
            " :steps=1 :delay=10></LargeGlitchCenterText>
        <br>
        <div class="center">
            <!-- show signup, date, etc also arrow -->
        </div>
    </div>
    <div class="fullBlock">
        wow thing
        <br><br>
        pretend this is a discord logo JOIN OUR DISCORD! https://discord.gg/97um6csDGn
        <br>
        I should probably make this into a component
    </div>
</template>