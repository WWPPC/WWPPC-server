<script setup lang="ts">
import { AnimateInContainer, TitledCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import { globalModal, UIButton, UIDropdown } from '@/components/ui-defaults/UIDefaults';
import { useAccountManager } from '@/scripts/AccountManager';
import { useContestManager } from '@/scripts/ContestManager';
import recaptcha from '@/scripts/recaptcha';
import { onMounted, ref, watch } from 'vue';
import { AccountOpResult } from '@/scripts/ServerConnection';
import WaitCover from '@/components/WaitCover.vue';

const accountManager = useAccountManager();
const contestManager = useContestManager();
const modal = globalModal();

const contestList = ref<{ text: string, value: string }[]>([]);
const registrationSelected = ref('');

const updateAvailableContestList = async () => {
    contestList.value = (await contestManager.getContestList())?.filter((v) => {
        return !accountManager.registrations.includes(v) && !accountManager.pastRegistrations.includes(v)
    }).map((c) => ({ text: c, value: c })) ?? [];
};
onMounted(updateAvailableContestList);
watch(() => accountManager.registrations, updateAvailableContestList);

const showRegisterWait = ref(false);
const attemptRegister = async () => {
    if (registrationSelected.value == '') return;
    showRegisterWait.value = true;
    const token = await recaptcha.execute('register_contest');
    const res = await accountManager.registerContest(registrationSelected.value, token);
    if (res != AccountOpResult.SUCCESS) modal.showModal({
        title: 'Could not register',
        content: res == AccountOpResult.NOT_EXISTS ? 'Contest not found' : (res == AccountOpResult.ALREADY_EXISTS ? 'Already registered' : (res == AccountOpResult.ERROR ? 'Internal error' : (res == AccountOpResult.INCORRECT_CREDENTIALS ? 'Incorrect credentials' : 'Unknown error (bug?)')))
    });
    showRegisterWait.value = false;
    updateAvailableContestList();
    accountManager.updateOwnUserData();
};
const attemptUnregister = async (registration: string) => {
    const res = await accountManager.unregisterContest(registration);
    if (res != AccountOpResult.SUCCESS) modal.showModal({
        title: 'Could not unregister',
        content: res == AccountOpResult.NOT_EXISTS ? 'Contest not found' : (res == AccountOpResult.ALREADY_EXISTS ? 'Already registered' : (res == AccountOpResult.ERROR ? 'Internal error' : (res == AccountOpResult.INCORRECT_CREDENTIALS ? 'Incorrect credentials' : 'Unknown error (bug?)')))
    });
    updateAvailableContestList();
    accountManager.updateOwnUserData();
}
</script>

<template>
    <AnimateInContainer type="slideUp" :delay=100>
        <TitledCutCornerContainer title="Your contests" hover-animation="lift">
            <div class="roundedBlock" v-if="accountManager.registrations.length > 0">
                <h3>Upcoming</h3>
                <AnimateInContainer type="slideUp" v-for="(reg, i) in accountManager.registrations" :key="i" :delay="i * 200" single>
                    <div class="registrationBlock">
                        <div class="registrationStatusDotUpcoming"></div>
                        {{ reg }}
                        <UIButton text="Unregister" @click="attemptUnregister(reg)"></UIButton>
                    </div>
                </AnimateInContainer>
            </div>
            <div class="roundedBlock" v-if="accountManager.pastRegistrations.length > 0">
                <h3>Past</h3>
                <AnimateInContainer type="slideUp" v-for="(reg, i) in accountManager.pastRegistrations" :key="i" :delay="i * 200" single>
                    <div class="registrationBlock">
                        <div class="registrationStatusDotCompleted"></div>
                        {{ reg }}
                    </div>
                </AnimateInContainer>
            </div>
            <h3 v-if="accountManager.registrations.length == 0 && accountManager.pastRegistrations.length == 0">
                You are not registered for any contests!
            </h3>
        </TitledCutCornerContainer>
    </AnimateInContainer>
    <AnimateInContainer type="slideUp" :delay=200>
        <TitledCutCornerContainer title="Register" hover-animation="lift">
            <UIDropdown :items="contestList" v-model="registrationSelected" width="200px"></UIDropdown>
            <UIButton text="Register" :disabled="registrationSelected == ''" @click="attemptRegister"></UIButton>
            <br>
            <span>Registering will also register your entire team!</span>
            <WaitCover text="Please wait..." :show="showRegisterWait"></WaitCover>
        </TitledCutCornerContainer>
    </AnimateInContainer>
</template>

<style scoped>
.registrationBlock {
    display: grid;
    grid-template-columns: 1em 1fr min-content;
    column-gap: 8px;
    font-size: var(--font-medium);
    line-height: 1em;
    box-sizing: border-box;
    width: 100%;
    padding: 8px 8px;
    border-radius: 8px;
    background-color: #222;
}

.registrationStatusDotUpcoming,
.registrationStatusDotCompleted {
    width: 1em;
    height: 1em;
    border-radius: 50%;
}

.registrationStatusDotUpcoming {
    background-color: cyan;
}

.registrationStatusDotCompleted {
    background-color: lime;
}
</style>