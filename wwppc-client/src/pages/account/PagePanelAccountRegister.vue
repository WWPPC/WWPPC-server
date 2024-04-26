<script setup lang="ts">
import { UIButton } from "@/components/ui-defaults/UIDefaults";
import { useAccountManager } from "@/scripts/AccountManager";
import { useServerConnection } from "@/scripts/ServerConnection";

const serverConnection = useServerConnection();
const accountManager = useAccountManager();
</script>

<template>
    <div>
        <UIButton text="asdf" onclick=""></UIButton>
    </div>
</template>

<style scoped></style>