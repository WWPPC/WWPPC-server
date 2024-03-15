<script setup lang="ts">
const props = defineProps<{
    defaultValue?: string
    highlightInvalid?: boolean
    title?: string
    width?: string
    height?: string
    font?: string
    type?: 'text' | 'password' | 'email'
    placeholder?: string
    autocomplete?: 'username' | 'current-password' | 'new-password' | 'email' | 'name' | 'honorific-prefix' | 'given-name' | 'additional-name' | 'family-name' | 'honorific-suffix' | 'nickname' | 'off'
}>();
const emit = defineEmits<{
    (e: 'input', value: string): void
}>();
const text = defineModel({ default: '' });
text.value = props.defaultValue ?? '';
function input() {
    emit('input', text.value);
}
defineExpose({
    value: text
});
</script>

<template>
    <input :type="props.type ?? 'text'" class="uiTextBox" @input=input v-model=text :title=props.title :placeholder=props.placeholder :autocomplete="props.autocomplete ?? 'off'">
</template>

<style>
.uiTextBox {
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'unset'");
    height: v-bind("$props.height ?? '32px'");
    margin: 0px 4px;
    padding: 0px 4px;
    border: 4px solid white;
    border-radius: 0px;
    background-color: black;
    color: white;
    font: v-bind("$props.font ?? '14px inherit'");
    font-family: 'Source Code Pro', Courier, monospace;
    transition: 50ms linear border-color;
}

.uiTextBox:hover {
    border-color: lime;
}

.uiTextBox:focus {
    border-color: red;
}

.uiTextBox:invalid {
    border-color: v-bind("$props.highlightInvalid ? 'yellow' : ''");
}

.uiTextBox:disabled {
    border-color: #888 !important;
    cursor: not-allowed;
}
</style>