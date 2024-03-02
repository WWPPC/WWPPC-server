<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import { ModalMode, globalModal } from '@/components/ui-defaults/UIDefaults';
import ContestTimer from '@/components/contest/ContestTimer.vue';
import { useServerConnection } from '@/scripts/ServerConnection';
import { useRoute } from 'vue-router';
import PanelNavLargeLogo from '@/components/panels/PanelNavLargeLogo.vue';
import PagePanelContestInfo from './contest/PagePanelContestInfo.vue';
import PagePanelContestLeaderboard from './contest/PagePanelContestLeaderboard.vue';
import PagePanelContestProblemList from './contest/PagePanelContestProblemList.vue';
import PagePanelContestProblemView from './contest/PagePanelContestProblemView.vue';

const route = useRoute();

const modal = globalModal();

const serverConnection = useServerConnection();
let onDisconnect = () => {
    if (route.params.page != 'contest' || route.query.ignore_server !== undefined) return;
    modal.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.replace('/home/home'));
    serverConnection.socket.off('disconnect', onDisconnect);
    serverConnection.socket.off('timeout', onDisconnect);
}
let onConnectError = () => {
    if (route.params.page != 'contest' || route.query.ignore_server !== undefined) return;
    modal.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.replace('/home/home'));
    serverConnection.socket.off('connect_fail', onConnectError);
    serverConnection.socket.off('connect_error', onConnectError);
}
serverConnection.socket.on('disconnect', onDisconnect);
serverConnection.socket.on('timeout', onDisconnect);
serverConnection.socket.on('connect_fail', onConnectError);
serverConnection.socket.on('connect_error', onConnectError);
</script>

<template>
    <PanelView name="contest">
        <PanelHeader>
            <PanelNavLargeLogo></PanelNavLargeLogo>
            <PanelNavList>
                <PanelNavButton text="Home" for="/home"></PanelNavButton>
                <PanelNavButton text="Contest" for="/contest/info" :is-default=true></PanelNavButton>
                <PanelNavButton text="Problems" for="/contest/problemList"></PanelNavButton>
                <PanelNavButton text="Leaderboard" for="/contest/leaderboard"></PanelNavButton>
            </PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
                <ContestTimer></ContestTimer>
            </PanelRightList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="info" :is-default=true>
                <PagePanelContestInfo></PagePanelContestInfo>
            </PanelBody>
            <PanelBody name="problemList">
                <PagePanelContestProblemList></PagePanelContestProblemList>
            </PanelBody>
            <PanelBody name="problemView">
                <PagePanelContestProblemView></PagePanelContestProblemView>
            </PanelBody>
            <PanelBody name="leaderboard">
                <PagePanelContestLeaderboard></PagePanelContestLeaderboard>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>