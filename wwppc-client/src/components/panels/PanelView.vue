<script setup lang="ts">
import { useRoute } from 'vue-router';
import { setTitlePage } from '@/scripts/title';
import { watch, nextTick, getCurrentInstance } from 'vue';

const props = defineProps<{
    name: string
    title?: string
    isDefault?: boolean
}>();

const route = useRoute();

const instance = getCurrentInstance();
watch(() => route.params, async () => {
    await nextTick();
    if (instance?.isMounted && (route.params.page == props.name || (route.params.page == undefined && props.isDefault && route.params.catchAll === undefined))) setTitlePage(props.title ?? '');
});
if ((route.params.page === undefined && props.isDefault && route.params.catchAll === undefined) || route.params.page == props.name) setTitlePage(props.title ?? '');
</script>

<template>
    <Transition>
        <div class="panelView" v-if="route.params.page == props.name || (route.params.page == undefined && props.isDefault && route.params.catchAll === undefined)">
            <slot></slot>
        </div>
    </Transition>
</template>

<style>
@keyframes panel-wipe {
    0% {
        transform: none;
    }

    50% {
        transform: translateY(100%);
    }

    100% {
        transform: translateY(200%);
    }
}

@keyframes panel-transition-in {
    0% {
        visibility: hidden;
    }

    50% {
        visibility: hidden;
    }

    100% {
        visibility: visible;
    }
}

@keyframes panel-transition-out {
    0% {
        visibility: visible;
    }

    50% {
        visibility: hidden;
    }

    100% {
        visibility: hidden;
    }
}
</style>

<style scoped>
.panelView {
    display: grid;
    grid-template-rows: 100px minmax(0, 1fr);
    grid-template-columns: minmax(0, 1fr);
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
}

.v-enter-active {
    animation: panel-transition-in 500ms linear;
}

.v-leave-active {
    animation: panel-transition-out 500ms linear;
}

@media (prefers-reduced-motion) {

    .v-enter-active,
    .v-leave-active {
        animation-duration: 0ms;
    }
}
</style>