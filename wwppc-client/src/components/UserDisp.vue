<script setup lang="ts">
import { ref, watch } from 'vue';
import { UIButton } from './ui-defaults/UIDefaults';
import { useServerConnection } from '@/scripts/ServerConnection';
import { glitchTextTransition } from './ui-defaults/TextTransitions';
import { useRouter, useRoute } from 'vue-router';
import { useAccountManager } from '@/scripts/AccountManager';

const serverConnection = useServerConnection();
const accountManager = useAccountManager();
const router = useRouter();
const route = useRoute();
const ignoreServer = ref(route.query.ignore_server !== undefined);
watch(() => route.query, () => {
    ignoreServer.value = route.query.ignore_server !== undefined;
});

const name = ref('Not logged in');
const buttonText = ref('Log in');

const buttonAction = () => {
    if (serverConnection.loggedIn) router.push('/account');
    else if (serverConnection.manualLogin) router.push('/login');
};

serverConnection.handshakePromise.then(() => {
    if (serverConnection.loggedIn) {
        glitchTextTransition(buttonText.value, 'Account', (text) => { buttonText.value = text; }, 40, 1, 10, 2).promise;
        name.value = accountManager.displayName;
        watch(() => accountManager.displayName, () => name.value = accountManager.displayName);
    }
});
</script>

<template v-slot:userDisp>
    <div class="userDispContainer">
        <div class="userDispUser">
            <img :src=accountManager.profileImage class="userDispProfileImg" v-if="serverConnection.loggedIn || ignoreServer">
            <span class="userDispUserName">{{ name }}</span>
        </div>
        <UIButton :text=buttonText width="calc(100% - 16px)" font="20px" @click=buttonAction></UIButton>
    </div>
</template>

<style scoped>
.userDispContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 160px;
    max-width: 0px;
    margin: 0px 8px;
    transition: 500ms ease min-width;
}

.userDispUser {
    display: flex;
    margin-bottom: 8px;
    align-items: center;
}

.userDispProfileImg {
    width: 28px;
    height: 28px;
    min-width: 28px;
    border: 2px solid white;
    border-radius: 50%;
}

.userDispUserName {
    min-width: calc(100% - 32px);
    max-width: calc(100% - 32px);
    margin-left: 4px;
    transition: 500ms ease min-width, 500ms ease opacity;
    text-wrap: nowrap;
}

@media (max-width: 600px) {
    .userDispContainer {
        min-width: 110px;
    }

    .userDispUserName {
        opacity: 0;
        min-width: 0px;
        max-width: 0px;
    }
}
</style>