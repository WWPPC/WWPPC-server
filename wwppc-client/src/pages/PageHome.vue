<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/UserDisp.vue';
import LargeLogo from '@/components/LargeLogo.vue';
import LoadingCover from '@/components/ui-defaults/LoadingCover.vue';
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
            </PanelBody>
        </PanelMain>
    </PanelView>
    <LoadingCover></LoadingCover>
</template>