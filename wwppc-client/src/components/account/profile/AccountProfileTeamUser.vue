<script setup lang="ts">
import { AnimateInContainer } from '@/components/ui-defaults/UIContainers';
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
</style>