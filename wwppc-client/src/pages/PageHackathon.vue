<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import LargeLogo from '@/components/LargeLogo.vue';
import { FullscreenModal } from '@/components/ui-defaults/UIDefaults';
import { ref } from 'vue';

const modal = ref(FullscreenModal);
</script>

<template>
    <PanelView name="hackathon">
        <PanelHeader>
            <LargeLogo></LargeLogo>
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
        <FullscreenModal ref="modal"></FullscreenModal>
    </PanelView>
</template>