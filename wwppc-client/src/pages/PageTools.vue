<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelView, PanelNavLargeLogo } from '@/components/panels/PanelManager';
import { useRouter } from 'vue-router';
import PagePanelToolsEditor from './tools/PagePanelToolsEditor.vue';
import PagePanelToolsDataurl from './tools/PagePanelToolsDataurl.vue';

const router = useRouter();
</script>

<template>
    <PanelView name="tools" title="WWPPC Tools">
        <PanelHeader>
            <PanelNavLargeLogo></PanelNavLargeLogo>
            <PanelNavList>
                <PanelNavButton text="Tools" for="/tools/index" is-default></PanelNavButton>
                <PanelNavButton text="Problem Editor" for="/tools/editor"></PanelNavButton>
                <PanelNavButton text="Image to Data URL" for="/tools/dataurl"></PanelNavButton>
            </PanelNavList>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="index" is-default>
                <h1>WWPPC Tools</h1>
                <p>You've found the "secret" WWPPC tools! (no, there is no contest admin panel)</p>
                <ul>
                    <li @click="router.push('/tools/editor')">Problem Editor</li>
                    <li @click="router.push('/tools/dataurl')">Image to <span style="font-family: 'Source Code Pro', Courier, monospace">data:</span> URL</li>
                </ul>
            </PanelBody>
            <PanelBody name="editor" title="Problem Editor">
                <PagePanelToolsEditor></PagePanelToolsEditor>
            </PanelBody>
            <PanelBody name="dataurl" title="Image to Data URL">
                <PagePanelToolsDataurl></PagePanelToolsDataurl>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>

<style scoped>
li {
    text-decoration: underline;
    color: lime;
    font-size: var(--font-medium);
    cursor: pointer;
}
</style>