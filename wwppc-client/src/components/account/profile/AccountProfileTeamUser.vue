<script setup lang="ts">
import { AnimateInContainer } from '@/components/ui-defaults/UIContainers';
import { globalModal, ModalMode, UIButton, UILoadingSpinner } from '@/components/ui-defaults/UIDefaults';
import { type AccountData, useAccountManager } from '@/scripts/AccountManager';
import recaptcha from '@/scripts/recaptcha';
import { getTeamOpMessage, TeamOpResult } from '@/scripts/ServerConnection';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
    user: string
    team: string
    allowKick?: boolean
}>();

const router = useRouter();
const modal = globalModal();
const accountManager = useAccountManager();

const data = ref<AccountData | null>(null);

watch(() => props.user, async () => {
    const res = await accountManager.getUserData(props.user);
    if (!(res instanceof Error)) data.value = res;
});
onMounted(async () => {
    const res = await accountManager.getUserData(props.user);
    if (!(res instanceof Error)) data.value = res;
});

const openUserView = () => {
    router.push('/user/@' + props.user);
};

const kick = async () => {
    const confirmation = await modal.showModal({ title: 'Kick from team?', content: `You are about to kick ${data.value?.displayName} (@${props.user}) from the team. Are you sure?`, mode: ModalMode.INPUT }).result;
    if (!confirmation) return;
    const token = await recaptcha.execute('kick_team');
    const res = await accountManager.kickTeam(props.user, token);
    if (res != TeamOpResult.SUCCESS) modal.showModal({ title: 'Could not kick from team', content: getTeamOpMessage(res), color: 'red' });
    await accountManager.updateOwnUserData();
};
</script>

<template>
    <AnimateInContainer type="slideUp" single>
        <div class="cardContentContainer">
            <div class="cardContent" @click="openUserView()">
                <img :src="data?.profileImage" class="cardProfileImg">
                <span class="cardName">{{ data?.displayName }}</span>
                <Transition>
                    <div class="cardLoadingWrapper" v-if="data == null">
                        <div class="cardLoading">
                            <UILoadingSpinner></UILoadingSpinner>
                        </div>
                    </div>
                </Transition>
            </div>
            <UIButton class="kickButton" text="Kick" color="red" @click="kick()" v-if="$props.allowKick && $props.user !== accountManager.username && $props.user !== $props.team"></UIButton>
        </div>
    </AnimateInContainer>
</template>

<style scoped>
.cardContentContainer {
    background-color: black;
    transition: 200ms ease transform;
    will-change: transform;
}

.cardContent {
    contain: layout;
    display: grid;
    grid-template-rows: 80px 40px;
    padding: 8px 4px;
    border: 4px solid white;
    justify-items: center;
    overflow: hidden;
    cursor: pointer;
}

.cardContentContainer:hover {
    transform: scale(102%);
}

.cardProfileImg {
    width: 72px;
    height: 72px;
    border: 4px solid white;
    border-radius: 50%;
}

.cardName {
    text-align: center;
    word-wrap: break-word;
    text-wrap: balance;
    line-break: anywhere;
    word-break: break-all;
    text-overflow: ellipsis;
    align-content: center;
}

.cardLoadingWrapper {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
}

.cardLoading {
    width: 60px;
    height: 60px;
}

.kickButton {
    position: absolute;
    top: 0px;
    right: 0px;
    margin: 0px 0px;
    opacity: 0;
    transition: 50ms linear opacity;
}

.cardContentContainer:hover>.kickButton {
    opacity: 1;
}

.v-enter-active,
.v-leave-active {
    transition: 500ms;
}

.v-leave-from {
    opacity: 1;
}

.v-leave-to {
    opacity: 0;
}
</style>