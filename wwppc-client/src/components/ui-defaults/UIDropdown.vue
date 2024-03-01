<script setup lang="ts">
import { ref } from 'vue';

interface DropdownItem {
    text: string
    value: string
}
const props = defineProps<{
    title?: string
    items: DropdownItem[]
    groupedItems?: { label: string, items: DropdownItem[] }[]
    multiSelect?: boolean
    width?: string
    height?: string
    required?: boolean
    default?: string
}>();
const selected = ref('');
const emit = defineEmits<{
    (e: 'input', value: string): void
}>();
function input() {
    emit('input', selected.value);
}
defineExpose({
    selected
});
</script>

<template>
    <select class="uiDropdown" @change=input v-model=selected :title=props.title :multiple=props.multiSelect :required=props.required>
        <option v-for="item in props.items" :key=item.value :value=item.value :selected="item.value == props.default">
            {{ item.text }}
        </option>
        <optgroup v-for="itemGroup in props.groupedItems" :key=itemGroup.label :label=itemGroup.label>
            <option v-for="item in itemGroup.items" :key=item.text :label=item.text :selected="item.text == props.default">
                {{ item.value }}
            </option>
        </optgroup>
    </select>
</template>

<style>
.uiDropdown {
    display: inline-block;
    position: relative;
    bottom: 2px;
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'initial'");
    height: v-bind("$props.height ?? '32px'");
    border: 4px solid white;
    border-radius: 0px;
    color: white;
    background-color: black;
    transition: 50ms linear border-color;
    cursor: pointer;
}

.uiDropdown:hover {
    border-color: lime;
}

.uiDropdown:focus {
    border-color: red;
}

.uiDropdown:disabled {
    background-color: #888;
    cursor: not-allowed;
}
</style>