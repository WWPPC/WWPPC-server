<script setup lang="ts">
import { ref } from 'vue';

interface DropdownItem {
    text: string,
    value: string
}
const props = defineProps<{
    title?: string
    items: DropdownItem[],
    groupedItems?: {label: string, items: DropdownItem[]}[],
    multiSelect?: boolean
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
    <select class="uiDropdown" @change=input v-model=selected :title=props.title :multiple=props.multiSelect>
        <option v-for="item in props.items" :key=item.value :value=item.value>
            {{ item.text }}
        </option>
        <optgroup v-for="itemGroup in props.groupedItems" :key=itemGroup.label :label=itemGroup.label>
            <option v-for="item in itemGroup.items" :key=item.text :label=item.text>
                {{ item.value }}
            </option>
        </optgroup>
    </select>
</template>

<style>
</style>