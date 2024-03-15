<script setup lang="ts">
import { PairedGridContainer, TitledCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import { UITextBox } from '@/components/ui-defaults/UIDefaults';
import { useAccountManager } from '@/scripts/AccountManager';
import { onMounted } from 'vue';

const accountManager = useAccountManager();

onMounted(() => {
    accountManager.updateUserData();
});
</script>

<template>
    <TitledCutCornerContainer title="Account">
        <PairedGridContainer width=100%>
            <span>Display Name:</span>
            <UITextBox :model-value=accountManager.displayName maxlength="32" width="min(100%, 330px)"></UITextBox>
            <span>Name:</span>
            <span>
                <UITextBox :model-value=accountManager.firstName maxlength="32" width="min(calc(50% - 4px), 161px)"></UITextBox>
                <UITextBox :model-value=accountManager.lastName maxlength="32" width="min(calc(50% - 4px), 161px)"></UITextBox>
            </span>
            <span>Username:</span>
            <UITextBox :value=accountManager.username width="min(100%, 330px)" disabled></UITextBox>
            <span>Email:</span>
            <UITextBox :value=accountManager.email width="min(100%, 330px)" disabled></UITextBox>
        </PairedGridContainer>
        <!-- account bio (team bio) -->
    </TitledCutCornerContainer>
    <!-- probably should have a mailing list lol -->
</template>

<style scoped>
</style>