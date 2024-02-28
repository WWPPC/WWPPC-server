<script setup lang="ts">
import PageContest from '@/pages/PageContest.vue';
import PageTest from '@/pages/PageTest.vue';
import PageHackathon from '@/pages/PageHackathon.vue';
import PageHome from '@/pages/PageHome.vue';
import NotFound from '@/pages/NotFound.vue';
import SuperSecretFeature from '@/components/SuperSecretFeature.vue';
</script>

<template name="app">
    <NotFound></NotFound>
    <PageHome></PageHome>
    <PageHackathon></PageHackathon>
    <PageContest></PageContest>
    <PageTest></PageTest>
    <SuperSecretFeature></SuperSecretFeature>
</template>