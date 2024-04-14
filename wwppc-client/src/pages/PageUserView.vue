<script setup lang="ts">
import { PanelView, PanelHeader, PanelNavLargeLogo, PanelMain, PanelBody, PanelRightList, PanelNavList } from '@/components/panels/PanelManager';
import LoadingCover from '@/components/LoadingCover.vue';
import NotFound from '@/pages/NotFound.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAccountManager, type AccountData } from '@/scripts/AccountManager';
import { ref, watch } from 'vue';
import { globalModal, ModalMode } from '@/components/ui-defaults/UIDefaults';
import { useServerConnection } from '@/scripts/ServerConnection';
import UserDisp from '@/components/UserDisp.vue';
import { autoGlitchTextTransition } from '@/components/ui-defaults/TextTransitions';

const route = useRoute();
const router = useRouter();

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
watch(() => route.params, () => {
    if (route.params.page != 'user' || route.query.ignore_server !== undefined) return;
    serverConnection.handshakePromise.then(() => {
        if (serverConnection.manualLogin && !serverConnection.loggedIn) router.push({ path: '/login', query: { redirect: route.fullPath } });
    });
    loadUserData();
});
watch(() => serverConnection.loggedIn, () => {
    if (route.params.page == 'user') loadUserData();
});

const username = autoGlitchTextTransition(() => '@' + (userData.value?.username ?? ''), 40);
const displayName = autoGlitchTextTransition(() => userData.value?.displayName ?? '', 40);
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
                <div class="userViewGrid">
                    <div class="userViewProfileHeaderWrapper">
                        <div class="centered">
                            <div class="userViewProfileHeader">
                                <img class="userViewProfileImg" :src="userData?.profileImage">
                                <span class="userViewDisplayName">{{ displayName }}</span>
                                <span class="userViewUsername">{{ username }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="vStack">
                        {{ userData }}
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                        <br>a
                    </div>
                </div>
            </PanelBody>
            <NotFound v-if="route.params.userView == undefined || userData === null"></NotFound>
            <LoadingCover text="Signing you in..." :ignore-server="true"></LoadingCover>
        </PanelMain>
    </PanelView>
</template>

<style scoped>
.userViewGrid {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.vStack {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: scroll;
}

.userViewProfileHeaderWrapper {
    min-height: 40vh;
    max-height: 40vh;
    background-color: black;
    box-shadow: 0px 0px 24px white;
    z-index: 1;
}

.userViewProfileHeader {
    display: grid;
}
</style>