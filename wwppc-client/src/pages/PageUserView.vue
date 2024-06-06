<script setup lang="ts">
import { PanelView, PanelHeader, PanelNavLargeLogo, PanelMain, PanelBody, PanelRightList, PanelNavList } from '@/components/panels/PanelManager';
import UserDisp from '@/components/common/UserDisp.vue';
import { useConnectionEnforcer } from '@/scripts/ConnectionEnforcer';
import LoadingCover from '@/components/common/LoadingCover.vue';
import NotFound from '@/pages/NotFound.vue';
import OnScreenHook from '@/components/ui-defaults/OnScreenHook.vue';
import { AnimateInContainer, CutCornerContainer, PairedGridContainer, TitledCutCornerContainer, TitledDoubleCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import { useRoute } from 'vue-router';
import { experienceMaps, gradeMaps, languageMaps, type TeamData, useAccountManager, type AccountData } from '@/scripts/AccountManager';
import { nextTick, onMounted, ref, watch } from 'vue';
import { UIDropdown, UITextBox, UITextArea } from '@/components/ui-defaults/UIDefaults';
import { useServerConnection } from '@/scripts/ServerConnection';
import { autoGlitchTextTransition } from '@/components/ui-defaults/TextTransitions';
import { setTitlePanel } from '@/scripts/title';
import AccountProfileTeamUser from '@/components/account/profile/AccountProfileTeamUser.vue';

const route = useRoute();

const serverConnection = useServerConnection();
const connectionEnforcer = useConnectionEnforcer();
const accountManager = useAccountManager();

connectionEnforcer.connectionInclude.add('/user');

const userData = ref<AccountData | null>(null);
const teamData = ref<TeamData | null>(null);
const showLoading = ref(true);
const loadUserData = async () => {
    userData.value = null;
    teamData.value = null;
    showLoading.value = true;
    await serverConnection.handshakePromise;
    await nextTick();
    if (route.params.userView != null) {
        await Promise.all([
            accountManager.getUserData(route.params.userView.toString()).then((v) => {
                if (!(v instanceof Error)) userData.value = v;
            }),
            accountManager.getTeamData(route.params.userView.toString()).then((v) => {
                if (!(v instanceof Error)) teamData.value = v;
            })
        ]);
    }
    showLoading.value = false;
};
watch(() => route.params, () => {
    if (route.params.page != 'user' || route.query.ignore_server !== undefined) return;
    loadUserData();
});
// spaghetti
const username = autoGlitchTextTransition(() => '@' + (userData.value?.username ?? ''), 40, 1, 10, 3, true);
const displayName = autoGlitchTextTransition(() => userData.value?.displayName ?? '', 40, 1, 10, 3, true);
const grade = ref<string>('');
const experience = ref<string>('');
const languages = ref<string[]>([]);
const biography = autoGlitchTextTransition(() => userData.value?.bio ?? '', 40, 4, 10);
watch(userData, () => {
    grade.value = '' + (userData.value?.grade ?? '');
    experience.value = '' + (userData.value?.experience ?? '');
    languages.value = userData.value?.languages ?? [];
    if (userData.value) setTitlePanel(userData.value.displayName);
});
onMounted(loadUserData);

const largeHeader = ref(true);
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
            <PanelBody name="default" is-default>
                <div class="reverse" v-if="!showLoading">
                    <div class="vStack">
                        <OnScreenHook @change="(v) => largeHeader = v" offset-top="-16px"></OnScreenHook>
                        <div style="height: 30vh;"></div>
                        <div class="grid">
                            <TitledCutCornerContainer title="Profile" hover-animation="lift" align="center" height="100%" style="grid-row: span 2;" flipped>
                                <PairedGridContainer style="font-size: var(--font-small);">
                                    <span>Name:</span>
                                    <UITextBox :value="userData?.firstName + ' ' + userData?.lastName" width="var(--fwidth)" disabled></UITextBox>
                                    <span>School:</span>
                                    <UITextBox :value="userData?.school" width="var(--fwidth)" disabled></UITextBox>
                                    <span>Grade Level:</span>
                                    <UIDropdown v-model="grade" width="var(--fwidth)" :items="gradeMaps" disabled></UIDropdown>
                                    <span>Experience Level:</span>
                                    <UIDropdown v-model="experience" width="var(--fwidth)" :items="experienceMaps" disabled></UIDropdown>
                                    <span>Known Languages:</span>
                                    <UIDropdown v-model="languages" width="var(--fwidth)" height="6em" :items="languageMaps" multiple disabled></UIDropdown>
                                </PairedGridContainer>
                            </TitledCutCornerContainer>
                            <TitledDoubleCutCornerContainer title="Biography" hover-animation="lift" align="center" height="100%" flipped>
                                <p>
                                    {{ biography }}
                                </p>
                            </TitledDoubleCutCornerContainer>
                            <TitledCutCornerContainer title="Team" hover-animation="lift" align="center" height="100%" style="grid-row: span 2; max-height: 80vh;">
                                <div class="userViewTeamGrid">
                                    <div class="userViewTeamList">
                                        <AccountProfileTeamUser v-for="user in teamData?.teamMembers" :key="user" :user="user" :team="teamData!.team"></AccountProfileTeamUser>
                                    </div>
                                    <div>
                                        <PairedGridContainer width="100%">
                                            <span>Team Name:</span>
                                            <UITextBox :value="teamData?.teamName" width="var(--fwidth)" disabled></UITextBox>
                                            <span>Biography:</span>
                                            <UITextArea :value="teamData?.teamBio" width="var(--fwidth)" min-height="2em" height="4em" max-height="20em" maxlength="1024" resize="vertical" disabled></UITextArea>
                                        </PairedGridContainer>
                                    </div>
                                </div>
                            </TitledCutCornerContainer>
                        </div>
                    </div>
                    <div class="userViewProfileHeaderWrapper">
                        <div class="centered">
                            <div class="userViewProfileHeader">
                                <img class="userViewProfileImg" :src="userData?.profileImage">
                                <span class="userViewDisplayName">{{ displayName }}</span>
                                <span class="userViewUsername">{{ username }}</span>
                                <CutCornerContainer class="userViewProfileRegistrations">
                                    <div class="userViewProfileRegistrationsHeader">
                                        <h3>Registrations</h3>
                                    </div>
                                    <AnimateInContainer type="slideUp" v-for="(reg, i) in userData?.registrations" :key="i" :delay="i * 200" single>
                                        <span class="registrationLine">
                                            <div class="registrationStatusDotUpcoming"></div>
                                            {{ reg }}
                                        </span>
                                    </AnimateInContainer>
                                    <AnimateInContainer type="fade" v-for="(reg, i) in userData?.pastRegistrations" :key="i" :delay="i * 200" single>
                                        <span class="registrationLine">
                                            <div class="registrationStatusDotCompleted"></div>
                                            {{ reg }}
                                        </span>
                                    </AnimateInContainer>
                                    <span v-if="!userData?.registrations.length && !userData?.pastRegistrations.length">
                                        This user is not registered for any contests
                                    </span>
                                </CutCornerContainer>
                            </div>
                        </div>
                    </div>
                </div>
                <NotFound v-if="route.params.userView == undefined || userData === null"></NotFound>
                <LoadingCover text="Loading..." ignore-server :show="showLoading"></LoadingCover>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>

<style scoped>
* {
    --fwidth: calc(100% - 16px);
    --hwidth: calc(50% - 24px)
}

.reverse {
    display: flex;
    flex-direction: column-reverse;
}

.userViewProfileHeaderWrapper {
    position: sticky;
    top: 0px;
}

.userViewProfileHeader {
    display: grid;
    --image-size: v-bind("largeHeader ? 'min(25vw, 25vh)' : 'min(15vw, 15vh)'");
    grid-template-columns: 1fr min-content minmax(min-content, max-content) minmax(20vw, 2fr) 1fr;
    grid-template-rows: 1fr 4fr 4fr 1fr;
    column-gap: 16px;
    position: absolute;
    top: -16px;
    left: -16px;
    width: calc(100% + 32px);
    min-height: v-bind("largeHeader ? '30vh' : '20vh'");
    max-height: v-bind("largeHeader ? '30vh' : '20vh'");
    border-bottom: 4px solid white;
    background-color: black;
    transition: 500ms ease max-height, 500ms ease min-height;
}

.userViewProfileImg {
    grid-row: 2 / 4;
    grid-column: 2;
    box-sizing: border-box;
    min-width: var(--image-size);
    min-height: var(--image-size);
    max-width: var(--image-size);
    max-height: var(--image-size);
    transition: 500ms ease max-height, 500ms ease min-height, 500ms ease max-width, 500ms ease min-width;
    border: 4px solid white;
    border-radius: 50%;
}

.userViewDisplayName {
    grid-row: 2;
    grid-column: 3;
    min-width: 0px;
    font-size: min(4vw, 5vh);
    align-self: end;
    font-family: 'Source Code Pro', Courier, monospace;
}

.userViewUsername {
    grid-row: 3;
    grid-column: 3;
    font-size: min(3.5vw, 4vh);
    font-family: 'Source Code Pro', Courier, monospace;
}

.userViewProfileRegistrations {
    grid-row: 2 / 4;
    grid-column: 4;
    overscroll-behavior: contain;
}

.userViewProfileRegistrationsHeader {
    position: sticky;
    top: 0px;
    background-color: black;
    width: calc(100% + 24px);
    margin-top: -6px;
    margin-left: 8px;
    padding-top: 2px;
    transform: translate(-12px, -12px);
    box-shadow: 0px 6px 8px black;
    z-index: 1;
}

.registrationLine {
    display: flex;
    flex-direction: row;
    margin: 4px 0px;
    column-gap: 4px;
    font-size: var(--font-medium);
    line-height: 1em;
    text-wrap: nowrap;
    word-wrap: nowrap;
}

.registrationStatusDotUpcoming,
.registrationStatusDotCompleted {
    width: 1em;
    height: 1em;
    min-width: 1em;
    min-height: 1em;
    border-radius: 50%;
}

.registrationStatusDotUpcoming {
    background-color: cyan;
}

.registrationStatusDotCompleted {
    background-color: lime;
}

@media (max-width: 700px) {
    .userViewProfileHeader {
        grid-template-columns: 1fr min-content min-content 1fr;
        grid-template-rows: 1fr 4fr 4fr 10fr 1fr;
    }

    .userViewProfileRegistrations {
        grid-row: 4;
        grid-column: 2 / 4;
    }
}

.vStack {
    display: flex;
    flex-direction: column;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    grid-auto-flow: row dense;
    margin: 12px 8px;
    align-items: center;
    justify-items: stretch;
    row-gap: 24px;
    column-gap: 24px;
}

.userViewTeamGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    row-gap: 16px;
    column-gap: 16px;
}

.userViewTeamList {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    row-gap: 8px;
    column-gap: 8px;
}
</style>