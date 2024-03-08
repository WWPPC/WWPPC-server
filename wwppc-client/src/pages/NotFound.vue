<script setup lang="ts">
import { UIButton } from '@/components/ui-defaults/UIDefaults';
import { PanelBody, PanelHeader, PanelMain, PanelNavButton, PanelNavList, PanelRightList, PanelView } from '@/components/panels/PanelManager';
import PanelNavLargeLogo from '@/components/panels/PanelNavLargeLogo.vue';
import UserDisp from '@/components/UserDisp.vue';
</script>

<template>
    <div class="notFound">
        <span style="color: red; font-size: 50px;">404 Not Found</span>
        <br>
        <br>
        <span>
            <UIButton text="Back Home" color="lime" width="200px" @click="$router.push('/')"></UIButton>
        </span>
    </div>
</template>

<style>
.notFound {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    text-align: center;
}
</style>