<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    title?: string
}>();
const selected = ref('');
const emit = defineEmits<{
    (e: 'input', value: string): void
}>();
function input() {
    emit('input', selected.value);
}
</script>

<template>
    <select @input=input v-model=selected :title=title>

    </select>
</template>

<style scoped>
</style>