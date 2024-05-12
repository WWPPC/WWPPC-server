<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    title?: string
}>();
const fileInput = ref<HTMLInputElement>();
const files = ref<FileList>();
const resetFileList = () => {
    if (fileInput.value !== undefined) fileInput.value.value = '';
}
const emit = defineEmits<{
    (e: 'input', value: FileList | undefined): any
}>();
function input(event: any) {
    files.value = event.target?.files;
    emit('input', files.value);
}
defineExpose({
    files,
    resetFileList
});
</script>

<template>
    <input ref="fileInput" type="file" class="uiFileUpload" @change=input>
</template>

<style scoped>
.uiFileUpload {
    box-sizing: border-box;
    height: 32px;
    padding: 4px 0px;
    font-family: 'Source Code Pro', Courier, monospace;
    font-size: 12px;
}

.uiFileUpload::file-selector-button {
    appearance: none;
    background-color: black;
    border: 4px solid white;
    color: white;
    font-family: 'Source Code Pro', Courier, monospace;
    font-size: 12px;
    transition: 50ms ease transform, 50ms ease border-color;
    cursor: pointer;
}

.uiFileUpload::file-selector-button:hover {
    transform: translateY(-2px);
    border-color: lime;
}

.uiFileUpload::file-selector-button:active {
    transform: translateY(2px);
    border-color: red;
}
</style>