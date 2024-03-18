<script setup lang="ts">
import WaitCover from '@/components/WaitCover.vue';
import { AnimateInContainer, PairedGridContainer, TitledCollapsible, TitledCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import { UITextArea, UITextBox, UIDropdown, globalModal } from '@/components/ui-defaults/UIDefaults';
import UIButton from '@/components/ui-defaults/inputs/UIButton.vue';
import { useAccountManager } from '@/scripts/AccountManager';
import { AccountOpResult, getAccountOpMessage } from '@/scripts/ServerConnection';
import { onMounted, ref, watch } from 'vue';

const modal = globalModal();
const accountManager = useAccountManager();

onMounted(async () => {
    await accountManager.updateOwnUserData();
    gradeInput.value = accountManager.grade.toString();
    experienceInput.value = accountManager.experience.toString();
});

// oops
const gradeInput = ref('');
const experienceInput = ref('');
watch(gradeInput, () => accountManager.grade = Number(gradeInput.value));
watch(experienceInput, () => accountManager.experience = Number(experienceInput.value));
watch(() => accountManager.grade, () => gradeInput.value = accountManager.grade.toString());
watch(() => accountManager.experience, () => experienceInput.value = accountManager.experience.toString());

const remainingBioCharacters = ref(2048);
watch(() => accountManager.bio, () => remainingBioCharacters.value = 2048 - accountManager.bio.length);

const showWriteDataWait = ref(false);
const writeData = async () => {
    showWriteDataWait.value = true;
    // artificial wait
    await new Promise((resolve) => setTimeout(resolve, 500));
    const res = await accountManager.writeUserData();
    if (res != AccountOpResult.SUCCESS) modal.showModal({ title: 'Write data failed', content: getAccountOpMessage(res), color: 'red' });
    showWriteDataWait.value = false;
};

const currentPasswordInput = ref('');
const newPasswordInput = ref('');
</script>

<template>
    <AnimateInContainer type="slideUp" :delay=100>
        <TitledCutCornerContainer title="Profile" hover-animation="lift">
            <form action="javascript:void(0)" @submit=writeData>
                <PairedGridContainer width=100%>
                    <span>Display Name:</span>
                    <UITextBox v-model=accountManager.displayName maxlength="32" width="var(--fwidth)" title="Name used in profile, contests, etc." required></UITextBox>
                    <span>Name:</span>
                    <span style="text-wrap: nowrap;">
                        <UITextBox v-model=accountManager.firstName maxlength="32" width="var(--hwidth)" title="First name" required></UITextBox>
                        <UITextBox v-model=accountManager.lastName maxlength="32" width="var(--hwidth)" title="Last name" required></UITextBox>
                    </span>
                    <span>School:</span>
                    <UITextBox v-model=accountManager.school maxlength="64" width="var(--fwidth)" title="Your school name" required></UITextBox>
                    <span>Grade/experience:</span>
                    <span style="text-wrap: nowrap;">
                        <UIDropdown v-model=gradeInput width="var(--hwidth)" :items="[
                { text: 'Pre-High School', value: '8' },
                { text: '9', value: '9' },
                { text: '10', value: '10' },
                { text: '11', value: '11' },
                { text: '12', value: '12' },
                { text: 'College Student', value: '13' },
                { text: 'Graduated', value: '14' }
            ]" title="Your current grade level" required></UIDropdown>
                        <UIDropdown v-model=experienceInput width="var(--hwidth)" :items="[
                { text: 'Beginner / AP CS A', value: '0' },
                { text: 'Intermediate / USACO Silver / Codeforces 1500', value: '1' },
                { text: 'Good / USACO Gold / Codeforces 1900', value: '2' },
                { text: 'Advanced / USACO Platinum / Codeforces Grandmaster', value: '3' },
                { text: 'Cracked / IOI / USACO Camp', value: '4' },
            ]" title="Your experience level with competitive programming" required></UIDropdown>
                    </span>
                    <span>Bio<br>({{ remainingBioCharacters }} chars):</span>
                    <UITextArea v-model=accountManager.bio width="var(--fwidth)" min-height="2em" height="4em" max-height="20em" maxlength="2048" placeholder="Describe yourself in a few short sentences!" resize="vertical"></UITextArea>
                </PairedGridContainer>
                <UIButton class="profileSaveButton" type="submit" v-if=accountManager.unsavedChanges text="Save" color="yellow" glitch-on-mount></UIButton>
            </form>
            <WaitCover text="Please wait..." :show=showWriteDataWait></WaitCover>
        </TitledCutCornerContainer>
    </AnimateInContainer>
    <AnimateInContainer type="slideUp" :delay=200>
        <TitledCutCornerContainer title="Team" hover-animation="lift">
            We haven't added teams yet, but you should get a team together anyways.
        </TitledCutCornerContainer>
    </AnimateInContainer>
    <AnimateInContainer type="slideUp" :delay=300>
        <TitledCutCornerContainer title="Account" hover-animation="lift">
            <PairedGridContainer>
                <span>Username:</span>
                <UITextBox :value=accountManager.username width="var(--fwidth)" title="Your unique username (you cannot edit this)" disabled></UITextBox>
                <span>Email:</span>
                <UITextBox :value=accountManager.email width="var(--fwidth)" title="Email used to update you on contests, password changes, etc. (you cannot edit this)" disabled></UITextBox>
            </PairedGridContainer>
            <br>
            <TitledCollapsible title="Danger buttons" font-size="var(--font-medium)" border-color="red" start-collapsed>
                <!-- useless form -->
                <form class="profileDangerButtons" action="javascript:void(0)">
                    <UITextBox v-model=currentPasswordInput disabled></UITextBox>
                    <UITextBox v-model=newPasswordInput disabled></UITextBox>
                    <UIButton text="CHANGE PASSWORD" color="red" disabled></UIButton>
                    <UIButton text="DELETE ACCOUNT" color="red" disabled></UIButton>
                </form>
            </TitledCollapsible>
        </TitledCutCornerContainer>
    </AnimateInContainer>
</template>

<style scoped>
* {
    --fwidth: min(calc(100% - 4px), 400px);
    --hwidth: min(calc(50% - 6px), 196px);
}

.profileSaveButton {
    position: absolute;
    bottom: 12px;
    right: 8px;
}

.profileDangerButtons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 12px;
    row-gap: 12px;
    width: 100%;
}

.profileDangerButtons>* {
    width: 100%;
    margin: 0px 0px;
}
</style>