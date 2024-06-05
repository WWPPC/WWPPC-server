<script setup lang="ts">
import { watch, ref, onMounted } from 'vue';

const props = defineProps<{
    width?: string
    height?: string
    borderColor?: string
    align?: 'left' | 'center' | 'right'
    content: TableContent | TableContentGenerated
    headerColor?: string
    headerBackground?: string
}>();

const data = ref<TableGeneratedData[][]>([]);
const updateContent = () => {
    data.value = [];
    if ('generator' in props.content) {
        for (let row = 0; row < props.content.data.length; row++) {
            const drow: TableGeneratedData[] = [];
            for (let col = 0; col < props.content.data[row].length; col++) {
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
    <div class="headeredTableContainer">
        <div class="headeredTableHeader">
            <div class="headeredTableHeaderItem" v-for="header in props.content.headers" :key="header">
                {{ header }}
            </div>
        </div>
        <div class="headeredTableRow" v-for="row in data" :key="row[0].text">
            <div class="headeredTableData" v-for="cell in row" :key="cell.text" :style="`font: ${cell.font ?? ''}; color: ${cell.color ?? ''}; background-color: ${cell.backgroundColor ?? ''}; ${cell.style}`">
                {{ cell.text }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.headeredTableContainer {
    display: table;
    box-sizing: border-box;
    width: v-bind("props.width ?? 'initial'");
    height: v-bind("props.height ?? 'initial'");
    border: 2px solid;
    border-color: v-bind("props.borderColor ?? ' white'");
    background-color: black;
    text-align: left;
}

.headeredTableHeader {
    display: table-header-group;
    color: v-bind("props.headerColor ?? 'white'");
    background-color: v-bind("props.headerBackground ?? '#222'");
    text-align: v-bind("$props.align ?? 'left'");
}

.headeredTableHeaderItem, .headeredTableData {
    display: table-cell;
    padding: 4px 8px;
    border: 2px solid;
    border-color: v-bind("props.borderColor ?? ' white'");
    text-align: center;
}

.headeredTableRow {
    display: table-row;
}
</style>