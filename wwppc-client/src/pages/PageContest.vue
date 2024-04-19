<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView, PanelNavLargeLogo } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import { ModalMode, globalModal } from '@/components/ui-defaults/UIDefaults';
import ContestTimer from '@/components/contest/ContestTimer.vue';
import { useServerConnection } from '@/scripts/ServerConnection';
import { useRoute, useRouter } from 'vue-router';
import PagePanelContestInfo from './contest/PagePanelContestInfo.vue';
import PagePanelContestContest from './contest/PagePanelContestContest.vue';
import PagePanelContestProblemList from './contest/PagePanelContestProblemList.vue';
import PagePanelContestProblemView from './contest/PagePanelContestProblemView.vue';
import PagePanelContestLeaderboard from './contest/PagePanelContestLeaderboard.vue';
import { ref, watch } from 'vue';
import LoadingCover from '@/components/LoadingCover.vue';
import { useContestManager } from '@/scripts/ContestManager';

const router = useRouter();
const route = useRoute();
const ignoreServer = ref(route.query.ignore_server !== undefined);
watch(() => route.query.ignore_server, () => {
    ignoreServer.value = route.query.ignore_server !== undefined;
});

const modal = globalModal();
const serverConnection = useServerConnection();
const contestManager = useContestManager();

serverConnection.onconnecterror(() => {
    if (route.params.page != 'contest' || route.params.panel == 'home' || route.params.panel === undefined || ignoreServer.value) return;
    modal.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.reload());
});
serverConnection.ondisconnect(() => {
    if (route.params.page != 'contest' || route.params.panel == 'home' || route.params.panel === undefined || ignoreServer.value) return;
    modal.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.reload());
});
serverConnection.handshakePromise.then(() => {
    if (route.params.page != 'contest' || route.params.panel == 'home' || route.params.panel === undefined || ignoreServer.value) return;
    if (!serverConnection.loggedIn) router.push({ path: '/login', query: { redirect: route.fullPath, clearQuery: 1 } });
});
watch(() => route.params, () => {
    if (route.params.page != 'contest' || route.params.panel == 'home' || route.params.panel === undefined || ignoreServer.value) return;
    serverConnection.handshakePromise.then(() => {
        if (serverConnection.manualLogin && !serverConnection.loggedIn) router.push({ path: '/login', query: { redirect: route.fullPath } });
    });
    if (serverConnection.connectError) modal.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.reload());
    if (serverConnection.handshakeComplete && !serverConnection.connected && route.query.ignore_server == undefined) modal.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.reload());
});
</script>

<template>
    <PanelView name="contest" title="WWPIT">
        <PanelHeader>
            <PanelNavLargeLogo></PanelNavLargeLogo>
            <PanelNavList>
                <PanelNavButton text="Home" for="/home"></PanelNavButton>
                <PanelNavButton text="WWPIT" for="/contest/home" is-default></PanelNavButton>
                <div v-if="serverConnection.loggedIn || ignoreServer" style="display: flex;">
                    <PanelNavButton text="Contest" for="/contest/contest"></PanelNavButton>
                </div>
                <div v-if="contestManager.inContest || ignoreServer" style="display: flex;">
                    <PanelNavButton text="Problems" for="/contest/problemList"></PanelNavButton>
                    <PanelNavButton text="Leaderboard" for="/contest/leaderboard"></PanelNavButton>
                </div>
            </PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
                <ContestTimer v-if="contestManager.inContest || ignoreServer"></ContestTimer>
            </PanelRightList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="home" title="Home" is-default scroll-snap>
                <PagePanelContestInfo></PagePanelContestInfo>
            </PanelBody>
            <PanelBody name="contest" title="Contest">
                <PagePanelContestContest v-if="serverConnection.loggedIn || ignoreServer"></PagePanelContestContest>
                <LoadingCover text="Logging you in..." :ignore-server="true"></LoadingCover>
            </PanelBody>
            <PanelBody name="problemList" title="Problem List">
                <PagePanelContestProblemList v-if="serverConnection.loggedIn || ignoreServer"></PagePanelContestProblemList>
                <LoadingCover text="Logging you in..." :ignore-server="true"></LoadingCover>
            </PanelBody>
            <PanelBody name="problemView" title="Problem">
                <PagePanelContestProblemView v-if="serverConnection.loggedIn || ignoreServer"></PagePanelContestProblemView>
                <LoadingCover text="Logging you in..." :ignore-server="true"></LoadingCover>
            </PanelBody>
            <PanelBody name="leaderboard" title="Leaderboard">
                <PagePanelContestLeaderboard v-if="serverConnection.loggedIn || ignoreServer"></PagePanelContestLeaderboard>
                <LoadingCover text="Logging you in..." :ignore-server="true"></LoadingCover>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>

<style scoped></style>