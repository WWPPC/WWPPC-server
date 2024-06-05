<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelView, PanelNavLargeLogo } from '@/components/panels/PanelManager';
import { UIButton, UIDropdown, UITextBox, globalModal } from '@/components/ui-defaults/UIDefaults';
import { ref, watch } from 'vue';
import { useServerConnection, AccountOpResult, getAccountOpMessage } from '@/scripts/ServerConnection';
import { useRoute, useRouter } from 'vue-router';
import LoadingCover from '@/components/common/LoadingCover.vue';
import WaitCover from '@/components/common/WaitCover.vue';
import { PairedGridContainer } from '@/components/ui-defaults/UIContainers';
import { languageMaps, experienceMaps, gradeMaps, useAccountManager, validateCredentials } from '@/scripts/AccountManager';
import recaptcha from '@/scripts/recaptcha';
import { useConnectionEnforcer } from '@/scripts/ConnectionEnforcer';

const router = useRouter();
const route = useRoute();

// connection modals
const modal = globalModal();
const serverConnection = useServerConnection();
const connectionEnforcer = useConnectionEnforcer();
const accountManager = useAccountManager();

connectionEnforcer.connectionInclude.add('/login');

watch(() => route.params.page, async () => {
    if (route.params.page == 'login' && route.query.ignore_server === undefined) {
        serverConnection.handshakePromise.then(() => {
            if (serverConnection.loggedIn) router.replace({ path: (typeof route.query.redirect == 'string' ? route.query.redirect : (route.query.redirect ?? [])[0]) ?? '/home?clearQuery', query: { clearQuery: 1 } });
        });
    } else {
        page.value = 0;
    }
});

const usernameInput = ref('');
const passwordInput = ref('');
const page = ref(0);
const firstNameInput = ref('');
const lastNameInput = ref('');
const emailInput = ref('');
const schoolInput = ref('');
const gradeInput = ref('');
const experienceInput = ref('');
const languageInput = ref<string[]>([]);
const showLoginWait = ref(false);
const showRecoveryWait = ref(false);
const attemptedRecovery = ref(false);
const attemptLogin = async () => {
    if (usernameInput.value.trim() == '' || passwordInput.value == '') return;
    if (!validateCredentials(usernameInput.value, passwordInput.value)) {
        modal.showModal({ title: 'Invalid username or password', content: 'Username must be less than or equal to 16 characters and contain only lowercase alphanumeric (a-z, 0-9) and "-" and "_" characters.' });
        return;
    }
    showLoginWait.value = true;
    const token = await recaptcha.execute('login');
    const res = await accountManager.login(usernameInput.value, passwordInput.value, token);
    showLoginWait.value = false;
    if (res == 0) router.push({ path: (typeof route.query.redirect == 'string' ? route.query.redirect : (route.query.redirect ?? [])[0]) ?? '/home', query: { clearQuery: 1 } });
    else modal.showModal({ title: 'Could not log in:', content: getAccountOpMessage(res), color: 'red' });
};
const toSignUp = () => {
    if (usernameInput.value.trim() == '' || passwordInput.value == '') return;
    if (!validateCredentials(usernameInput.value, passwordInput.value)) {
        modal.showModal({ title: 'Invalid username or password', content: 'Username must be less than or equal to 16 characters and contain only lowercase alphanumeric (a-z, 0-9) and "-" and "_" characters.' });
        return;
    }
    firstNameInput.value = '';
    lastNameInput.value = '';
    emailInput.value = '';
    schoolInput.value = '';
    gradeInput.value = '';
    experienceInput.value = '';
    languageInput.value = [];
    page.value = 1;
};
const attemptSignup = async () => {
    if (!validateCredentials(usernameInput.value, passwordInput.value) || ((firstNameInput.value.trim()) == '') || ((lastNameInput.value.trim()) == '') || ((schoolInput.value.trim()) == '') || ((emailInput.value.trim()) == '') || gradeInput.value == '' || experienceInput.value == '') return;
    showLoginWait.value = true;
    const token = await recaptcha.execute('signup');
    const res = await accountManager.signup(usernameInput.value, passwordInput.value, token, {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        school: schoolInput.value.trim(),
        grade: Number(gradeInput.value),
        experience: Number(experienceInput.value),
        languages: languageInput.value
    });
    showLoginWait.value = false;
    if (res == 0) router.push({ path: (typeof route.query.redirect == 'string' ? route.query.redirect : (route.query.redirect ?? [])[0]) ?? '/home', query: { clearQuery: 1 } });
    else modal.showModal({ title: 'Could not sign up:', content: getAccountOpMessage(res), color: 'red' });
};
const toRecovery = async () => {
    emailInput.value = '';
    page.value = 2;
};
const attemptRecovery = async () => {
    if (!validateCredentials(usernameInput.value, 'oof') || ((emailInput.value.trim()) == '')) return;
    showRecoveryWait.value = true;
    const token = await recaptcha.execute('recoverpassword');
    const res = await accountManager.requestRecovery(usernameInput.value, emailInput.value, token);
    showRecoveryWait.value = false;
    if (res == 0) {
        modal.showModal({ title: 'Recovery email sent', content: 'The recovery email was sent and should arrive in your inbox within 10 minutes.' });
        attemptedRecovery.value = true;
    } else modal.showModal({
        title: 'Could not send recovery email:',
        content: res == AccountOpResult.ALREADY_EXISTS ? 'An email was already sent recently' : res == AccountOpResult.NOT_EXISTS ? 'Account not found' : res == AccountOpResult.INCORRECT_CREDENTIALS ? 'Inputted email does not match account record' : res == AccountOpResult.ERROR ? 'Internal error' : res == AccountOpResult.NOT_CONNECTED ? 'Not connected to server' : 'Unknown error (this is a bug?)'
    });
};

