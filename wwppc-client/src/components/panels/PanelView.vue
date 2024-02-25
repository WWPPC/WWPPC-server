<script setup lang="ts">
import { test } from '@/components/panels/PanelManager';
import { ref } from 'vue';
const container = ref(null);
test();
</script>

<template>
    <div ref="container">
        <slot></slot>
    </div>
</template>