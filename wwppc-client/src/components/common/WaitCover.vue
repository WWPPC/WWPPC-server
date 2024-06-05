<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { UILoadingSpinner } from '@/components/ui-defaults/UIDefaults';

defineProps<{
    text: string
    show: boolean
}>();
</script>
<script lang="ts">
const size = ref(0);
export default {
    async mounted() {
        const resize = async () => {
            await nextTick();
            if (this.$el?.getBoundingClientRect == undefined) return;
            const rect = this.$el.getBoundingClientRect();
            size.value = Math.min(rect.width * 0.25, rect.height * 0.25);
        }
        window.addEventListener('resize', resize);
        resize();
    },
    async beforeUpdate() {
        await nextTick();
        if (this.$el?.getBoundingClientRect == undefined) return;
        const rect = this.$el.getBoundingClientRect();
        size.value = Math.min(rect.width * 0.25, rect.height * 0.25);
    }
}
</script>

<template>
    <Transition name="wait-cover">
        <div class="waitCoverContainer" v-if=$props.show>
            <div class="waitCoverSpinnerWrapper">
                <UILoadingSpinner></UILoadingSpinner>
            </div>
            <div class="waitCoverText">
                {{ $props.text }}
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.waitCoverContainer {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    justify-content: center;
    align-items: center;
}

.waitCoverSpinnerWrapper {
    width: v-bind("size + 'px'");
    height: v-bind("size + 'px'");
    margin-bottom: calc(v-bind("size + 'px'") * 0.25);
}

.waitCoverText {
    font-size: 4vh;
}

.wait-cover-enter-active,
.wait-cover-leave-active {
    transition: 100ms linear opacity;
}

.wait-cover-enter-to,
.wait-cover-leave-from {
    opacity: 1;
}

.wait-cover-enter-from,
.wait-cover-leave-to {
    opacity: 0;
}
</style>