<script setup lang="ts">
import LargeGlitchCenterText from '@/components/LargeGlitchCenterText.vue';
import { UIDivider } from '@/components/ui-defaults/UIDefaults';
</script>

<template>
    <div class="centered">
        <LargeGlitchCenterText text="WWPPC Team" style="font: bold 48px 'Source Code Pro'; color: lime;" :delay=10></LargeGlitchCenterText>
    </div>
    <div class="aboutTable">
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
    </div>
    <UIDivider></UIDivider>
    Our Team
    <table>
        <tr>
            <td>Arav Maheria</td>
            <td>Erik Ji</td>
        </tr>
        <tr>
            <td>Jie Gao</td>
            <td>Maitian Sha</td>
        </tr>
        <tr>
            <td>Rishikesh Anabathula</td>
            <td>Suvanth Erranki</td>
        </tr>
        <tr>
            <td>Vikram Karamsetty</td>
        </tr>
    </table>
</template>

<style>
.aboutTable {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    justify-items: center;
    width: 100%;
}
</style>