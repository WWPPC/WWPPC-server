<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView, PanelNavLargeLogo } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import ContestTimer from '@/components/contest/ContestTimer.vue';
import { useServerConnection } from '@/scripts/ServerConnection';
import { useRoute } from 'vue-router';
import PagePanelContestInfo from './contest/PagePanelContestInfo.vue';
import PagePanelContestContest from './contest/PagePanelContestContest.vue';
import PagePanelContestProblemList from './contest/PagePanelContestProblemList.vue';
import PagePanelContestProblemView from './contest/PagePanelContestProblemView.vue';
import PagePanelContestLeaderboard from './contest/PagePanelContestLeaderboard.vue';
import { ref, watch } from 'vue';
import { useContestManager } from '@/scripts/ContestManager';

const route = useRoute();
const ignoreServer = ref(route.query.ignore_server !== undefined);
watch(() => route.query.ignore_server, () => {
    ignoreServer.value = route.query.ignore_server !== undefined;
});

const serverConnection = useServerConnection();
const contestManager = useContestManager();

serverConnection.connectionSensitivePagesInclude.add('/contest');
serverConnection.loginSensitivePagesInclude.add('/contest');
serverConnection.connectionSensitivePagesExclude.add('/contest/home');
serverConnection.loginSensitivePagesExclude.add('/contest/home');
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
            </PanelBody>
            <PanelBody name="problemList" title="Problem List">
                <PagePanelContestProblemList v-if="serverConnection.loggedIn || ignoreServer"></PagePanelContestProblemList>
            </PanelBody>
            <PanelBody name="problemView" title="Problem">
                <PagePanelContestProblemView v-if="serverConnection.loggedIn || ignoreServer"></PagePanelContestProblemView>
            </PanelBody>
            <PanelBody name="leaderboard" title="Leaderboard">
                <PagePanelContestLeaderboard v-if="serverConnection.loggedIn || ignoreServer"></PagePanelContestLeaderboard>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>

<style scoped></style>