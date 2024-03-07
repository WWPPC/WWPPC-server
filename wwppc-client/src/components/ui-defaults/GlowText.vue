<script setup lang="ts">
import { onMounted, ref } from 'vue';
const props = defineProps<{
  text?: string
  steps?: number
  delay?: number
  fontSize: string
  color?: string
}>();

</script>

<template>
  <div class="centered glowText">
    <slot></slot>
  </div>
</template>

<style>

</style>