<script setup lang="ts">
import { UIButton } from './components/ui-defaults/UIDefaults';
import PageContest from './pages/PageContest.vue';
import PageTest from './pages/PageTest.vue';
import PageHackathon from './pages/PageHackathon.vue';
import PageHome from './pages/PageHome.vue';
</script>

<template name="app">
    <PageHome v-if="$route.params.page == undefined || $route.params.page == 'home'"></PageHome>
    <PageHackathon v-else-if="$route.params.page == 'hackathon'"></PageHackathon>
    <PageContest v-else-if="$route.params.page == 'contest'"></PageContest>
    <PageTest v-else-if="$route.params.page == 'test'"></PageTest>
    <div v-else class="notFound">
        <span style="color: red; font-size: 32px;">BUG: 404 Not Found</span>
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