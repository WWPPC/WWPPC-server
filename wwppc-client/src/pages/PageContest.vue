<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import { ModalMode, globalModal } from '@/components/ui-defaults/UIDefaults';
import ContestTimer from '@/components/contest/ContestTimer.vue';
import { useServerConnection } from '@/scripts/ServerConnection';
import { useRoute, useRouter } from 'vue-router';
import PanelNavLargeLogo from '@/components/panels/PanelNavLargeLogo.vue';
import PagePanelContestInfo from './contest/PagePanelContestInfo.vue';
import PagePanelContestLeaderboard from './contest/PagePanelContestLeaderboard.vue';
import PagePanelContestProblemList from './contest/PagePanelContestProblemList.vue';
import PagePanelContestProblemView from './contest/PagePanelContestProblemView.vue';
import { watch } from 'vue';
import LoadingCover from '@/components/LoadingCover.vue';
import PagePanelContestContest from './contest/PagePanelContestContest.vue';

const router = useRouter();
const route = useRoute();

const modal = globalModal();
const serverConnection = useServerConnection();
serverConnection.onconnecterror(() => {
    if (route.params.page != 'contest' || route.params.panel == 'home' || route.params.panel === undefined || route.query.ignore_server !== undefined) return;
    modal.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.replace('/contest/home'));
});
serverConnection.ondisconnect(() => {
    if (route.params.page != 'contest' || route.params.panel == 'home' || route.params.panel === undefined || route.query.ignore_server !== undefined) return;
    modal.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.replace('/contest/home'));
});
watch(() => route.params.page, () => {
    if (route.params.page == 'contest' && route.params.panel != 'home' && route.params.panel !== undefined && route.query.ignore_server === undefined) {
        serverConnection.handshakePromise.then(() => {
            if (serverConnection.manualLogin && !serverConnection.loggedIn) router.push({ path: '/login', query: { redirect: route.fullPath, clearQuery: 1 } });
        });
        if (serverConnection.connectError) modal.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.replace('/contest/home'));
        if (serverConnection.handshakeComplete && !serverConnection.connected && route.query.ignore_server == undefined) {
            modal.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.replace('/contest/home'));
        }
    }
});
</script>

<template>
    <PanelView name="contest" title="WWPIT">
        <PanelHeader>
            <PanelNavLargeLogo></PanelNavLargeLogo>
            <PanelNavList>
                <PanelNavButton text="WWPPC" for="/home"></PanelNavButton>
                <PanelNavButton text="Home" for="/contest/home" is-default></PanelNavButton>
                <div v-if="serverConnection.loggedIn || route.query.ignore_server !== undefined" style="display: flex;">
                    <PanelNavButton text="Contest" for="/contest/contest"></PanelNavButton>
                </div>
                <div v-if="'' || route.query.ignore_server !== undefined" style="display: flex;">
                    <PanelNavButton text="Problems" for="/contest/problemList"></PanelNavButton>
                    <PanelNavButton text="Leaderboard" for="/contest/leaderboard"></PanelNavButton>
                </div>
            </PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
                <ContestTimer></ContestTimer>
            </PanelRightList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="home" title="Home" is-default>
                <PagePanelContestInfo></PagePanelContestInfo>
            </PanelBody>
            <PanelBody name="contest" title="Contest">
                <PagePanelContestContest></PagePanelContestContest>
                <LoadingCover text="Logging you in..." :ignore-server="true"></LoadingCover>
            </PanelBody>
            <PanelBody name="problemList" title="Problem List">
                <PagePanelContestProblemList></PagePanelContestProblemList>
                <LoadingCover text="Logging you in..." :ignore-server="true"></LoadingCover>
            </PanelBody>
            <PanelBody name="problemView" title="Problem">
                <PagePanelContestProblemView></PagePanelContestProblemView>
                <LoadingCover text="Logging you in..." :ignore-server="true"></LoadingCover>
            </PanelBody>
            <PanelBody name="leaderboard" title="Leaderboard">
                <PagePanelContestLeaderboard></PagePanelContestLeaderboard>
                <LoadingCover text="Logging you in..." :ignore-server="true"></LoadingCover>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>