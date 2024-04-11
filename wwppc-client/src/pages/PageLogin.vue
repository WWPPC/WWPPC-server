<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelView, PanelNavLargeLogo } from '@/components/panels/PanelManager';
import { ModalMode, UIButton, UIDropdown, UITextBox, globalModal } from '@/components/ui-defaults/UIDefaults';
import { ref, watch } from 'vue';
import { getAccountOpMessage, useServerConnection } from '@/scripts/ServerConnection';
import { useRoute, useRouter } from 'vue-router';
import LoadingCover from '@/components/LoadingCover.vue';
import WaitCover from '@/components/WaitCover.vue';
import { PairedGridContainer } from '@/components/ui-defaults/UIContainers';
import { useAccountManager } from '@/scripts/AccountManager';
import recaptcha from '@/scripts/recaptcha';

const router = useRouter();
const route = useRoute();

// connection modals
const modal = globalModal();
const serverConnection = useServerConnection();
const accountManager = useAccountManager();
serverConnection.onconnecterror(() => {
    if (route.params.page != 'login') return;
    modal.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.CONFIRM, color: 'red' }).then((result) => result ? window.location.reload() : window.location.replace('/home'));
});
serverConnection.ondisconnect(() => {
    if (route.params.page != 'login') return;
    modal.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.CONFIRM, color: 'red' }).then((result) => result ? window.location.reload() : window.location.replace('/home'));
});

// redirect if already logged in, also more connection modals
// and recaptcha stuff
watch(() => route.params.page, async () => {
    if (route.params.page == 'login') {
        serverConnection.handshakePromise.then(() => {
            if (serverConnection.loggedIn) router.push({ path: (typeof route.query.redirect == 'string' ? route.query.redirect : (route.query.redirect ?? [])[0]) ?? '/home?clearQuery', query: { clearQuery: 1 } });
        });
        if (serverConnection.connectError) modal.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.CONFIRM, color: 'red' }).then((result) => result ? window.location.reload() : window.location.replace('/home'));
        if (serverConnection.handshakeComplete && !serverConnection.connected) modal.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.CONFIRM, color: 'red' }).then((result) => result ? window.location.reload() : window.location.replace('/home'));
    } else {
        isSignupPage.value = false;
    }
});

const usernameInput = ref('');
const passwordInput = ref('');
const isSignupPage = ref(false);
const firstNameInput = ref('');
const lastNameInput = ref('');
const emailInput = ref('');
const schoolInput = ref('');
const gradeInput = ref('');
const experienceInput = ref('');
const languageInput = ref(new Array<string>());
const showLoginWait = ref(false);

const validateCredentials = (username: string, password: string): boolean => {
    return username.trim().length > 0 && password.trim().length > 0 && username.length <= 16 && password.length <= 1024 && /^[a-zA-Z0-9\-_=+]+$/.test(username);
};
const attemptLogin = async () => {
    if (!validateCredentials(usernameInput.value ?? '', passwordInput.value ?? '')) return;
    showLoginWait.value = true;
    const token = await recaptcha.execute('login');
    const res = await accountManager.login(usernameInput.value ?? '', passwordInput.value ?? '', token);
    showLoginWait.value = false;
    if (res == 0) {
        router.push((typeof route.query.redirect == 'string' ? route.query.redirect : (route.query.redirect ?? [])[0]) ?? '/home');
    } else modal.showModal({ title: 'Could not log in:', content: getAccountOpMessage(res), color: 'red' });
};
const toSignUp = () => {
    if (!validateCredentials(usernameInput.value ?? '', passwordInput.value ?? '')) return;
    isSignupPage.value = true;
};
const attemptSignup = async () => {
    if (!validateCredentials(usernameInput.value ?? '', passwordInput.value ?? '') || ((firstNameInput.value.trim() ?? '') == '') || ((lastNameInput.value.trim() ?? '') == '') || ((schoolInput.value.trim() ?? '') == '') || ((emailInput.value.trim() ?? '') == '') || gradeInput.value == '' || experienceInput.value == '') return;
    showLoginWait.value = true;
    const token = await recaptcha.execute('signup');
    const res = await accountManager.signup(usernameInput.value ?? '', passwordInput.value ?? '', token, {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        school: schoolInput.value.trim(),
        grade: Number(gradeInput.value),
        experience: Number(experienceInput.value),
        languages: languageInput.value
    });
    showLoginWait.value = false;
    if (res == 0) {
        router.push((typeof route.query.redirect == 'string' ? route.query.redirect : (route.query.redirect ?? [])[0]) ?? '/home');
    } else modal.showModal({ title: 'Could not sign up:', content: getAccountOpMessage(res), color: 'red' });
};
</script>

<script lang="ts">
</script>