//definitely not rickroll
watch(usernameInput, () => {
    if (usernameInput.value.toLowerCase() == 'rick astley') window.location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
});
</script>

<script lang="ts">
</script>

<template>
    <PanelView name="login" title="WWPPC">
        <PanelHeader>
            <PanelNavLargeLogo target="/home/home?clearQuery"></PanelNavLargeLogo>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="default" title="Login" is-default>
                <div class="loginNoScroll">
                    <Transition name="main">
                        <div class="fullBlock loginScroll" v-show="page == 0">
                            <div class="centered">
                                <div class="loginVertical">
                                    <img src="/logo.svg" class="loginLogoFloater">
                                    <h1 class="loginVerticalHeader">Log In</h1>
                                    <form class="loginVertical" action="javascript:void(0)">
                                        <UITextBox v-model="usernameInput" placeholder="Username" style="margin-bottom: 8px;" width="208px" title="Username" maxlength="16" autocomplete="username" autocapitalize="off" pattern="[a-z0-9\-_]*" highlight-invalid required></UITextBox>
                                        <UITextBox v-model="passwordInput" placeholder="Password" type="password" style="margin-bottom: 8px;" width="208px" title="Password" maxlength="1024" autocomplete="current-password" required></UITextBox>
                                        <span>
                                            <UIButton text="Log In" type="submit" @click="attemptLogin" width="100px" title="Log in" glitchOnMount :disabled=showLoginWait></UIButton>
                                            <UIButton text="Sign Up" type="submit" @click="toSignUp" width="100px" title="Continue to create a new account" glitchOnMount :disabled=showLoginWait></UIButton>
                                        </span>
                                        <span class="loginForgotPassword" @click="toRecovery">Forgot password?</span>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Transition>
                    <Transition name="second">
                        <div class="fullBlock loginScroll" v-show="page == 1">
                            <div class="centered">
                                <div class="loginVertical">
                                    <UIButton @click="page = 0" text="Cancel" style="margin-top: 8px;" width="160px" color="red" title="Go back to login page"></UIButton>
                                    <h1 class="loginVerticalHeader2">Sign Up</h1>
                                    <form class="loginVertical" action="javascript:void(0)" @submit=attemptSignup>
                                        <span style="margin-bottom: 8px;" class="nowrap">
                                            <UITextBox :value="usernameInput" width="var(--hwidth)" title="Username" disabled autocomplete="off"></UITextBox>
                                            <UITextBox :value="passwordInput.replace(/./g, '•')" width="var(--hwidth)" title="Password" disabled autocomplete="off"></UITextBox>
                                        </span>
                                        <span style="margin-bottom: 8px;" class="nowrap">
                                            <UITextBox v-model="firstNameInput" width="var(--hwidth)" title="First name" placeholder="First name" maxlength="32" autocomplete="given-name" required></UITextBox>
                                            <UITextBox v-model="lastNameInput" width="var(--hwidth)" title="Last Name" placeholder="Last name" maxlength="32" autocomplete="family-name" required></UITextBox>
                                        </span>
                                        <UITextBox v-model="schoolInput" style="margin-bottom: 8px;" width="var(--fwidth)" title="Your school name" placeholder="School name" maxlength="64" required></UITextBox>
                                        <UITextBox v-model="emailInput" type="email" name="email" style="margin-bottom: 8px;" width="var(--fwidth)" title="Email" placeholder="Email" maxlength="32" required highlight-invalid></UITextBox>
                                        <PairedGridContainer width="var(--fwidth)" style="margin-bottom: 6px;">
                                            <span>
                                                Grade Level:
                                            </span>
                                            <UIDropdown v-model="gradeInput" width="calc(100% - 4px)" :items="gradeMaps" title="Your current grade level" required></UIDropdown>
                                            <span>
                                                Experience Level:
                                            </span>
                                            <UIDropdown v-model="experienceInput" width="calc(100% - 4px)" :items="experienceMaps" title="Your experience level with competitive programming" required></UIDropdown>
                                            <span>
                                                Known languages:<br>(use CTRL/SHIFT)
                                            </span>
                                            <UIDropdown v-model="languageInput" width="calc(100% - 4px)" :items="languageMaps" title="What programming languages have you used in contest?" height="80px" multiple></UIDropdown>
                                        </PairedGridContainer>
                                        <UIButton text="Sign Up" type="submit" width="var(--fwidth)" glitchOnMount :disabled="showLoginWait"></UIButton>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Transition>
                    <Transition name="second">
                        <div class="fullBlock loginScroll" v-show="page == 2">
                            <div class="centered">
                                <div class="loginVertical">
                                    <UIButton @click="page = 0" text="Cancel" style="margin-top: 8px;" width="160px" color="red" title="Go back to login page"></UIButton>
                                    <h1 class="loginVerticalHeader2">Account Recovery</h1>
                                    <p style="text-align: center; font-size: var(--font-small);">
                                        Enter your email to reset your password.
                                        <br>
                                        We will send an account recovery email shortly.
                                    </p>
                                    <form class="loginVertical" action="javascript:void(0)" @submit=attemptRecovery>
                                        <UITextBox :value="usernameInput" style="margin-top: 8px;" width="var(--fwidth)" title="Username" disabled autocomplete="off"></UITextBox>
                                        <UITextBox v-model="emailInput" type="email" name="email" style="margin: 8px 0px;" width="var(--fwidth)" title="Email" placeholder="Email" maxlength="32" required highlight-invalid></UITextBox>
                                        <UIButton text="Reset Password" type="submit" width="var(--fwidth)" glitchOnMount :disabled="attemptedRecovery || showLoginWait"></UIButton>
                                        <span v-if="attemptedRecovery"><i>Reload to try again</i></span>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
                <WaitCover text="Signing in..." :show=showLoginWait></WaitCover>
                <WaitCover text="Sending email..." :show=showRecoveryWait></WaitCover>
                <LoadingCover text="Connecting..." ignore-server></LoadingCover>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>

