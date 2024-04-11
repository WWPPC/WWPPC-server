<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelView, PanelNavLargeLogo } from '@/components/panels/PanelManager';
import PagePanelAccountProfile from './account/PagePanelAccountProfile.vue';
import { ModalMode, globalModal } from '@/components/ui-defaults/UIDefaults';
import { useServerConnection } from '@/scripts/ServerConnection';
import { useRoute, useRouter } from 'vue-router';
import LoadingCover from '@/components/LoadingCover.vue';
import { watch } from 'vue';
import PagePanelAccountWrapper from './account/PagePanelAccountWrapper.vue';

const router = useRouter();
const route = useRoute();

const modal = globalModal();
const serverConnection = useServerConnection();

serverConnection.onconnecterror(() => {
    if (route.params.page != 'account' || route.query.ignore_server !== undefined) return;
    modal.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.replace('/home'));
});
serverConnection.ondisconnect(() => {
    if (route.params.page != 'account' || route.query.ignore_server !== undefined) return;
    modal.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.replace('/home'));
});
serverConnection.handshakePromise.then(() => {
    if (route.params.page != 'account' || route.query.ignore_server !== undefined) return;
    if (!serverConnection.loggedIn) router.push({ path: '/login', query: { redirect: route.fullPath, clearQuery: 1 } });
});
watch(() => route.params.page, () => {
    if (route.params.page != 'account' || route.query.ignore_server !== undefined) return;
    serverConnection.handshakePromise.then(() => {
        if (serverConnection.manualLogin && !serverConnection.loggedIn) router.push({ path: '/login', query: { redirect: route.fullPath, clearQuery: 1 } });
    });
    if (serverConnection.connectError) modal.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.replace('/home'));
    if (serverConnection.handshakeComplete && !serverConnection.connected && route.query.ignore_server == undefined) {
        modal.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.replace('/home'));
    }
});
</script>

<template>
    <PanelView name="account" title="WWPPC">
        <PanelHeader>
            <PanelNavLargeLogo></PanelNavLargeLogo>
            <PanelNavList>
                <PanelNavButton text="Home" for="/home"></PanelNavButton>
                <PanelNavButton text="Account" for="/account/profile" is-default></PanelNavButton>
                <PanelNavButton text="Register" for="/account/registrations"></PanelNavButton>
            </PanelNavList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="profile" title="Account" is-default>
                <PagePanelAccountWrapper v-if="serverConnection.loggedIn">
                    <PagePanelAccountProfile></PagePanelAccountProfile>
                </PagePanelAccountWrapper>
            </PanelBody>
            <PanelBody name="registrations" title="Registrations">
                <PagePanelAccountWrapper v-if="serverConnection.loggedIn">
                </PagePanelAccountWrapper>
            </PanelBody>
            <LoadingCover text="Logging you in..." :ignore-server="true"></LoadingCover>
        </PanelMain>
    </PanelView>
</template>

<style scoped></style>