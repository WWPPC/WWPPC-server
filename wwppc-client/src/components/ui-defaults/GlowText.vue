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
.glowText {
  font-family: 'Source Code Pro', Courier, monospace;
  text-shadow: 0 0 20px v-bind("$props.color");
  font-size: v-bind("$props.fontSize");
  color: v-bind("$props.color")
}
</style>