<style scoped>
.loginNoScroll {
    width: 100%;
    height: 100%;
    margin: -16px 0px;
    padding: 16px 0px;
    overflow: hidden;
}

.loginScroll {
    max-height: 100%;
    overflow-y: auto;
}

* {
    --fwidth: min(calc(100% - 8px), 424px);
    --hwidth: min(calc(50% - 8px), 208px);
}

.nowrap {
    width: 100%;
    text-wrap: nowrap;
    word-wrap: nowrap;
}

.loginLogoFloater {
    display: block;
    height: 30vh;
    animation: loginLogoBob 10000ms cubic-bezier(0.7, 0, 0.3, 1) infinite;
}

.loginVerticalHeader {
    margin-top: -16px;
    font-size: 7vh;
}

.loginVerticalHeader2 {
    font-size: 7vh;
}

.loginVertical {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.loginForgotPassword {
    color: lime;
    text-decoration: underline;
    cursor: pointer;
    margin-top: 8px;
}

@keyframes loginLogoBob {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-2vh);
    }
}

.main-enter-active,
.main-leave-active,
.second-enter-active,
.second-leave-active {
    transition: 500ms ease transform;
}

.main-enter-from,
.main-leave-to {
    transform: translateY(-100%);
}

.main-enter-to,
.main-leave-from {
    transform: translateY(0%);
}

.second-enter-to,
.second-leave-from {
    transform: translateY(calc(-100% - 32px));
}

.second-enter-from,
.second-leave-to {
    transform: translateY(0%);
}
</style>