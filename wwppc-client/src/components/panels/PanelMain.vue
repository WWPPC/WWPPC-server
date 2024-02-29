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
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100vw;
    height: calc(100vh - 100px);
    background-color: black;
}
</style>