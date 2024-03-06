<script setup lang="ts">
const props = defineProps<{
    width?: string
    height?: string
    borderColor?: string
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
    <div class="titledTableContainer">
        <div class="titledTableHeader">
            <div class="titledTableHeaderItem" v-for="header in props.content.columns" :key="header">
                {{ header }}
            </div>
        </div>
        <div class="titledTableRow" v-for="(row, rowindex) in props.content.data" :key="row[0]">
            <div class="titledTableData" v-for="(data, colindex) in row" :key="data">
                {{
                (() => {
                    if ('generator' in props.content) {
                        const generated = props.content.generator(rowindex, props.content.columns[colindex], data);
                        
                        return generated.content;
                    } else return data;
                })()
            }}
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
    background-color: v-bind("props.headerColor ?? '#111'");
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