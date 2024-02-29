<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import LargeLogo from '@/components/LargeLogo.vue';
import { FullscreenModal, ModalMode } from '@/components/ui-defaults/UIDefaults';
import ContestTimer from '@/components/contest/ContestTimer.vue';
import ContestProblemList from '@/components/contest/problems/ContestProblemList.vue';
// import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useServerConnectionStore } from '@/scripts/ServerConnection';
import { useRoute } from 'vue-router';

// const router = useRouter();
const route = useRoute();

const modal = ref<InstanceType<typeof FullscreenModal>>();
const serverConnection = useServerConnectionStore();
let onDisconnect = () => {
    if (route.params.page != 'contest' || route.query.ignore_server !== undefined) return;
    if (modal.value != undefined) modal.value.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.replace('/home/home'));
    else {
        window.alert('Disconnected from server. Reload the page to reconnect. Error: Could not open modal');
        window.location.replace('/home/home');
    }
    serverConnection.socket.off('disconnect', onDisconnect);
    serverConnection.socket.off('timeout', onDisconnect);
}
let onConnectError = () => {
    console.log(route.query.ignore_server)
    if (route.params.page != 'contest' || route.query.ignore_server !== undefined) return;
    if (modal.value != undefined) modal.value.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.replace('/home/home'));
    else {
        window.alert('Could not connect to server. Reload the page to reconnect. Error: Could not open modal');
        window.location.replace('/home/home');
    }
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
                Hey! This page isn't finished. Check back later for updates!
                <br><br>
                Your registration doesn't exist so there's no registration info to display.
            </PanelBody>
            <PanelBody name="problemList">
                <ContestProblemList></ContestProblemList>
            </PanelBody>
            <PanelBody name="problemView">
                Hey! This page isn't finished. Check back later for updates!
                <br><br>
                omg secret page!!!!!
                <br>
                Problem screen (programmatically loaded from problem list)
            </PanelBody>
            <PanelBody name="leaderboard">
                Hey! This page isn't finished. Check back later for updates!
                <br><br>
                1. the-real-tianmu - 573736472056375629219566527959683966273843 xp
                <br>
                2. sp - 2057277575 xp
                <br>
                e. Sampleprovider(sp) - 882646562 xp
                <br>
                &pi;. SampIeprovider(sp) - -5 xp
            </PanelBody>
        </PanelMain>
        <FullscreenModal ref="modal"></FullscreenModal>
    </PanelView>
</template>