<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelView } from '@/components/panels/PanelManager';
import UserDisp from '@/components/user-disp/UserDisp.vue';
import LargeLogo from '@/components/LargeLogo.vue';
</script>

<template>
    <PanelView>
        <PanelHeader>
            <PanelNavList>
                <LargeLogo></LargeLogo>
                <PanelNavButton text="Home"></PanelNavButton>
                <PanelNavButton text="WWPPC 2024"></PanelNavButton>
                <PanelNavButton text="Contest"></PanelNavButton>
                <PanelNavButton text="About"></PanelNavButton>
            </PanelNavList>
            <UserDisp></UserDisp>
        </PanelHeader>
        <PanelMain>
            <PanelBody>
                hello
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>