<script setup lang="ts">
import { AnimateInContainer } from '@/components/ui-defaults/UIContainers';
import { isMobileRef } from '@/scripts/userAgent';

defineProps<{
    anchor: string
}>();
</script>
<script lang="ts">
export default {
    methods: {
        scroll() {
            document.querySelector(this.$props.anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
</script>

<template>
    <div :class="'centered ' + (isMobileRef ? 'invisible' : '')">
        <AnimateInContainer type="fade" :delay=1000 show-on-screen>
            <div class="scrollIndicator" @click=scroll></div>
        </AnimateInContainer>
    </div>
</template>

<style scoped>
.scrollIndicator {
    position: relative;
    width: 32px;
    height: 32px;
    padding: 16px 16px;
    cursor: v-bind("$props.anchor != undefined ? 'pointer' : ''");
    animation: 3000ms cubic-bezier(0.5, 0, 0.5, 1) scrollIndicatorBob infinite;
}

.scrollIndicator::before,
.scrollIndicator::after {
    content: '';
    position: absolute;
    top: 16px;
    left: 16px;
    width: 21.9px;
    height: 4px;
    background-color: white;
    box-shadow: 0px 0px 4px white;
}

.scrollIndicator::before {
    transform: translate(-2px, 14px) rotate(45deg);
}

.scrollIndicator::after {
    transform: translate(11px, 14px) rotate(-45deg);
}

@media (max-width: 100vh) {
    .scrollIndicator {
        display: none;
    }
}

@keyframes scrollIndicatorBob {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-8px);
    }
}
</style>