<script setup lang="ts">
import { PanelView, PanelHeader, PanelNavLargeLogo, PanelMain, PanelBody, PanelRightList, PanelNavList } from '@/components/panels/PanelManager';
import LoadingCover from '@/components/LoadingCover.vue';
import NotFound from '@/pages/NotFound.vue';
import { useRoute, useRouter } from 'vue-router';
import { experienceMaps, gradeMaps, languageMaps, useAccountManager, type AccountData } from '@/scripts/AccountManager';
import { onBeforeMount, ref, watch } from 'vue';
import { globalModal, ModalMode, UIDropdown, UITextBox } from '@/components/ui-defaults/UIDefaults';
import { useServerConnection } from '@/scripts/ServerConnection';
import UserDisp from '@/components/UserDisp.vue';
import { autoGlitchTextTransition } from '@/components/ui-defaults/TextTransitions';
import OnScreenHook from '@/components/ui-defaults/OnScreenHook.vue';
import { CutCornerContainer, PairedGridContainer } from '@/components/ui-defaults/UIContainers';
import AnimateInContainer from '@/components/ui-defaults/containers/AnimateInContainer.vue';

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
        serverConnection.handshakePromise.then(() => {
            if (serverConnection.manualLogin && !serverConnection.loggedIn) router.push({ path: '/login', query: { redirect: route.fullPath } });
        });
    }
});

