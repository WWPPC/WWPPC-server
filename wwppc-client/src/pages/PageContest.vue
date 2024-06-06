<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView, PanelNavLargeLogo } from '@/components/panels/PanelManager';
import UserDisp from '@/components/common/UserDisp.vue';
import ContestTimer from '@/components/contest/ContestTimer.vue';
import { useRoute } from 'vue-router';
import PagePanelContestInfo from './contest/PagePanelContestInfo.vue';
import PagePanelContestContest from './contest/PagePanelContestContest.vue';
import PagePanelContestProblemList from './contest/PagePanelContestProblemList.vue';
import PagePanelContestProblemView from './contest/PagePanelContestProblemView.vue';
import PagePanelContestLeaderboard from './contest/PagePanelContestLeaderboard.vue';
import PagePanelArchiveList from './archive/PagePanelArchiveList.vue';
import PagePanelArchiveProblem from './archive/PagePanelArchiveProblem.vue';
import { ref, watch } from 'vue';
import { useContestManager } from '@/scripts/ContestManager';
import { useConnectionEnforcer } from '@/scripts/ConnectionEnforcer';
import { useServerConnection } from '@/scripts/ServerConnection';

const route = useRoute();
const ignoreServer = ref(route.query.ignore_server !== undefined);
watch(() => route.query.ignore_server, () => {
    ignoreServer.value = route.query.ignore_server !== undefined;
});

const serverConnection = useServerConnection();
const connectionEnforcer = useConnectionEnforcer();
const contestManager = useContestManager();

connectionEnforcer.connectionInclude.add('/contest');
connectionEnforcer.loginInclude.add('/contest');
connectionEnforcer.connectionExcludeExact.add('/contest/home');
connectionEnforcer.loginExcludeExact.add('/contest/home');
connectionEnforcer.connectionExcludeExact.add('/contest');
connectionEnforcer.loginExcludeExact.add('/contest');
connectionEnforcer.loginExclude.add('/contest/archive');
</script>

<template>
    <PanelView name="contest" title="WWPIT">
        <PanelHeader>
            <PanelNavLargeLogo></PanelNavLargeLogo>
            <PanelNavList>
                <PanelNavButton text="Home" for="/home"></PanelNavButton>
                <PanelNavButton text="WWPIT" for="/contest/home" is-default></PanelNavButton>
                <PanelNavButton text="Archive" for="/contest/archive"></PanelNavButton>
                <div v-if="contestManager.contest !== null || ignoreServer" style="display: flex;">
                    <PanelNavButton text="Contest" for="/contest/contest"></PanelNavButton>
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
            <PanelBody name="home" title="Home" is-default scroll-snap>
                <PagePanelContestInfo></PagePanelContestInfo>
            </PanelBody>
            <PanelBody name="contest" title="Contest" scroll-snap>
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
            <PanelBody name="archive" title="Archive">
                <PagePanelArchiveList></PagePanelArchiveList>
            </PanelBody>
            <PanelBody name="archiveView" title="Archive Problem">
                <PagePanelArchiveProblem></PagePanelArchiveProblem>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>

<style scoped></style>