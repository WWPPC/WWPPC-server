<script setup lang="ts">
import { TitledCutCornerContainer } from '@/components/ui-defaults/UIContainers';
import { globalModal, UIFileUpload, UINumberBox } from '@/components/ui-defaults/UIDefaults';
import { ref, watch } from 'vue';

const modal = globalModal();

const scale = ref(1);
const width = ref(0);
const height = ref(0);
const original = ref('');
const converted = ref('');

const draw = () => {
    if (original.value == '') return;
    const img = new Image();
    img.src = original.value;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        width.value = img.width;
        height.value = img.height;
        canvas.width = img.width * scale.value;
        canvas.height = img.height * scale.value;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, img.width * scale.value, img.height * scale.value);
        converted.value = canvas.toDataURL('image/png');
    };
};

const upload = (event: any) => {
    const file: File | undefined = event.target?.files?.item(0);
    if (file == undefined) return;
    const reader = new FileReader();
    reader.onload = () => {
        if (typeof reader.result != 'string') return; // idk should never happen
        if (/^data:image\/svg\+xml/.test(reader.result)) {
            original.value = reader.result;
            draw();
        } else {
            modal.showModal({ title: 'Unsupported file type', content: 'Only .svg images are allowed.', color: 'red' });
        }
    };
    reader.readAsDataURL(file);
};

watch(scale, draw);
</script>

<template>
    <div class="columns">
        <TitledCutCornerContainer title="SVG" reversed>
            <img :src="original" class="uploadImg">
            <br>
            <UIFileUpload accept="image/svg+xml" @change=upload></UIFileUpload>
            <br>
            <label>
                Scale:
                <UINumberBox v-model="scale" :default-value="1" :step="0.1"></UINumberBox>
            </label>
            <br>
            <span>{{ width }}px x {{ height }}px</span>
        </TitledCutCornerContainer>
        <TitledCutCornerContainer title="PNG">
            <img :src="converted" class="uploadImg">
            <br>
            <span>{{ width * scale }}px x {{ height * scale }}px</span>
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

.uploadImg {
    box-sizing: border-box;
    max-width: 100%;
    max-height: calc(100% - 32px);
    border: 4px solid white;
}

.big {
    box-sizing: border-box;
    width: 100%;
    height: 20em;
    margin: 0px 0px;
}
</style>