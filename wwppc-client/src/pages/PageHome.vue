<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import LargeLogo from '@/components/LargeLogo.vue';
import { FullscreenModal } from '@/components/ui-defaults/UIDefaults';
import { ref } from 'vue';
import SuperSecretFeature from '@/components/ui-defaults/SuperSecretFeature.vue';
import LargeGlitchCenterText from '@/components/LargeGlitchCenterText.vue';

const modal = ref(FullscreenModal);
</script>

<template>
    <PanelView>
        <PanelHeader>
            <LargeLogo></LargeLogo>
            <PanelNavList>
                <PanelNavButton text="Home" for="/home"></PanelNavButton>
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
            <PanelBody name="home" :isDefault=true>
                <div class="fullBlock">
                    <br><br>
                    <LargeGlitchCenterText text="WWP-IT + WWP-HACKS" fontStyle="
                    font-weight:bold;
                    font-size: min(calc(50vh - 50px), calc(100vw / 12));
                    text-wrap: nowrap;
                    color: lime;
                    " :steps=1 :delay=5></LargeGlitchCenterText>
                    <br>
                    <div class="center">
                    </div>
                </div>
                <div class="fullBlock">
                    wow thing
                </div>
            </PanelBody>
            <PanelBody name="about">
                Hey! This page isn't finished. Check back later for updates!
                <br><br>
                sp^2: made the whole website because nobody else bothered to learn vue
            </PanelBody>
        </PanelMain>
    </PanelView>
    <FullscreenModal ref="modal"></FullscreenModal>
    <SuperSecretFeature :show="false"></SuperSecretFeature>
</template>