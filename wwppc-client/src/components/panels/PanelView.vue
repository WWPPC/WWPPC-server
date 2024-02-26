<script setup lang="ts">
import { ref } from 'vue';
const container = ref(null);
</script>

<template>
    <div ref="container">
        <slot></slot>
    </div>
</template>