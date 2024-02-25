<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import LargeLogo from '@/components/LargeLogo.vue';
import { FullscreenModal, ModalMode, UIButton } from '@/components/ui-defaults/UIDefaults';
import { ref } from 'vue';

const modal = ref(FullscreenModal);
</script>

<template>
    <PanelView>
        <PanelHeader>
            <PanelNavList>
                <LargeLogo></LargeLogo>
                <PanelNavButton text="Home" for="home"></PanelNavButton>
                <PanelNavButton text="WWP-Hacks" for="hackathon" :link=true></PanelNavButton>
                <PanelNavButton text="WWP-IT" for="contest" :link=true></PanelNavButton>
                <PanelNavButton text="About" for="about"></PanelNavButton>
            </PanelNavList>
            <PanelRightList>
                <UserDisp></UserDisp>
            </PanelRightList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="home">
                hello
            </PanelBody>
            <PanelBody name="about">
                buh about page
                <UIButton @click="() => console.log(modal?.showModal({title: 'why is borken', content: 'oof <img src=\'./timer.svg\' style=\'height: 40px;\'>', mode: ModalMode.QUERY}))" text="Test modal"></UIButton>
            </PanelBody>
        </PanelMain>
    </PanelView>
    <FullscreenModal ref="modal"></FullscreenModal>
</template>