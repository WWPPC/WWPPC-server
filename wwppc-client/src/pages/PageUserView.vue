<script setup lang="ts">
import { PanelView, PanelHeader, PanelNavLargeLogo, PanelMain, PanelBody, PanelRightList, PanelNavList } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import { useRoute } from 'vue-router';
import PagePanelUserView from './userView/PagePanelUserView.vue';
import { useServerConnection } from '@/scripts/ServerConnection';
import { globalModal } from '@/components/ui-defaults/UIDefaults';
import { watch } from 'vue';

const route = useRoute();

const modal = globalModal();
const serverConnection = useServerConnection();

// connection stuff copy+paste spaghetti
serverConnection.onconnecterror(() => {
    if (route.params.page != 'user' || route.query.ignore_server !== undefined) return;
    modal.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.reload());
});
serverConnection.ondisconnect(() => {
    if (route.params.page != 'user' || route.query.ignore_server !== undefined) return;
    modal.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.reload());
});
watch(() => route.params.page, async () => {
    if (route.params.page == 'user' && route.query.ignore_server === undefined) {
        if (serverConnection.connectError) modal.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.reload());
        if (serverConnection.handshakeComplete && !serverConnection.connected && route.query.ignore_server == undefined) modal.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.reload());
    }
});
</script>

<template>
    <PanelView name="user" title="WWPPC">
        <PanelHeader>
            <PanelNavLargeLogo></PanelNavLargeLogo>
            <PanelNavList></PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
            </PanelRightList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="default" :title="route.params.userView?.toString()" is-default>
                <PagePanelUserView></PagePanelUserView>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>

<style scoped></style>