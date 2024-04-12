<script setup lang="ts">
import { PanelView, PanelHeader, PanelNavLargeLogo, PanelMain, PanelBody, PanelRightList, PanelNavList } from '@/components/panels/PanelManager';
import LoadingCover from '@/components/LoadingCover.vue';
import NotFound from '@/pages/NotFound.vue';
import { useRoute } from 'vue-router';
import { useAccountManager, type AccountData } from '@/scripts/AccountManager';
import { ref, watch } from 'vue';
import { globalModal, ModalMode } from '@/components/ui-defaults/UIDefaults';
import { useServerConnection } from '@/scripts/ServerConnection';
import UserDisp from '@/components/UserDisp.vue';

const route = useRoute();

const modal = globalModal();
const serverConnection = useServerConnection();
const accountManager = useAccountManager();

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

const userData = ref<AccountData | null>(null);
const loadUserData = async () => {
    userData.value = await accountManager.getUserData(route.params.userView?.toString());
    if (userData.value == null) userData.value = {
        username: 'test',
        email: 'oof@test.buh',
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User',
        profileImage: 'nope',
        bio: 'Just a test user adsfsadf asdf sadf dsaf \nsadf\nasfd\n',
        school: 'Rickroll Academy',
        grade: 99999,
        experience: 4,
        languages: ['c', 'py'],
        registrations: [{
            contest: 'WWPIT',
            division: 1,
            name: 'Test Contest'
        }]
    }
};
watch(() => route.params.userView, () => {
    if (route.params.page == 'user') loadUserData();
});

serverConnection.handshakePromise.then(() => {
    if (route.params.page == 'user') loadUserData();
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
                <div class="vStack">
                    <!-- scroll timeline?? -->
                </div>
                {{ userData }}
            </PanelBody>
            <NotFound v-if="route.params.userView == undefined || userData === null"></NotFound>
            <LoadingCover text="Connecting..." :ignore-server="true"></LoadingCover>
        </PanelMain>
    </PanelView>
</template>

<style scoped>
.vStack {
    display: flex;
    flex-direction: column;
}
</style>