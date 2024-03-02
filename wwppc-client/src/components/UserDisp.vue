<script setup lang="ts">
import { ref, watch } from 'vue';
import { UIButton } from './ui-defaults/UIDefaults';
import { useServerConnection } from '@/scripts/ServerConnection';
import { glitchTextTransition } from './ui-defaults/TextTransitions';
import { useRouter } from 'vue-router';

const serverConnection = useServerConnection();
const router = useRouter();

const name = ref('Not logged in');
const buttonText = ref('Log in');

const buttonAction = () => {
    if (serverConnection.loggedIn) {
        // go to account page
    } else {
        router.push('/login');
    }
};

watch(() => serverConnection.loggedIn, (loginState) => {
    if (loginState) {
        glitchTextTransition(buttonText.value, 'Account', (text) => { buttonText.value = text; }, 40, 1, 15, 2);
    }
});
</script>

<template v-slot:userDisp>
    <div class="userDispContainer">
        <div class="userDispUser">
            <img :src="'lol'" class="userDispUserImage">
            <span class="userDispUserName">{{ name }}</span>
        </div>
        <UIButton :text=buttonText width="calc(100% - 16px)" font="20px" @click=buttonAction></UIButton>
    </div>
</template>

<style>
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

.userDispUserImage {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}

.userDispUserName {
    min-width: calc(100% - 32px);
    max-width: calc(100% - 32px);
    transition: 500ms ease min-width, 500ms ease opacity;
    text-wrap: nowrap;
}

@media (max-width: 500px) {
    .userDispContainer {
        min-width: 90px;
    }

    .userDispUserName {
        opacity: 0;
        min-width: 0px;
        max-width: 0px;
    }
}

/* use container query to hide username if viewport is too small */
</style>