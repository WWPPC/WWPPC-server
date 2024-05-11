<script setup lang="ts">
import { AnimateInContainer } from '@/components/ui-defaults/UIContainers';
import { UILoadingSpinner } from '@/components/ui-defaults/UIDefaults';
import { type AccountData, useAccountManager } from '@/scripts/AccountManager';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
    user: string
}>();

const accountManager = useAccountManager();

const data = ref<AccountData | null>(null);

watch(() => props.user, async () => {
    data.value = await accountManager.getUserData(props.user);
});
onMounted(async () => {
    data.value = await accountManager.getUserData(props.user);
});
</script>

<template>
    <AnimateInContainer type="slideUp" single>
        <div class="cardContent">
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
    </AnimateInContainer>
</template>

<style scoped>
.cardContent {
    display: grid;
    grid-template-rows: 80px 40px;
    padding: 8px 4px;
    border: 4px solid white;
    background-color: black;
    justify-items: center;
    overflow: hidden;
    transition: 200ms ease transform;
    will-change: transform;
}

.cardContent:hover {
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