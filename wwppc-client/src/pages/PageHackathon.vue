<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import PanelNavLargeLogo from '@/components/panels/PanelNavLargeLogo.vue';
import PagePanelHackathonInfo from './hackathon/PagePanelHackathonInfo.vue';
</script>

<template>
    <PanelView name="hackathon" title="WWPHacks">
        <PanelHeader>
            <PanelNavLargeLogo></PanelNavLargeLogo>
            <PanelNavList>
                <PanelNavButton text="Home" for="/home"></PanelNavButton>
                <PanelNavButton text="Other Button" for="/extra"></PanelNavButton>
            </PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
            </PanelRightList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="info" title="Home" is-default>
                <PagePanelHackathonInfo></PagePanelHackathonInfo>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>

<style>
.row {
    display: flex;
    flex-flow: row wrap;
    flex-direction: row;
    justify-items: stretch;
    justify-content: space-evenly;
    row-gap: 20px;
}

.schedule>h1 {
    margin-top: 6vh;
}

.column {
    display: flex;
    flex-direction: column;
}
</style>./hackathon/PagePanelHackathonInfo.vue