<template>
    <PanelView name="login" title="WWPPC">
        <PanelHeader>
            <PanelNavLargeLogo target="/home/home?clearQuery"></PanelNavLargeLogo>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="login" title="Login" is-default>
                <div class="loginNoScroll">
                    <Transition name="main">
                        <div class="fullBlock" v-show="!isSignupPage">
                            <div class="centered">
                                <div class="loginFlow">
                                    <img src="/logo.svg" class="loginLogoFloater">
                                    <h1 class="loginFlowHeader">Log In</h1>
                                    <form class="loginFlow" action="javascript:void(0)">
                                        <UITextBox v-model=usernameInput placeholder="Username" style="margin-bottom: 8px;" width="208px" title="Username" maxlength="16" autocomplete="username" autocapitalize="off" required></UITextBox>
                                        <UITextBox v-model=passwordInput placeholder="Password" type="password" style="margin-bottom: 8px;" width="208px" title="Password" maxlength="1024" autocomplete="current-password" required></UITextBox>
                                        <span>
                                            <UIButton text="Log In" type="submit" @click="attemptLogin" width="100px" title="Log in" glitchOnMount :disabled=showLoginWait></UIButton>
                                            <UIButton text="Sign Up" type="button" @click="toSignUp" width="100px" title="Continue to create a new account" glitchOnMount :disabled=showLoginWait></UIButton>
                                        </span>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Transition>
                    <Transition name="signup">
                        <div class="fullBlock" v-show="isSignupPage">
                            <div class="centered">
                                <div class="loginFlow">
                                    <UIButton @click="isSignupPage = false" text="Cancel" style="margin-top: 8px;" width="160px" color="red" title="Go back to login page"></UIButton>
                                    <h1 class="loginFlowHeader2">Sign Up</h1>
                                    <form class="loginFlow" action="javascript:void(0)" @submit=attemptSignup>
                                        <span style="margin-bottom: 8px;">
                                            <UITextBox :value=usernameInput width="208px" title="Username" disabled autocomplete="off"></UITextBox>
                                            <UITextBox :value="passwordInput.replace(/./g, '•')" width="208px" title="Password" disabled autocomplete="off"></UITextBox>
                                        </span>
                                        <span style="margin-bottom: 8px;">
                                            <UITextBox v-model=firstNameInput width="208px" title="First name" placeholder="First name" maxlength="32" autocomplete="given-name" required></UITextBox>
                                            <UITextBox v-model=lastNameInput width="208px" title="Last Name" placeholder="Last name" maxlength="32" autocomplete="family-name" required></UITextBox>
                                        </span>
                                        <UITextBox v-model=schoolInput style="margin-bottom: 8px;" width="424px" title="Your school name" placeholder="School name" maxlength="64" required></UITextBox>
                                        <UITextBox v-model=emailInput type="email" name="email" style="margin-bottom: 8px;" width="424px" title="Email" placeholder="Email" maxlength="32" required highlight-invalid></UITextBox>
                                        <PairedGridContainer width="424px" style="margin-bottom: 6px;">
                                            <span>
                                                Grade Level:
                                            </span>
                                            <UIDropdown v-model="gradeInput" width="calc(100% - 4px)" :items="[
                            { text: 'Pre-High School', value: '8' },
                            { text: '9', value: '9' },
                            { text: '10', value: '10' },
                            { text: '11', value: '11' },
                            { text: '12', value: '12' },
                            { text: 'College Student', value: '13' },
                            { text: 'Graduated', value: '14' }
                        ]" title="Your current grade level" required></UIDropdown>
                                            <span>
                                                Experience Level:
                                            </span>
                                            <UIDropdown v-model="experienceInput" width="calc(100% - 4px)" :items="[
                            { text: 'Beginner / AP CS A', value: '0' },
                            { text: 'Intermediate / USACO Silver / Codeforces 1500', value: '1' },
                            { text: 'Good / USACO Gold / Codeforces 1900', value: '2' },
                            { text: 'Advanced / USACO Platinum / Codeforces Grandmaster', value: '3' },
                            { text: 'Cracked / IOI / USACO Camp', value: '4' },
                        ]" title="Your experience level with competitive programming" required></UIDropdown>
                                            <span>
                                                Known languages:<br>(use CTRL/SHIFT)
                                            </span>
                                            <UIDropdown v-model="languageInput" width="calc(100% - 4px)" :items="[
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
                        ]" title="What programming languages have you used in contest?" height="80px" multiple></UIDropdown>
                                        </PairedGridContainer>
                                        <UIButton text="Sign Up" type="submit" width="424px" glitchOnMount :disabled=showLoginWait></UIButton>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
                <LoadingCover text="Connecting..."></LoadingCover>
                <WaitCover text="Signing in..." :show=showLoginWait></WaitCover>
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

.loginLogoFloater {
    display: block;
    height: 30vh;
    animation: loginLogoBob 10000ms cubic-bezier(0.7, 0, 0.3, 1) infinite;
}

.loginFlowHeader {
    margin-top: -16px;
    font-size: 7vh;
}

.loginFlowHeader2 {
    font-size: 7vh;
}

.loginFlow {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: max(300px, 40vw);
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
</style>

<style scoped>
.main-enter-active,
.main-leave-active,
.signup-enter-active,
.signup-leave-active {
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

.signup-enter-to,
.signup-leave-from {
    transform: translateY(calc(-100% - 32px));
}

.signup-enter-from,
.signup-leave-to {
    transform: translateY(0%);
}
</style>