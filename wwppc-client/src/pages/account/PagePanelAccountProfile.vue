<script setup lang="ts">
import WaitCover from '@/components/WaitCover.vue';
import { AnimateInContainer, PairedGridContainer, TitledCollapsible, TitledCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import { UITextArea, UITextBox, UIDropdown, globalModal, ModalMode } from '@/components/ui-defaults/UIDefaults';
import UIButton from '@/components/ui-defaults/inputs/UIButton.vue';
import { useAccountManager } from '@/scripts/AccountManager';
import { AccountOpResult, getAccountOpMessage } from '@/scripts/ServerConnection';
import { onMounted, ref, watch } from 'vue';
import recaptcha from '@/scripts/recaptcha';

const modal = globalModal();
const accountManager = useAccountManager();

onMounted(async () => {
    await accountManager.updateOwnUserData();
    usernameNotEditable.value = accountManager.username;
    gradeInput.value = accountManager.grade?.toString();
    experienceInput.value = accountManager.experience?.toString();
});

// prevent username being overwritten
const usernameNotEditable = ref('');
watch(() => accountManager.username, () => usernameNotEditable.value = accountManager.username);

// oops
const gradeInput = ref('');
const experienceInput = ref('');
const languagesInput = ref<string[]>([]);
watch(gradeInput, () => accountManager.grade = Number(gradeInput.value));
watch(experienceInput, () => accountManager.experience = Number(experienceInput.value));
watch(languagesInput, () => accountManager.languages = languagesInput.value);
watch(() => accountManager.grade, () => gradeInput.value = accountManager.grade?.toString());
watch(() => accountManager.experience, () => experienceInput.value = accountManager.experience?.toString());
watch(() => accountManager.languages, () => languagesInput.value = accountManager.languages);

const remainingBioCharacters = ref(2048);
watch(() => accountManager.bio, () => remainingBioCharacters.value = 2048 - accountManager.bio?.length);

const showWriteDataWait = ref(false);
const writeData = async () => {
    showWriteDataWait.value = true;
    // artificial wait
    await new Promise((resolve) => setTimeout(resolve, 500));
    const res = await accountManager.writeUserData();
    if (res != AccountOpResult.SUCCESS) modal.showModal({ title: 'Write data failed', content: getAccountOpMessage(res), color: 'red' });
    showWriteDataWait.value = false;
};

// danger buttons
const showCredWait = ref(false);
const currentPasswordInput = ref('');
const newPasswordInput = ref('');
const changePasswordEnabled = ref(false);
const changePassword = async () => {
    const currPassword = currentPasswordInput.value;
    clearDangerButtons();
    const newPassword = await modal.showModal({
        title: 'Change Password',
        content: 'Enter your new password:',
        mode: ModalMode.QUERY,
        inputType: 'password'
    });
    // also handles "cancel" case
    if (typeof newPassword != 'string' || newPassword.trim() == '') return;
    if (newPassword.length >= 1024) {
        modal.showModal({
            title: 'Password Too Long!',
            content: 'Wow, that\'s a <i>REALLY</i> long password! However, please make it less than 1024 characters!',
            color: 'red'
        });
        return;
    }
    let newPassword2 = await modal.showModal({
        title: 'Change Password',
        content: 'Enter the password again:',
        mode: ModalMode.QUERY,
        inputType: 'password'
    });
    if (typeof newPassword2 != 'string' || newPassword2.trim() == '') return;
    while (newPassword2 !== newPassword) {
        newPassword2 = await modal.showModal({
            title: 'Change Password',
            content: 'Make sure you entered the same password.<br>Enter the password again:',
            mode: ModalMode.QUERY,
            inputType: 'password'
        });
        if (typeof newPassword2 != 'string' || newPassword2.trim() == '') return;
    }
    let spam = true;
    async function modalSpam() {
        while (spam) {
            await modal.showModal({
                title: 'Change Password',
                content: 'Please wait...',
            });
        }
    }
    modalSpam();
    const token = await recaptcha.execute('changePassword');
    const res = await accountManager.changePassword(currPassword, newPassword, token);
    spam = false;
    await modal.cancelAllModals();
    if (res == 0) window.location.reload();
    else modal.showModal({ title: 'Could not change password:', content: getAccountOpMessage(res), color: 'red' });
};
const deleteAccount = async () => {
    const currPassword = currentPasswordInput.value;
    clearDangerButtons();
    if (await modal.showModal({
        title: 'Delete Account',
        content: '',
        color: 'red',
        mode: ModalMode.CONFIRM
    }) === false) return;
    if (await modal.showModal({
        title: 'Delete Account',
        content: '<span style="color: red;">Are you SURE that you want to <b>DELETE</b> your account?</span>',
        color: 'red',
        mode: ModalMode.CONFIRM
    }) === false) return;
    if (await modal.showModal({
        title: 'Delete Account',
        content: '<span style="color: red;">This will <b>PERMANENTLY DELETE ALL DATA</b>, including <b>TEAMS</b>!</span>',
        color: 'red',
        mode: ModalMode.CONFIRM
    }) === false) return;
    let password2 = await modal.showModal({
        title: 'Delete Account',
        content: '<span style="color: red;">Enter your password to confirm <b>PERMANENT DELETION</b> of your account</span>',
        color: 'red',
        mode: ModalMode.QUERY,
        inputType: 'password'
    });
    if (password2 === null) return;
    while (password2 !== currPassword) {
        password2 = await modal.showModal({
            title: 'Delete Account',
            content: '<span style="color: red;">Passwords do not match.<br>Enter your password to confirm <b>PERMANENT DELETION</b> of your account</span>',
            color: 'red',
            mode: ModalMode.QUERY,
            inputType: 'password'
        });
        if (password2 === null) return;
    }
    let spam = true;
    async function modalSpam() {
        while (spam) {
            await modal.showModal({
                title: 'Delete Account',
                content: 'Please wait...',
            });
        }
    }
    modalSpam();
    const token = await recaptcha.execute('deleteAccount');
    const res = await accountManager.deleteAccount(currPassword, token);
    spam = false;
    await modal.cancelAllModals();
    if (res == 0) window.location.reload();
    else modal.showModal({ title: 'Could not delete account:', content: getAccountOpMessage(res), color: 'red' });
};
const clearDangerButtons = () => {
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    changePasswordEnabled.value = false;
};
onMounted(clearDangerButtons);
</script>

<template>
    <TitledCutCornerContainer title="Profile">
        <form action="javascript:void(0)" @submit=writeData>
            <PairedGridContainer width=100%>
                <span>Display Name:</span>
                <UITextBox v-model=accountManager.displayName maxlength="32" width="var(--fwidth)" title="Name used in profile, contests, etc." required></UITextBox>
                <span>Name:</span>
                <span style="text-wrap: nowrap; word-wrap: nowrap;">
                    <UITextBox v-model=accountManager.firstName maxlength="32" width="var(--hwidth)" title="First name" required></UITextBox>
                    <UITextBox v-model=accountManager.lastName maxlength="32" width="var(--hwidth)" title="Last name" required></UITextBox>
                </span>
                <span>School:</span>
                <UITextBox v-model=accountManager.school maxlength="64" width="var(--fwidth)" title="Your school name" required></UITextBox>
                <span>Grade/experience:</span>
                <span style="text-wrap: nowrap; word-wrap: nowrap;">
                    <UIDropdown v-model=gradeInput width="var(--hwidth)" :items="[
                        { text: 'Pre-High School', value: '8' },
                        { text: '9', value: '9' },
                        { text: '10', value: '10' },
                        { text: '11', value: '11' },
                        { text: '12', value: '12' },
                        { text: 'College Student', value: '13' },
                        { text: 'Post-College', value: '14' }
                    ]" title="Current grade level" required></UIDropdown>
                    <UIDropdown v-model=experienceInput width="var(--hwidth)" :items="[
                        { text: 'Beginner', value: '0' },
                        { text: 'Intermediate - USACO Silver', value: '1' },
                        { text: 'Advanced - USACO Gold or Above', value: '2' },
                    ]" title="Experience level with competitive programming" required></UIDropdown>
                </span>
                <span>Known languages:<br>(Use CTRL/SHIFT)</span>
                <UIDropdown v-model=languagesInput width="var(--fwidth)" :items="[
                    { text: 'Python', value: 'python' },
                    { text: 'C', value: 'c' },
                    { text: 'C++', value: 'cpp' },
                    { text: 'C#', value: 'cs' },
                    { text: 'Java', value: 'java' },
                    { text: 'JavaScript', value: 'js' },
                    { text: 'SQL', value: 'sql' },
                    { text: 'Assembly', value: 'asm' },
                    { text: 'PHP', value: 'php' },
                    { text: 'Swift', value: 'swift' },
                    { text: 'Pascal', value: 'pascal' },
                    { text: 'Ruby', value: 'python' },
                    { text: 'Rust', value: 'rust' },
                    { text: 'Scratch', value: 'scratch' },
                    { text: 'LabVIEW', value: 'ev3' },
                    { text: 'Kotlin', value: 'ktx' },
                    { text: 'Lua', value: 'lua' },
                    { text: 'Bash', value: 'bash' },
                ]" title="What programming languages do you know?" height="80px" multiple></UIDropdown>
                <span>Bio<br>({{ remainingBioCharacters }} chars):</span>
                <UITextArea v-model=accountManager.bio width="var(--fwidth)" min-height="2em" height="4em" max-height="20em" maxlength="2048" placeholder="Describe yourself in a few short sentences!" resize="vertical"></UITextArea>
            </PairedGridContainer>
            <UIButton class="profileSaveButton" type="submit" v-if=accountManager.unsavedChanges text="Save" color="yellow" glitch-on-mount></UIButton>
        </form>
        <WaitCover text="Please wait..." :show=showWriteDataWait></WaitCover>
    </TitledCutCornerContainer>
    <TitledCutCornerContainer title="Team">
        We haven't added teams yet, but you should get a team together anyways.
    </TitledCutCornerContainer>
    <TitledCutCornerContainer title="Account">
        <PairedGridContainer>
            <span>Username:</span>
            <UITextBox v-model=usernameNotEditable width="var(--fwidth)" title="Your unique username (you cannot edit this)" disabled></UITextBox>
            <span>Email:</span>
            <UITextBox v-model=accountManager.email width="var(--fwidth)" title="Email used to update you on contests, password changes, etc. (you cannot edit this)" disabled></UITextBox>
        </PairedGridContainer>
        <br>
        <TitledCollapsible title="Danger buttons" font-size="var(--font-medium)" border-color="red" @click="clearDangerButtons" start-collapsed>
            <!-- useless form -->
            <form class="profileDangerButtons" action="javascript:void(0)">
                <div style="text-align: right; align-content: center; font-size: var(--font-18);">Enter password:</div>
                <UITextBox type="password" v-model=currentPasswordInput placeholder="Current password"></UITextBox>
                <UIButton text="CHANGE PASSWORD" color="red" @click="changePassword" :disabled="currentPasswordInput.length == 0"></UIButton>
                <UIButton text="DELETE ACCOUNT" color="red" @click="deleteAccount" :disabled="currentPasswordInput.length == 0"></UIButton>
            </form>
        </TitledCollapsible>
    </TitledCutCornerContainer>
    <WaitCover text="Signing in..." :show=showCredWait></WaitCover>
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
    min-width: 0px;
    margin: 0px 0px;
}
</style>