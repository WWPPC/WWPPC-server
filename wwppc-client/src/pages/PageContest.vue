<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import LargeLogo from '@/components/LargeLogo.vue';
import { FullscreenModal } from '@/components/ui-defaults/UIDefaults';
import { ref } from 'vue';
import SuperSecretFeature from '@/components/ui-defaults/SuperSecretFeature.vue';
import ContestTimer from '@/components/ContestTimer.vue';

const modal = ref(FullscreenModal);
</script>

<template>
    <PanelView>
        <PanelHeader>
            <PanelNavList>
                <LargeLogo></LargeLogo>
                <PanelNavButton text="Home" for="/home"></PanelNavButton>
                <PanelNavButton text="Problems" for="/contest/problemList"></PanelNavButton>
                <PanelNavButton text="Leaderboards" for="/contest/leaderboard"></PanelNavButton>
            </PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
                <ContestTimer></ContestTimer>
            </PanelRightList>
        </PanelHeader>
        <PanelMain default="problemList" page="contest">
            <PanelBody name="problemList">
                Hey! This page isn't finished. Check back later for updates!
                <br><br>
                Problem list
            </PanelBody>
            <PanelBody name="problemView">
                Hey! This page isn't finished. Check back later for updates!
                <br><br>
                Problem screen (programmatically loaded from problem list)
            </PanelBody>
            <PanelBody name="leaderboard">
                Hey! This page isn't finished. Check back later for updates!
                <br><br>
                1. the-real-tianmu 573736472056375629219566527959683966273843 xp
                <br>
                1. sp - 2057277575 xp
                <br>
                2. SP^2 - 882646562 xp
            </PanelBody>
        </PanelMain>
    </PanelView>
    <FullscreenModal ref="modal"></FullscreenModal>
    <SuperSecretFeature :show="false"></SuperSecretFeature>
</template>