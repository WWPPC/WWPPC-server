<script setup lang="ts">
import { useContestManager } from '@/scripts/ContestManager';
import { useRoute } from 'vue-router';

const route = useRoute();

const contestManager = useContestManager();

// flashing animations later
</script>

<template>
    <div class="contestTimerContainer" v-if="contestManager.contest !== null || route.query.ignore_server !== undefined">
        <img src="/assets/timer.svg" class="contestTimerImg">
        <span class="contestTimerTextTop">Round 0</span>
        <!-- use timer component -->
        <span class="contestTimerTextBottom">00:00</span>
    </div>
</template>

<style scoped>
.contestTimerContainer {
    display: grid;
    grid-template-columns: 34px 1fr;
    grid-template-rows: 24px 1fr;
    min-width: 150px;
    max-width: 150px;
    margin-right: 8px;
    padding-top: 12px;
    align-items: center;
    justify-items: center;
    transition: 500ms min-width;
}

.contestTimerImg {
    width: 32px;
    height: 32px;
}

.contestTimerTextTop {
    font-size: 24px;
    text-wrap: nowrap;
    transition: 500ms font-size;
}

.contestTimerTextBottom {
    grid-column: 1 / 3;
    margin-top: -4px;
    font-size: 50px;
    text-wrap: nowrap;
    transition: 500ms font-size;
}

@media (max-width: 700px) {
    .contestTimerContainer {
        min-width: 110px;
        max-width: 110px;
        margin-left: -16px;
    }

    .contestTimerTextTop {
        font-size: 18px;
    }

    .contestTimerTextBottom {
        font-size: 30px;
    }
}</style>