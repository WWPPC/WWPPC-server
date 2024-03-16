<script setup lang="ts">
import { PairedGridContainer, TitledCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import { UITextArea, UITextBox, UIDropdown } from '@/components/ui-defaults/UIDefaults';
import UIButton from '@/components/ui-defaults/inputs/UIButton.vue';
import { useAccountManager } from '@/scripts/AccountManager';
import { onMounted } from 'vue';

const accountManager = useAccountManager();

onMounted(() => {
    accountManager.getUserData();
});
</script>

<template>
    <TitledCutCornerContainer title="Profile">
        <PairedGridContainer width=100% style="--fwidth: min(calc(100% - 4px), 400px); --hwidth: min(calc(50% - 6px), 196px);">
            <span>Display Name:</span>
            <UITextBox :model-value=accountManager.displayName maxlength="32" width="var(--fwidth)"></UITextBox>
            <span>Name:</span>
            <span style="text-wrap: nowrap;">
                <UITextBox :model-value=accountManager.firstName maxlength="32" width="var(--hwidth)"></UITextBox>
                <UITextBox :model-value=accountManager.lastName maxlength="32" width="var(--hwidth)"></UITextBox>
            </span>
            <span>Username:</span>
            <UITextBox :value=accountManager.username width="var(--fwidth)" disabled></UITextBox>
            <span>Email:</span>
            <UITextBox :value=accountManager.email width="var(--fwidth)" disabled></UITextBox>
            <span>School:</span>
            <UITextBox :value=accountManager.school width="var(--fwidth)"></UITextBox>
            <span>Grade/experience:</span>
            <span style="text-wrap: nowrap;">
                <UIDropdown :value=accountManager.grade width="var(--hwidth)" :items="[
                { text: 'Pre-High School', value: '8' },
                { text: '9', value: '9' },
                { text: '10', value: '10' },
                { text: '11', value: '11' },
                { text: '12', value: '12' },
                { text: 'College Student', value: '13' },
                { text: 'Graduated', value: '14' }
            ]" title="Your current grade level" required></UIDropdown>
                <UIDropdown :value=accountManager.experience width="var(--hwidth)" :items="[
                { text: 'Beginner / AP CS A', value: '0' },
                { text: 'Intermediate / USACO Silver / Codeforces 1500', value: '1' },
                { text: 'Good / USACO Gold / Codeforces 1900', value: '2' },
                { text: 'Advanced / USACO Platinum / Codeforces Grandmaster', value: '3' },
                { text: 'Cracked / IOI / USACO Camp', value: '4' },
            ]" title="Your experience level with competitive programming" required></UIDropdown>
            </span>
            <span>Bio ({{ 0 }} characters):</span>
            <UITextArea width="var(--fwidth)" min-height="2em" height="4em" max-height="20em" placeholder="Describe yourself in a few short sentences!" resize="vertical"></UITextArea>
        </PairedGridContainer>
        <UIButton class="profileSaveButton" text="Save" color="yellow"></UIButton>
    </TitledCutCornerContainer>
    <TitledCutCornerContainer title="Team">
        We haven't added teams yet, but you should get a team together anyways.
    </TitledCutCornerContainer>
</template>

<style scoped>
.profileSaveButton {
    position: absolute;
    bottom: 12px;
    right: 8px;
}
</style>