const userData = ref<AccountData | null>(null);
const loadUserData = async () => {
    userData.value = await accountManager.getUserData(route.params.userView?.toString());
};
watch(() => route.params, () => {
    if (route.params.page != 'user' || route.query.ignore_server !== undefined) return;
    loadUserData();
});
watch(() => serverConnection.loggedIn, () => {
    if (route.params.page == 'user') loadUserData();
});
// spaghetti
const username = autoGlitchTextTransition(() => '@' + (userData.value?.username ?? ''), 40, 1, 10, 2, true);
const displayName = autoGlitchTextTransition(() => userData.value?.displayName ?? '', 40, 1, 10, 2, true);
const name = ref('');
const email = ref('');
const school = ref('');
const grade = ref<number[]>([]);
const experience = ref<number[]>([]);
const languages = ref<string[]>([]);
const bio = ref('');
watch(userData, () => {
    name.value = userData.value?.firstName + ' ' + userData.value?.lastName;
    email.value = userData.value?.email ?? '';
    school.value = userData.value?.school ?? '';
    grade.value = [userData.value?.grade ?? 0];
    experience.value = [userData.value?.experience ?? 0];
    languages.value = userData.value?.languages ?? [];
    bio.value = userData.value?.bio ?? '';
});
const putDummyData = () => {
    userData.value = {
        username: 'test',
        email: 'oof@test.buh',
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User',
        profileImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARxSURBVHhe7dy9SiRZAAXgdkeMzHwHAw0EQzNfREQwEVEMDAQfrp/DSBNB0MA2M3C3Zy1mZZ3rtP1TXXXP9yXFNavmnu5zEgcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAPG1vb29tbTUHiLKzs/P09DQajTY3N5s/QYjx7b+7u/v7X+MM+B0gyN7e3s3Nzfvtf3d/fy8DRBj3/sfHx+bif/D8/CwDVO699zdX/hN7gJp97P0l9gB1+tz7S+wBalPq/SX2APX4uveX2APUYJLeX2IP0G+T9/4Se4C++m7vL7EH6J/pen+JPUCfzNL7S+wB+mH23l9iD9B18+r9JfYA3TXf3l9iD9BFi+j9JfYA3bK43l9iD9AVi+79JfYAy9dO7y+xB1imNnt/iT3AcrTf+0vsAdq2rN5fYg/QnuX2/hJ7gDZ0ofeX2AMsVnd6f4k9wKJ0rfeX2APMXzd7f4k9wDx1ufeX2APMR/d7f4k9wKz60vtL7AGm16/eX2IPMI0+9v4Se4Dv6W/vL7EHmFTfe3+JPcCf1dH7S+wBvlJT7y+xB/i9+np/iT3A/9Xa+0vsAf5Td+8vsQf4KaH3l9gD6XJ6f4k9kCut95eE74GV5hlmfX399vZ2Y2OjOWcb/w7s7u4+PDw05yQ/mmeY19fXtbW1/f39lZXQr4Bfxj8CV1dXw+GwOZPj9PT0vQbEent7u7y8bD4OAh0fHzd3Ic/Ly8vR0dHq6mrzWZDp4OBg/EXYXIoYo9Ho7OzM7een6+vrqAyMX/bk5KR5eRjL2QN6P7+XsAf0fr5S9x7Q+/mzWveA3s+k6tsDej/fU9Me0PuZRh17QO9nen3fA3o/s+rvHtD7mY8+7gG9n3nq1x7Q+5m/vuwBvZ9F6f4e0PtZrC7vAb2fNnRzD+j9tKdre0Dvp23d2QN6P8vRhT2g97NMy90Dej/Lt6w9oPfTFe3vAb2fbmlzD+j9dFE7e0Dvp7sWvQf0frpucXtA76cfFrEH9H76ZL57QO+nf+a1B/R++mr2PaD302+z7AG9nxpMtwf0furx3T2g91ObyfeA3k+dJtkDej81+3oP6P3Ur7QH9H5SfN4Dej9ZPu4BvZ9E73tA7yfXeA/o/QAAAAAAAAAAAAAAAAAAAAAAAAAAsVaaJ4PB4eHh+fl5c6jXxcXFcDhsDvDLOADNPyyv2vg1mxdmMPireUIkASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBsMPgHSaq6IM8BzA4AAAAASUVORK5CYII=',
        bio: 'Just a test user adsfsadf asdf sadf dsaf \nsadf\nasfd\n',
        school: 'Rickroll Academy',
        grade: 99999,
        experience: 4,
        languages: ['c', 'py'],
        registrations: [
            { contest: 'WWPIT-2024', completed: false },
            { contest: 'WWPIT-2024', completed: false },
            { contest: 'WWPIT-2024', completed: false },
            { contest: 'WWPIT-2024', completed: false },
            { contest: 'WWPIT-2024', completed: false },
            { contest: 'WWPIT-2024', completed: false },
            { contest: 'WWPIT-2024', completed: false },
            { contest: 'WWPIT-2024', completed: false },
            { contest: 'WWPIT-2024', completed: false },
            { contest: 'WWPIT-2024', completed: false },
            { contest: 'WWPIT-2024', completed: false }
        ]
    };
};
onBeforeMount(putDummyData);

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
            <PanelBody name="default" :title="route.params.userView?.toString()" is-default>
                <div class="reverse">
                    <div class="vStack">
                        <OnScreenHook @change="(v) => largeHeader = v" offset-top="-16px"></OnScreenHook>
                        <div style="height: 30vh;"></div>
                        <CutCornerContainer style="min-width: 50%; max-width: 100%; --fwidth: calc(100% - 16px); --hwidth: calc(50% - 24px)">
                            <PairedGridContainer style="font-size: var(--font-small);">
                                <span>Name:</span>
                                <UITextBox :value="name" width="var(--fwidth)" disabled></UITextBox>
                                <span>Email:</span>
                                <UITextBox :value="email" width="var(--fwidth)" disabled></UITextBox>
                                <span>School:</span>
                                <UITextBox :value="school" width="var(--fwidth)" disabled></UITextBox>
                                <span>Grade Level:</span>
                                <UIDropdown :value="grade" width="var(--fwidth)" :items="gradeMaps" disabled></UIDropdown>
                                <span>Experience Level:</span>
                                <UIDropdown :value="experience" width="var(--fwidth)" :items="experienceMaps" disabled></UIDropdown>
                                <span>Known Languages:</span>
                                <UIDropdown :value="languages" width="var(--fwidth)" height="6em" :items="languageMaps" multiple disabled></UIDropdown>
                            </PairedGridContainer>
                        </CutCornerContainer>
                        <!-- oof -->
                        <span>{{ userData }}</span>
                        <span v-for="i in 30" :key=i>buh<br></span>
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
                                        <span>{{ reg.contest }}</span>
                                    </AnimateInContainer>
                                </CutCornerContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </PanelBody>
            <NotFound v-if="route.params.userView == undefined || userData === null"></NotFound>
            <LoadingCover text="Signing you in..." :ignore-server="true"></LoadingCover>
        </PanelMain>
    </PanelView>
</template>

<style scoped>
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
    grid-template-columns: 1fr min-content max-content 2fr 1fr;
    grid-template-rows: 1fr 4fr 4fr 1fr;
    column-gap: 16px;
    position: absolute;
    top: -16px;
    left: -16px;
    width: calc(100% + 32px);
    min-height: v-bind("largeHeader ? '30vh' : '20vh'");
    max-height: v-bind("largeHeader ? '30vh' : '20vh'");
    padding: auto;
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
    font-size: var(--font-40);
    align-self: end;
    white-space: pre;
    font-family: 'Source Code Pro', Courier, monospace;
}

.userViewUsername {
    grid-row: 3;
    grid-column: 3;
    font-size: var(--font-28);
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

.vStack {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>