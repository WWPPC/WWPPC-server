<script setup lang="ts">

interface DropdownItem {
    text: string
    value: string
}
const props = defineProps<{
    title?: string
    items: DropdownItem[]
    groupedItems?: { label: string, items: DropdownItem[] }[]
    width?: string
    height?: string
    default?: string
}>();
const selected = defineModel<string | string[]>({ default: '' });
const emit = defineEmits<{
    (e: 'input', value: string | string[]): void
}>();
function input() {
    emit('input', selected.value);
}
defineExpose({
    value: selected,
    items: props.items,
    groupedItems: props.groupedItems
});
</script>

<template>
    <select class="uiDropdown" @change=input v-model=selected :title=props.title>
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
    padding: 0px 4px;
    border: 4px solid white;
    border-radius: 0px;
    color: white;
    background-color: black;
    font-family: 'Source Code Pro', Courier, monospace;
    transition: 50ms linear border-color;
    cursor: pointer;
}

.uiDropdown option {
    padding: 0px 4px;
    background-color: black;
    cursor: pointer;
}

.uiDropdown option:nth-child(odd) {
    background-color: #151515;
}

.uiDropdown option:checked {
    color: lime;
}

.uiDropdown optgroup {
    padding: 0px 4px;
    background-color: #222;
    font-weight: bold;
}

.uiDropdown[multiple] {
    padding: 0px 0px;
    cursor: default;
}

.uiDropdown:hover {
    border-color: lime;
}

.uiDropdown:focus {
    border-color: red;
}

.uiDropdown:disabled {
    border-color: gray !important;
    cursor: not-allowed;
}
</style>