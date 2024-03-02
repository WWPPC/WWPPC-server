<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import PanelNavLargeLogo from '@/components/panels/PanelNavLargeLogo.vue';
</script>

<template>
    <PanelView name="hackathon">
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
            <PanelBody name="default" :is-default=true>
                Hey! This page isn't finished. Check back later for updates!
                <br><br>
                oops hacked
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>