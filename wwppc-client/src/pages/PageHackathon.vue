<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView, PanelNavLargeLogo } from '@/components/panels/PanelManager';
import UserDisp from '@/components/common/UserDisp.vue';
import PagePanelHackathonInfo from './hackathon/PagePanelHackathonInfo.vue';
</script>

<template>
    <PanelView name="hackathon" title="WWPHacks">
        <PanelHeader>
            <PanelNavLargeLogo></PanelNavLargeLogo>
            <PanelNavList>
                <PanelNavButton text="Home" for="/home"></PanelNavButton>
                <PanelNavButton text="WWPHacks" for="/hackathon" is-default></PanelNavButton>
            </PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
            </PanelRightList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="home" title="Home" is-default scroll-snap>
                <PagePanelHackathonInfo></PagePanelHackathonInfo>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>

<style scoped>
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
