<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import LargeLogo from '@/components/LargeLogo.vue';
import { FullscreenModal, ModalMode, UIButton } from '@/components/ui-defaults/UIDefaults';
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
                <PanelNavButton text="Home" for="/" :link="true"></PanelNavButton>
            </PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
                <ContestTimer></ContestTimer>
            </PanelRightList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="home">
                <UIButton @click="() => console.log(modal?.showModal({title: 'why is borken', content: 'oof <img src=\'/assets/timer.svg\' style=\'height: 40px;\'>', mode: ModalMode.QUERY}))" text="Test modal"></UIButton>
            </PanelBody>
        </PanelMain>
    </PanelView>
    <FullscreenModal ref="modal"></FullscreenModal>
    <SuperSecretFeature :show="true"></SuperSecretFeature>
</template>