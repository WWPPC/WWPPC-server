<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import LargeLogo from '@/components/LargeLogo.vue';
import { FullscreenModal } from '@/components/ui-defaults/UIDefaults';
import { ref } from 'vue';
import LargeGlitchCenterText from '@/components/LargeGlitchCenterText.vue';
import PagePanelAbout from '@/pages/home/PagePanelAbout.vue';

const modal = ref(FullscreenModal);
</script>

<template>
    <PanelView name="home" :is-default=true>
        <PanelHeader>
            <LargeLogo></LargeLogo>
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
                <div class="fullBlock">
                    <br><br>
                    <LargeGlitchCenterText text="WWP-IT + WWP-HACKS" fontStyle="
                         font-weight:bold;
                        font-size: min(calc(50vh - 50px), calc(100vw / 12));
                        text-wrap: nowrap;
                        color: lime;
                        " :steps=1 :delay=10></LargeGlitchCenterText>
                    <br>
                    <div class="center">
                        <!-- show signup, date, etc also arrow -->
                    </div>
                </div>
                <div class="fullBlock">
                    wow thing
                    <br><br>
                    pretend this is a discord logo JOIN OUR DISCORD! https://discord.gg/97um6csDGn
                    <br>
                    I should probably make this into a component
                </div>
            </PanelBody>
            <PagePanelAbout></PagePanelAbout>
        </PanelMain>
        <FullscreenModal ref="modal"></FullscreenModal>
    </PanelView>
</template>