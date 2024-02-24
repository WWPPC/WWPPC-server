<script setup lang="ts">
import { UIButton, UITextBox, FullscreenModal, showModal } from '@/components/ui/UIDefaults';
</script>

<template>
    hi
    <UIButton text="test" @click="showModal({ title: 'omg', content: '<div>its working1111</div>', glitchTitle: true })" width="240px"></UIButton>
    <FullscreenModal></FullscreenModal>
    <UITextBox id="buh" @input="(str: string) => console.log(str)"></UITextBox>
    <UIButton text="test" @click="console.log('eee')"></UIButton>
</template>