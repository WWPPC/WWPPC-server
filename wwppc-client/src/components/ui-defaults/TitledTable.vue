<script setup lang="ts">
import { BaseContainer } from '@/components/ui-defaults/UIContainers';

const props = defineProps<{
    width?: string
    height?: string
    borderStyle?: string
    content: TableContent | TableContentGenerated
    headerColor?: string
}>();
</script>

<script lang="ts">
export interface TableContent {
    columns: string[],
    data: string[][]
}
export interface TableContentGenerated {
    columns: string[],
    data: any[][],
    generator: (row: number, column: string, dat: any) => TableGeneratedData
}
export interface TableGeneratedData {
    content: string
    backgroundColor?: string
    font?: string
}
</script>

<template>
    <BaseContainer class="titledTableContainer" :width="props.width ?? null" :height="props.height ?? null" :borderStyle="props.borderStyle ?? null">
        <div class="titledTableHeader">
            <BaseContainer class="titledTableHeaderItem" v-for="header in props.content.columns" :key="header"  :borderStyle="props.borderStyle ?? null">
                {{ header }}
            </BaseContainer>
        </div>
        <div class="titledTableRow" v-for="(row, rowindex) in props.content.data" :key="row[0]">
            <BaseContainer class="titledTableData" v-for="(data, colindex) in row" :key="data" :borderStyle="props.borderStyle ?? null">
                {{
                (() => {
                    if ('generator' in props.content) {
                        const generated = props.content.generator(rowindex, props.content.columns[colindex], data);
                        
                        return generated.content;
                    } else return data;
                })()
            }}
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
    background-color: v-bind("props.headerColor ?? '#111'");
    font-weight: bold;
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