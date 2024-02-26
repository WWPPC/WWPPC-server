<!-- no syntax sugar -->
<script lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const panels: HTMLElement[] = [];
export default {
    props: {
        default: { type: String, required: true },
        page: { type: String, required: true }
    },
    setup(props, { expose }) {
        const route = useRoute();
        const selectPanel = (newPanel: string | string[]) => {
            const searchClass = 'panelName' + (typeof newPanel == 'string' ? newPanel.toUpperCase() : (newPanel?.at(0) ?? props.default).toUpperCase());
            panels.forEach(p => {
                if (p.classList.contains(searchClass)) p.classList.remove('hidden');
                else p.classList.add('hidden');
            });
        };
        watch(() => route.params.panel, selectPanel);
        expose({ selectPanel });
        return { selectPanel };
    },
    mounted() {
        panels.push(...this.$el.querySelectorAll('.panelBody'));
        if (this.$route.params.panel != undefined) this.selectPanel(this.$route.params.panel);
        else if (this.$route.params.page == this.$props.page) this.$router.push(`${this.$route.params.page ?? 'home'}/${this.$props.default}`);
    },
    unmounted() {
        panels.length = 0;
    }
}
</script>

<template>
    <main class="panelViewBody">
        <slot></slot>
    </main>
</template>

<style>
.panelViewBody {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100vw;
    height: calc(100vh - 100px);
}
</style>