<script setup lang="ts">
import { UIButton } from "@/components/ui-defaults/UIDefaults";
import { useAccountManager } from "@/scripts/AccountManager";
import { useServerConnection } from "@/scripts/ServerConnection";
import { ref, watch } from "vue";

const serverConnection = useServerConnection();
const accountManager = useAccountManager();

//not rickroll
const numTimesChanged = ref(0);

watch(numTimesChanged, () => {
    if (numTimesChanged.value > 100) {
        location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    }
});
</script>

<template>
    <div>
        <UIButton text="asdf" @click="numTimesChanged++"></UIButton>
    </div>
</template>

<style scoped></style>