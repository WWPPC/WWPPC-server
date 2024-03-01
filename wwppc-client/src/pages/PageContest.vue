<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import LargeLogo from '@/components/LargeLogo.vue';
import { ModalMode, globalModal } from '@/components/ui-defaults/UIDefaults';
import ContestTimer from '@/components/contest/ContestTimer.vue';
import { useServerConnectionStore } from '@/scripts/ServerConnection';
import { useRoute } from 'vue-router';
import PagePanelInfo from './contest/PagePanelInfo.vue';
import PagePanelLeaderboard from './contest/PagePanelLeaderboard.vue';
import PagePanelProblemList from './contest/PagePanelProblemList.vue';
import PagePanelProblemView from './contest/PagePanelProblemView.vue';

// const router = useRouter();
const route = useRoute();

const modal = globalModal();

const serverConnection = useServerConnectionStore();
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
            <LargeLogo></LargeLogo>
            <PanelNavList>
                <PanelNavButton text="Home" for="/home"></PanelNavButton>
                <PanelNavButton text="Contest" for="/contest/info" :is-default=true></PanelNavButton>
                <PanelNavButton text="Problems" for="/contest/problemList"></PanelNavButton>
                <PanelNavButton text="Leaderboards" for="/contest/leaderboard"></PanelNavButton>
            </PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
                <ContestTimer></ContestTimer>
            </PanelRightList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="info" :is-default=true>
                <PagePanelInfo></PagePanelInfo>
            </PanelBody>
            <PanelBody name="problemList">
                <PagePanelProblemList></PagePanelProblemList>
            </PanelBody>
            <PanelBody name="problemView">
                <PagePanelProblemView></PagePanelProblemView>
            </PanelBody>
            <PanelBody name="leaderboard">
                <PagePanelLeaderboard></PagePanelLeaderboard>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>