<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelView, PanelNavLargeLogo, PanelRightList } from '@/components/panels/PanelManager';
import PagePanelAccountProfile from './account/PagePanelAccountProfile.vue';
import PagePanelAccountWrapper from './account/PagePanelAccountWrapper.vue';
import { useServerConnection } from '@/scripts/ServerConnection';
import { useRoute } from 'vue-router';
import { useConnectionEnforcer } from '@/scripts/ConnectionEnforcer';
import PagePanelAccountRegistrations from './account/PagePanelAccountRegistrations.vue';

const route = useRoute();

const serverConnection = useServerConnection();
const connectionEnforcer = useConnectionEnforcer();

connectionEnforcer.connectionInclude.add('/account');
connectionEnforcer.loginInclude.add('/account');
</script>

<template>
    <PanelView name="account" title="WWPPC">
        <PanelHeader>
            <PanelNavLargeLogo></PanelNavLargeLogo>
            <PanelNavList>
                <PanelNavButton text="Home" for="/home"></PanelNavButton>
                <PanelNavButton text="Profile" for="/account/profile" is-default></PanelNavButton>
                <PanelNavButton text="Register" for="/account/registrations"></PanelNavButton>
            </PanelNavList>
            <PanelRightList>
                <div v-if="!serverConnection.loggedIn && route.query.ignore_server !== undefined" style="color: yellow">
                    You are not signed in!
                </div>
            </PanelRightList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="profile" title="Account" is-default>
                <PagePanelAccountWrapper>
                    <PagePanelAccountProfile></PagePanelAccountProfile>
                </PagePanelAccountWrapper>
            </PanelBody>
            <PanelBody name="registrations" title="Registrations">
                <PagePanelAccountWrapper>
                    <PagePanelAccountRegistrations></PagePanelAccountRegistrations>
                </PagePanelAccountWrapper>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>

<style scoped></style>