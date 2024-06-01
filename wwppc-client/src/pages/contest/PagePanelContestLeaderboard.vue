<script setup lang="ts">
import { GlitchText } from '@/components/ui-defaults/UIDefaults';
import { useContestManager } from '@/scripts/ContestManager';
import { useRouter } from 'vue-router';

const contestManager = useContestManager();

const router = useRouter();
</script>

<template>
    <GlitchText text="Leaderboards" class="leaderboardTitle" font-size="var(--font-title)" color="lime" shadow glow :steps=2 :delay=10 random on-visible></GlitchText>
    <div class="centered">
        <div class="leaderboard">
            <div class="leaderboardItem" v-for="(item, i) of contestManager.scoreboard" :key="i">
                {{ i + 1 }}. <span class="leaderboardLink" @click="router.push('/user/@' + item.username)">@{{ item.username }}</span> - {{ item.score }} points
            </div>
        </div>
    </div>
    <!-- future - make display display name instead of username -->
    <!-- future - instead of just a link, show user summary in sidebar? -->
</template>

<style scoped>
.leaderboardTitle {
    text-align: center;
}

.leaderboard {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
}

.leaderboardItem {
    background-color: #333;
    font-size: var(--font-large);
    border-radius: 8px;
    padding: 4px 8px;
}

.leaderboardLink {
    color: lime;
    text-decoration: underline;
    cursor: pointer;
}
</style>