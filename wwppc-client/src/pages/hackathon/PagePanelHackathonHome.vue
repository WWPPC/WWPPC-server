<script setup lang="ts">
import { HeaderedTable } from '@/components/ui-defaults/UIContainers';
import { GlitchText } from '@/components/ui-defaults/UIDefaults';
</script>

<template>
    <div class="centered column">
        <GlitchText text="WWP HACKS" font-size="min(20vh, calc(100vw / 8))" color="lime" shadow glow :steps=1 :delay=20></GlitchText>
        <!-- Schedule Table -->
        <div class="schedule">
            <h1>Schedule</h1>
            <HeaderedTable width="100%" :content="{
            headers: ['Time', 'thing'],
            data: [
                ['10:30', 'meet and register'],
                ['10:40', 'eat food'],
                ['10:50', 'start '],
                ['10:60', 'build app']
            ]
        }"></HeaderedTable>
        </div>
        <i>These are example times and do not reflect any real plans. Especially not the 10:60 part.</i>
    </div>
</template>

<style></style>