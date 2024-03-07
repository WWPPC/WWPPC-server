<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelView } from '@/components/panels/PanelManager';
import { ModalMode, UIButton, UIDropdown, UITextBox, globalModal } from '@/components/ui-defaults/UIDefaults';
import PanelNavLargeLogo from '@/components/panels/PanelNavLargeLogo.vue';
import { ref, watch } from 'vue';
import { useServerConnection } from '@/scripts/ServerConnection';
import { useRoute, useRouter } from 'vue-router';
import { useReCaptcha } from 'vue-recaptcha-v3';
import LoadingCover from '@/components/LoadingCover.vue';

const router = useRouter();
const route = useRoute();

// connection modals
const modal = globalModal();
const serverConnection = useServerConnection();
serverConnection.onconnecterror(() => {
    if (route.params.page != 'login' || route.query.ignore_server !== undefined) return;
    modal.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.CONFIRM, color: 'red' }).then((result) => result ? window.location.reload() : window.location.replace('/home'));
});
serverConnection.ondisconnect(() => {
    if (route.params.page != 'login' || route.query.ignore_server !== undefined) return;
    modal.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.CONFIRM, color: 'red' }).then((result) => result ? window.location.reload() : window.location.replace('/home'));
});

// why would you do this to me (why have a chance of undefined)
const { executeRecaptcha, recaptchaLoaded, instance } = useReCaptcha() ?? { executeRecaptcha() { }, recaptchaLoaded() { }, instance: ref(null) };

// redirect if already logged in, also more connection modals
// and recaptcha stuff
watch(() => route.params.page, async () => {
    if (route.params.page == 'login') {
        serverConnection.handshakePromise.then(() => {
            if (serverConnection.loggedIn) router.push({ path: (typeof route.params.redirect == 'string' ? route.params.redirect : (route.params.redirect ?? [])[0]) ?? '/home?clearQuery', query: { clearQuery: 1 } });
        });
        if (serverConnection.connectError) modal.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.CONFIRM, color: 'red' }).then((result) => result ? window.location.reload() : window.location.replace('/home'));
        if (serverConnection.handshakeComplete && !serverConnection.connected) modal.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.CONFIRM, color: 'red' }).then((result) => result ? window.location.reload() : window.location.replace('/home'));
        await recaptchaLoaded();
        instance.value?.showBadge();
    } else {
        isSignupPage.value = false;
        await recaptchaLoaded();
        instance.value?.hideBadge();
    }
});

const usernameInput = ref<InstanceType<typeof UITextBox>>();
const passwordInput = ref<InstanceType<typeof UITextBox>>();
const isSignupPage = ref(false);
const signupForm = ref<HTMLFormElement>();
const emailInput = ref<InstanceType<typeof UITextBox>>();
const gradeInput = ref<InstanceType<typeof UIDropdown>>();
const experienceInput = ref<InstanceType<typeof UIDropdown>>();
const languageInput = ref<InstanceType<typeof UIDropdown>>();

const validateCredentials = (username: string, password: string): boolean => {
    return username.trim().length > 0 && password.trim().length > 0 && username.length <= 16 && password.length <= 1024 && /^[a-zA-Z0-9]+$/.test(username);
};
const getErrorMessage = (res: number): string => {
    return res == 1 ? 'Account with username already exists' : res == 2 ? 'Account not found' : res == 3 ? 'Incorrect password' : res == 4 ? 'Database error' : 'Unknown error (this is a bug?)';
};
const attemptLogin = async () => {
    if (!validateCredentials(usernameInput.value?.text ?? '', passwordInput.value?.text ?? '')) return;
    const res = await serverConnection.login(usernameInput.value?.text ?? '', passwordInput.value?.text ?? '');
    if (res == 0) {
        router.push((typeof route.params.redirect == 'string' ? route.params.redirect : (route.params.redirect ?? [])[0]) ?? '/home');
    } else modal.showModal({ title: 'Could not log in:', content: getErrorMessage(res), color: 'red' });
};
const toSignUp = () => {
    isSignupPage.value = true;
    if (emailInput.value) emailInput.value.text = '';
    if (gradeInput.value) gradeInput.value.selected = '';
    if (experienceInput.value) experienceInput.value.selected = '';
    if (languageInput.value) languageInput.value.selected = [];
};
const attemptSignup = async () => {
    if (!validateCredentials(usernameInput.value?.text ?? '', passwordInput.value?.text ?? '') || ((emailInput.value?.text.trim() ?? '') == '')) return;
    await recaptchaLoaded();
    const token = await executeRecaptcha('signup');
    const res = await serverConnection.signup(usernameInput.value?.text ?? '', passwordInput.value?.text ?? '', emailInput.value?.text.trim() ?? '', token ?? '');
    if (res == 0) {
        router.push((typeof route.params.redirect == 'string' ? route.params.redirect : (route.params.redirect ?? [])[0]) ?? '/home');
    } else modal.showModal({ title: 'Could not sign up:', content: getErrorMessage(res), color: 'red' });
};
</script>

