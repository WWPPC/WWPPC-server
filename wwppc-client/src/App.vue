<script setup lang="ts">
import { FullscreenModal, globalModal } from '@/components/ui-defaults/UIDefaults';
import PageContest from '@/pages/PageContest.vue';
import PageTest from '@/pages/PageTest.vue';
import PageHackathon from '@/pages/PageHackathon.vue';
import PageHome from '@/pages/PageHome.vue';
import PageLogin from '@/pages/PageLogin.vue';
import PageAccount from './pages/PageAccount.vue';
import NotFound from '@/pages/NotFound.vue';
import SuperSecretFeature from '@/components/SuperSecretFeature.vue';
import { ref, watch } from 'vue';
import '@/scripts/app';

const modalComponent = ref<InstanceType<typeof FullscreenModal>>();

const modal = globalModal();
watch(() => modalComponent.value, () => {
    if (modalComponent.value != undefined) modal.setModal(modalComponent.value);
});

window.addEventListener('error', (err) => {
    modal.showModal({ title: 'An Error Occured', content: `<span style="color: red;">${err.message}<br>${err.filename} ${err.lineno}:${err.colno}</span>`, color: 'red'});
});
</script>

<template name="app">
    <NotFound></NotFound>
    <PageHome></PageHome>
    <PageHackathon></PageHackathon>
    <PageContest></PageContest>
    <PageTest></PageTest>
    <PageAccount></PageAccount>
    <PageLogin></PageLogin>
    <FullscreenModal ref="modalComponent"></FullscreenModal>
    <SuperSecretFeature></SuperSecretFeature>
</template>