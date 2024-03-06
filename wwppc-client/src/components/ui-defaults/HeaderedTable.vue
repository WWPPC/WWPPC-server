<script setup lang="ts">
import { watch, ref, onMounted } from 'vue';

const props = defineProps<{
    width?: string
    height?: string
    borderColor?: string
    content: TableContent | TableContentGenerated
    headerColor?: string
    headerBackground?: string
}>();

const data = ref<TableGeneratedData[][]>([]);
const updateContent = () => {
    data.value = [];
    if ('generator' in props.content) {
        for (const row in props.content.data) {
            const drow: TableGeneratedData[] = [];
            for (const col in props.content.data[row]) {
                drow.push(props.content.generator(row, props.content.headers[col], props.content.data[row][col]));
            }
            data.value.push(drow);
        }
    } else {
        for (const row of props.content.data) {
            const drow: TableGeneratedData[] = [];
            for (const cell of row) {
                drow.push({ text: cell });
            }
            data.value.push(drow);
        }
    }
};
watch(() => props.content, () => updateContent());
onMounted(() => updateContent());
</script>

<script lang="ts">
export interface TableContent {
    headers: string[],
    data: string[][]
}
export interface TableContentGenerated {
    headers: string[],
    data: any[][],
    generator: (row: number, column: string, dat: any) => TableGeneratedData
}
export interface TableGeneratedData {
    text: string
    color?: string
    backgroundColor?: string
    font?: string
    style?: string
}
</script>

<template>
    <div class="titledTableContainer">
        <div class="titledTableHeader">
            <div class="titledTableHeaderItem" v-for="header in props.content.headers" :key="header">
                {{ header }}
            </div>
        </div>
        <div class="titledTableRow" v-for="row in data" :key="row[0]">
            <div class="titledTableData" v-for="cell in row" :key="cell.text" :style="`font: ${cell.font ?? ''}; color: ${cell.color ?? ''}; background-color: ${cell.backgroundColor ?? ''}; ${cell.style}`">
                {{ cell.text }}
            </div>
        </div>
    </div>
</template>

<style>
.titledTableContainer {
    display: table;
    box-sizing: border-box;
    width: v-bind("props.width ?? 'initial'");
    height: v-bind("props.height ?? 'initial'");
    border: 2px solid;
    border-color: v-bind("props.borderColor ?? 'white'");
    background-color: black;
    text-align: left;
}

.titledTableHeader {
    display: table-header-group;
    color: v-bind("props.headerColor ?? '#111'");
    background-color: v-bind("props.headerBackground ?? '#111'");
}

.titledTableHeaderItem {
    display: table-cell;
    border: 2px solid;
    border-color: v-bind("props.borderColor ?? 'white'");
    padding: 4px 8px;
    font-weight: bold;
}

.titledTableRow {
    display: table-row;
}

.titledTableData {
    display: table-cell;
    border: 2px solid;
    border-color: v-bind("props.borderColor ?? 'white'");
    padding: 4px 8px;
}
</style>