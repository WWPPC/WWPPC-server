<script setup lang="ts">
defineProps<{
    offsetTop?: string
    offsetLeft?: string
    width?: string
    height?: string
    threshold?: number
}>();

defineEmits<{
    (e: 'visible'): any
    (e: 'invisible'): any
    (e: 'change', visiblity: boolean): any
}>();
</script>
<script lang="ts">

export default {
    data() {
        return { createdObserver: false }
    },
    mounted() {
        if (this.createdObserver) return;
        this.createdObserver = true;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) this.$emit('visible');
            else this.$emit('invisible');
            this.$emit('change', entry.isIntersecting);
        }, { threshold: this.$props.threshold ?? 0 });
        observer.observe(this.$el);
    }
}
</script>

<template>
    <div class="onScreenHook"></div>
</template>

<style scoped>
.onScreenHook {
    position: relative;
    top: v-bind("$props.offsetTop ?? ''");
    left: v-bind("$props.offsetLeft ?? ''");
    width: v-bind("$props.width ?? '0px'");
    height: v-bind("$props.height ?? '0px'");
    pointer-events: none;
}
</style>