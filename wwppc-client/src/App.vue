<script setup lang="ts">
import { UIButton } from './components/ui-defaults/UIDefaults';
import PageContest from './pages/PageContest.vue';
import PageHackathon from './pages/PageHackathon.vue';
import PageHome from './pages/PageHome.vue';
</script>

<template>
    <PageHome v-if="$route.params.sub == undefined"></PageHome>
    <PageHackathon v-else-if="$route.params.sub == 'hackathon'"></PageHackathon>
    <PageContest v-else-if="$route.params.sub == 'contest'"></PageContest>
    <div v-else class="notFound">
        <span style="color: red; font-size: 32px;">BUG: NOT FOUND</span>
        <br>
        &lt;span style="color: red;"&gt;IS BORKEN!!!&lt;/span&gt;
        <br>
        <br>
        <span>
            <UIButton text="Magical Fix Button" color="lime" width="200px" @click="$router.push('/')"></UIButton>
        </span>
    </div>
</template>

<style>
.notFound {
    display: flex;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}
</style>