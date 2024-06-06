<script setup lang="ts">
import { AnimateInContainer, TitledCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import { globalModal, UIButton, UIDropdown } from '@/components/ui-defaults/UIDefaults';
import { useAccountManager } from '@/scripts/AccountManager';
import { useContestManager } from '@/scripts/ContestManager';
import recaptcha from '@/scripts/recaptcha';
import { onMounted, ref, watch } from 'vue';
import { getTeamOpMessage, TeamOpResult } from '@/scripts/ServerConnection';
import WaitCover from '@/components/common/WaitCover.vue';

const accountManager = useAccountManager();
const contestManager = useContestManager();
const modal = globalModal();

const contestList = ref<{ text: string, value: string }[]>([]);
const registrationSelected = ref('');

const updateAvailableContestList = async () => {
    const res = await contestManager.getContestList();
    if (res instanceof Error) {
        modal.showModal({ title: res.message, content: 'Could not load upcoming contests.', color: 'resd' });
        return;
    }
    contestList.value = res.filter((v) => {
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
    if (res != TeamOpResult.SUCCESS) modal.showModal({ title: 'Could not register', content: getTeamOpMessage(res), color: 'red' });
    await Promise.all([
        accountManager.updateOwnUserData(),
        updateAvailableContestList()
    ]);
    showRegisterWait.value = false;
};
const attemptUnregister = async (registration: string) => {
    showRegisterWait.value = true;
    const res = await accountManager.unregisterContest(registration);
    if (res != TeamOpResult.SUCCESS) modal.showModal({ title: 'Could not register', content: getTeamOpMessage(res), color: 'red' });
    await Promise.all([
        accountManager.updateOwnUserData(),
        updateAvailableContestList()
    ]);
    showRegisterWait.value = false;
};
</script>

<template>
    <AnimateInContainer type="slideUp" :delay=100>
        <TitledCutCornerContainer title="Your contests" hover-animation="lift">
            <div class="roundedBlock" v-if="accountManager.registrations.length > 0">
                <h3>Upcoming</h3>
                <AnimateInContainer type="fade" v-for="(reg, i) in accountManager.registrations" :key="i" :delay="i * 200" single>
                    <div class="registrationBlock">
                        <div class="registrationStatusDotUpcoming"></div>
                        {{ reg }}
                        <UIButton class="registrationUnregister" text="Unregister" color="red" @click="attemptUnregister(reg)" glitch-on-mount></UIButton>
                    </div>
                </AnimateInContainer>
            </div>
            <div class="roundedBlock" v-if="accountManager.pastRegistrations.length > 0">
                <h3>Past</h3>
                <AnimateInContainer type="fade" v-for="(reg, i) in accountManager.pastRegistrations" :key="i" :delay="i * 200" single>
                    <div class="registrationBlock">
                        <div class="registrationStatusDotCompleted"></div>
                        {{ reg }}
                    </div>
                </AnimateInContainer>
            </div>
            <h3 v-if="accountManager.registrations.length == 0 && accountManager.pastRegistrations.length == 0">
                You are not registered for any contests!
            </h3>
            <WaitCover text="Please wait..." :show="showRegisterWait"></WaitCover>
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
    margin: 8px 0px;
    border-radius: 8px;
    background-color: #222;
    align-items: center;
}

.registrationStatusDotUpcoming,
.registrationStatusDotCompleted {
    width: 1em;
    height: 1em;
    min-width: 1em;
    min-height: 1em;
    border-radius: 50%;
}

.registrationStatusDotUpcoming {
    background-color: cyan;
}

.registrationStatusDotCompleted {
    background-color: lime;
}

.registrationUnregister {
    opacity: 0;
    transition: 50ms linear opacity;
}

.registrationBlock:hover>.registrationUnregister {
    opacity: 1;
}
</style>