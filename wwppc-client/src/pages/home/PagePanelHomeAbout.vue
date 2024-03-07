<script setup lang="ts">
import LargeGlitchCenterText from '@/components/LargeGlitchCenterText.vue';
import { HeaderedThable } from '@/components/ui-defaults/UIContainers';
</script>

<template>
    <div class="centered">
        <LargeGlitchCenterText text="WWPPC Team" style="font: bold 48px 'Source Code Pro'; color: lime;" :delay=10></LargeGlitchCenterText>
    </div>
    <HeaderedTable width="50%" :content="{
        headers: ['Arav Maheria'], //spaghetti moment
        data: [
            ['Erik Ji'],
            ['Jie Gao'], 
            ['Maitian Sha'],
            ['Rishkesh Anabathula'],
            ['Suvanth Erranki'],
            ['Vikram Karamsetty'],
        ],
        generator: (row, col, data) => ({ text: `${data}`}),
    }"></HeaderedTable>
</template>

<style>
</style>