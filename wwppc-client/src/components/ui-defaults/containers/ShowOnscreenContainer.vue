<script lang="ts">
import { isMobile } from '@/scripts/userAgent';

export default {
    props: {
        single: Boolean
    },
    data() {
        return { createdObserver: false };
    },
    mounted() {
        if (this.createdObserver) return;
        this.createdObserver = true;
        if (isMobile) {
            this.$el.classList.remove('invisible');
            return;
        }
        if (this.$props.single) {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    this.$el.style.width = 'unset';
                    this.$el.style.height = 'unset';
                    this.$el.classList.remove('invisible');
                    observer.unobserve(this.$el);
                }
            }, { threshold: 0 });
            observer.observe(this.$el);
            const rect = this.$el.getBoundingClientRect();
            this.$el.style.width = rect.width + 'px';
            this.$el.style.height = rect.height + 'px';
        } else {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    this.$el.style.width = 'unset';
                    this.$el.style.height = 'unset';
                    this.$el.classList.remove('invisible');
                } else {
                    const rect = this.$el.getBoundingClientRect();
                    this.$el.style.width = rect.height + 'px';
                    this.$el.style.height = rect.height + 'px';
                    this.$el.classList.add('invisible');
                }
            }, { threshold: 0 });
            observer.observe(this.$el);
        }
    },
}
</script>

<template>
    <div class="invisible">
        <slot></slot>
    </div>
</template>

<style scoped>
div {
    will-change: visibility;
}
</style>