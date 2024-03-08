<script setup lang="ts">
// sacrilege
defineProps<{
    type: AnimateInType
    delay?: number
    single?: boolean
}>();
</script>
<script lang="ts">
export type AnimateInType = 'fade' | 'slideUp';
export default {
    data() {
        return { createdObserver: false }
    },
    mounted() {
        if (this.createdObserver) return;
        this.createdObserver = true;
        if (this.$props.single) {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        this.$el.classList.remove('invisible');
                        this.$el.classList.add(`${this.$props.type}OnLoad`);
                    }, this.$props.delay ?? 0);
                    observer.unobserve(this.$el);
                }
            }, { threshold: 0.2 });
            observer.observe(this.$el);
        } else {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        this.$el.classList.remove('invisible');
                        this.$el.classList.add(`${this.$props.type}OnLoad`);
                    }, this.$props.delay ?? 0);
                }
            }, { threshold: 0.2 });
            observer.observe(this.$el);
            const observer2 = new IntersectionObserver(([entry]) => {
                if (!entry.isIntersecting) {
                    this.$el.classList.remove(`${this.$props.type}OnLoad`);
                    this.$el.classList.add('invisible');
                }
            }, { threshold: 0 });
            observer2.observe(this.$el);
        }
        this.$el.classList.add('invisible');
    }
}
</script>

<template>
    <div>
        <slot></slot>
    </div>
</template>