<script setup lang="ts">
import { TitledCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import { UITextArea } from '@/components/ui-defaults/UIDefaults';
import { onMounted, ref, watch } from 'vue';
import latexify from '@/scripts/katexify';

const html = ref('');

onMounted(() => {
    if (localStorage.getItem('problemEditorSaved') != null) html.value = localStorage.getItem('problemEditorSaved')!;
});
watch(html, () => {
    localStorage.setItem('problemEditorSaved', html.value);
});
</script>

<template>
    <div class="columns">
        <TitledCutCornerContainer title="LaTeX/HTML" reversed>
            <UITextArea v-model="html" resize="none" class="big"></UITextArea>
        </TitledCutCornerContainer>
        <TitledCutCornerContainer title="Rendered">
            <div v-html="latexify(html)"></div>
        </TitledCutCornerContainer>
    </div>
</template>

<style scoped>
.columns {
    display: grid;
    height: 100%;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
}
.big {
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 4px);
    margin: 0px 0px;
    border: none;
}
</style>