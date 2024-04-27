<script setup lang="ts">
import { PanelView, PanelHeader, PanelNavLargeLogo, PanelMain, PanelBody, PanelRightList, PanelNavList } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import PagePanelUserView from './userView/PagePanelUserView.vue';
import { useConnectionEnforcer } from '@/scripts/ConnectionEnforcer';

const connectionEnforcer = useConnectionEnforcer();

connectionEnforcer.connectionInclude.add('/user');
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
                <PagePanelUserView></PagePanelUserView>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>

<style scoped></style>