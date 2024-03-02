<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import PagePanelHomeAbout from '@/pages/home/PagePanelHomeAbout.vue';
import PagePanelHomeHome from '@/pages/home/PagePanelHomeHome.vue';
import PanelNavLargeLogo from '@/components/panels/PanelNavLargeLogo.vue';
</script>

<template>
    <PanelView name="home" :is-default=true>
        <PanelHeader>
            <PanelNavLargeLogo></PanelNavLargeLogo>
            <PanelNavList>
                <PanelNavButton text="Home" for="/home/home" :is-default=true></PanelNavButton>
                <PanelNavButton text="WWP-Hacks" for="/hackathon"></PanelNavButton>
                <PanelNavButton text="WWP-IT" for="/contest"></PanelNavButton>
                <PanelNavButton text="About" for="/home/about"></PanelNavButton>
                <PanelNavButton text="Test Page" for="/test"></PanelNavButton>
            </PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
            </PanelRightList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="home" :is-default=true>
                <PagePanelHomeHome></PagePanelHomeHome>
            </PanelBody>
            <PanelBody name="about">
                <PagePanelHomeAbout></PagePanelHomeAbout>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>