<script lang="ts">
</script>

<template>
    <PanelView name="login">
        <PanelHeader>
            <PanelNavLargeLogo target="/home/home?clearQuery"></PanelNavLargeLogo>
        </PanelHeader>
        <PanelMain>
            <PanelBody name="login" isDefault>
                <!-- matrix rain? that's overdone -->
                <!-- some other cool effect in the background -->
                <!-- line of glitches following the mouse? -->
                <div class="loginNoScroll">
                    <Transition name="main">
                        <div class="fullBlock" v-show="!isSignupPage">
                            <div class="centered">
                                <div class="loginFlow">
                                    <img src="/logo.svg" class="loginLogoFloater">
                                    <h1 class="loginFlowHeader">Log In</h1>
                                    <!-- we're using socketio -->
                                    <form class="loginFlow" action="javascript:void(0)" @submit=attemptLogin>
                                        <UITextBox ref="usernameInput" placeholder="Username" style="margin-bottom: 8px;" width="208px" title="Username" autocomplete="username" autocapitalize="off" required></UITextBox>
                                        <UITextBox ref="passwordInput" placeholder="Password" type="password" style="margin-bottom: 8px;" width="208px" title="Password" autocomplete="current-password" required></UITextBox>
                                        <span>
                                            <UIButton text="Log In" type="submit" width="100px" title="Log in" glitchOnMount :disabled="usernameInput?.text.trim() == ''"></UIButton>
                                            <UIButton text="Sign Up" type="button" @click="toSignUp" width="100px" title="Continue to create a new account" glitchOnMount :disabled="usernameInput?.text.trim() == ''"></UIButton>
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
                                    <form ref="signupForm" class="loginFlow" onsubmit="return false" @submit="attemptSignup">
                                        <span>
                                            <UITextBox :value="usernameInput?.text" action="javascript:void(0)" style="margin-bottom: 8px;" width="208px" title="Username" disabled autocomplete="off"></UITextBox>
                                            <UITextBox :value="passwordInput?.text.replace(/./g, '•')" style="margin-bottom: 8px;" width="208px" title="Password" disabled autocomplete="off"></UITextBox>
                                        </span>
                                        <UITextBox ref="emailInput" type="email" name="email" style="margin-bottom: 8px;" width="424px" title="Email" placeholder="Email" required highlight-invalid></UITextBox>
                                        <div class="loginFlow2">
                                            <span>
                                                Grade Level:
                                            </span>
                                            <UIDropdown ref="gradeInput" :items="[
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
                                            <UIDropdown ref="experienceInput" :items="[
                            { text: 'Beginner', value: '0' },
                            { text: 'Intermediate', value: '1' },
                            { text: 'Advanced', value: '2' },
                        ]" title="Your experience level with competitive programming" required></UIDropdown>
                                            <span>Known languages:</span>
                                            <UIDropdown ref="languageInput" :items="[
                            { text: 'Java', value: 'java' },
                            { text: 'Python', value: 'py' },
                            { text: 'C', value: 'c' },
                            { text: 'C++', value: 'cpp' },
                            { text: 'C#', value: 'cs' },
                            { text: 'Ruby', value: 'rb' },
                        ]" title="What programming languages have you used in contest?" height="80px" multiple></UIDropdown>
                                        </div>
                                        <UIButton text="Sign Up" type="submit" width="424px" glitchOnMount></UIButton>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
                <LoadingCover text="Connecting..."></LoadingCover>
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>

<style>
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
    animation: bob 10000ms cubic-bezier(0.7, 0, 0.3, 1) infinite;
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

.loginFlow2 {
    display: grid;
    grid-template-columns: 150px 200px;
    align-items: start;
}

.loginFlow2>*:nth-child(odd) {
    justify-self: end;
    margin-right: 4px;
}

.loginFlow2>*:nth-child(even) {
    justify-self: start;
    margin-left: 4px;
    width: 100%;
    margin-bottom: 8px;
}

@keyframes bob {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-2vh);
    }

    100% {
        transform: translateY(0);
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