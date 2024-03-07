<script setup lang="ts">
import { HeaderedTable } from '@/components/ui-defaults/UIContainers';
import { GlitchText } from '@/components/ui-defaults/UIDefaults';
</script>

<template>
    <div class="centered">
        <GlitchText text="WWPPC Team" color="lime" font-size="80px" :delay=10></GlitchText>
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
            generator: (row, col, data) => ({ text: `${data}` }),
        }"></HeaderedTable>
</template>

<style></style>