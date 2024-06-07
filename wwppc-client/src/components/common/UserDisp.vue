<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { UIButton } from '@/components/ui-defaults/UIDefaults';
import { useServerConnection } from '@/scripts/ServerConnection';
import { glitchTextTransition } from '@/components/ui-defaults/TextTransitions';
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

const name = ref('Not signed in');
const buttonText = ref('Log in');

const buttonAction = () => {
    if (serverConnection.loggedIn) router.push('/account');
    else if (serverConnection.manualLogin) router.push({ path: '/login', query: { redirect: route.fullPath, clearQuery: 1 }});
};

serverConnection.onconnect(() => {
    serverConnection.handshakePromise.then(() => {
        if (serverConnection.loggedIn) {
            glitchTextTransition(buttonText.value, 'Account', (text) => { buttonText.value = text; }, 40, 1, 10, 2).promise;
            name.value = accountManager.displayName;
        }
    });
});
onMounted(() => {
    serverConnection.handshakePromise.then(() => {
        if (serverConnection.loggedIn) {
            glitchTextTransition(buttonText.value, 'Account', (text) => { buttonText.value = text; }, 40, 1, 10, 2).promise;
            name.value = accountManager.displayName;
        }
    });
});
watch(() => accountManager.displayName, () => {
    if (serverConnection.loggedIn) name.value = accountManager.displayName;
});
serverConnection.ondisconnect(() => {
    name.value = 'Not signed in';
    glitchTextTransition(buttonText.value, 'Sign in', (text) => { buttonText.value = text; }, 40, 1, 10, 2).promise;
});
</script>

<template v-slot:userDisp>
    <div class="userDispContainer">
        <div class="userDispUser">
            <img :src=accountManager.profileImage class="userDispProfileImg" v-if="serverConnection.loggedIn || ignoreServer">
            <div class="userDispUserName">{{ name }}</div>
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
    max-width: 240px;
    margin: 0px 8px;
    transition: 500ms ease max-width, 500ms ease min-width;
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
    max-width: 200px;
    margin-left: 4px;
    transition: 500ms ease max-width, 500ms ease opacity;
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

@media (max-width: 700px) {
    .userDispContainer {
        min-width: 110px;
    }

    .userDispUserName {
        opacity: 0;
        max-width: 0px;
    }
}
</style>