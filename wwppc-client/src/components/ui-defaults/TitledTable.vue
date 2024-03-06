<script setup lang="ts">
import { BaseContainer } from '@/components/ui-defaults/UIContainers';
import { watch, ref, onMounted } from 'vue';

const props = defineProps<{
    width?: string
    height?: string
    borderStyle?: string
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
    <BaseContainer class="titledTableContainer" :width="props.width ?? null" :height="props.height ?? null" :borderStyle="props.borderStyle ?? null">
        <div class="titledTableHeader">
            <BaseContainer class="titledTableHeaderItem" v-for="header in props.content.headers" :key="header"  :borderStyle="props.borderStyle ?? null">
                {{ header }}
            </BaseContainer>
        </div>
        <div class="titledTableRow" v-for="row in data" :key="row[0]">
            <BaseContainer class="titledTableData" v-for="cell in row" :key="cell.text" :style="`font: ${cell.font ?? ''}; color: ${cell.color ?? ''}; background-color: ${cell.backgroundColor ?? ''}; ${cell.style}`" :borderStyle="props.borderStyle ?? null">
                {{ cell.text }}
            </BaseContainer>
        </div>
    </BaseContainer>
</template>

<style>
.titledTableContainer {
    display: table;
    box-sizing: border-box;
    background-color: black;
    text-align: left;
}

.titledTableHeader {
    display: table-header-group;
    color: v-bind("props.headerColor ?? 'white'");
    background-color: v-bind("props.headerBackground ?? '#111'");
}

.titledTableHeaderItem, .titledTableData {
    display: table-cell;
    padding: 4px 8px;
    text-align: center;
}

.titledTableRow {
    display: table-row;
}
</style>