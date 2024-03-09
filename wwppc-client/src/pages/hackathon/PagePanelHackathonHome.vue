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
            <HeaderedTable :content="{
            data: [
                ['10:30', 'meet and register'],
                ['10:40', 'eat food'],
                ['10:50', 'start '],
                ['10:60', 'build app']
            ]

        }
            "></HeaderedTable>
        </div>
    </div>
</template>

<style></style>