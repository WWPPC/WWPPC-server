<script setup lang="ts">
import NotFound from '@/pages/NotFound.vue';
</script>
<script lang="ts">
import { nextTick, ref, watch } from 'vue';

const disp404 = ref(false);

export default {
    data() {
        return { disp404 };
    },
    mounted() {
        watch(() => this.$el.children, () => {
            disp404.value = this.$el.children.length == 0;
        });
        nextTick().then(() => disp404.value = this.$el.children.length == 0);
    }
}
</script>

<template>
    <main class="panelViewBody">
        <slot></slot>
        <NotFound v-if="$data.disp404"></NotFound>
    </main>
</template>

<style>
.panelViewBody {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr);
    grid-row: 2;
    grid-column: 1;
}
</style>