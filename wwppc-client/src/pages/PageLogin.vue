<script setup lang="ts">
import { PanelBody, PanelHeader, PanelMain, PanelView } from '@/components/panels/PanelManager';
import { ModalMode, UIButton, UITextBox, globalModal } from '@/components/ui-defaults/UIDefaults';
import PanelNavLargeLogo from '@/components/panels/PanelNavLargeLogo.vue';
import { ref, watch } from 'vue';
import { useServerConnection } from '@/scripts/ServerConnection';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const modal = globalModal();
const serverConnection = useServerConnection();
serverConnection.onconnecterror(() => {
    if (route.params.page != 'contest' || route.query.ignore_server !== undefined) return;
    modal.showModal({ title: 'Connect Error', content: 'Could not connect to the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.reload());
});
serverConnection.ondisconnect(() => {
    if (route.params.page != 'login' || route.query.ignore_server !== undefined) return;
    modal.showModal({ title: 'Disconnected', content: 'You were disconnected from the server. Reload the page to reconnect.', mode: ModalMode.NOTIFY, color: 'red' }).then(() => window.location.reload());
});

// redirect if already logged in
watch(() => route.params.page, () => {
    if (route.params.page == 'login') serverConnection.handshakePromise.then(() => {
        if (serverConnection.loggedIn) router.push({ path: (typeof route.params.redirect == 'string' ? route.params.redirect : (route.params.redirect ?? [])[0]) ?? '/home?clearQuery', query: { clearQuery: 1 } });
    });
});

const usernameInput = ref('');
const passwordInput = ref('');

const validateCredentials = (username: string, password: string): boolean => {
    return username.length > 0 && password.length > 0 && username.length <= 16 && password.length <= 1024 && /^[a-zA-Z0-9]+$/.test(username);
};
const attemptLogin = async () => {
    if (usernameInput.value == '' || passwordInput.value == '' || !validateCredentials(usernameInput.value, passwordInput.value)) return;
    const res = await serverConnection.login(usernameInput.value, passwordInput.value);
    console.log(res)
    if (res == 0) {
        router.push((typeof route.params.redirect == 'string' ? route.params.redirect : (route.params.redirect ?? [])[0]) ?? '/home');
    } else modal.showModal({ title: 'Could not log in:', content: res == 1 ? 'Account with username already exists' : res == 2 ? 'Account not found' : res == 3 ? 'Incorrect password' : res == 4 ? 'Database error' : 'Unknown error (this is a bug?)', color: 'red' });
};
// const res = await serverConnection.signup(usernameInput.value, passwordInput.value, 'testuser@dne.com');

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
                <div class="centered">
                    <div class="loginFlow">
                        <img src="/logo.svg" class="loginLogoFloater">
                        <form class="loginForm" onsubmit="return false;">
                            <UITextBox @input="(text) => usernameInput = text" placeholder="Username" style="margin-bottom: 8px;" width="208px" title="Username" autocomplete="username"></UITextBox>
                            <UITextBox @input="(text) => passwordInput = text" placeholder="Password" type="password" style="margin-bottom: 8px;" width="208px" title="Password" autocomplete="current-password"></UITextBox>
                            <span>
                                <UIButton text="Log In" type="submit" @click=attemptLogin width="100px" glitchOnMount :disabled="usernameInput.trim() == ''"></UIButton>
                                <UIButton text="Sign Up" type="button" width="100px" glitchOnMount :disabled="usernameInput.trim() == ''"></UIButton>
                            </span>
                        </form>
                    </div>
                </div>
                <!-- scroll down for stuff -->
            </PanelBody>
        </PanelMain>
    </PanelView>
</template>

<style>
.loginLogoFloater {
    display: block;
    height: 40vh;
    animation: bob 10000ms cubic-bezier(0.7, 0, 0.3, 1) infinite;
}

.loginFlow,
.loginForm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 40vw;
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