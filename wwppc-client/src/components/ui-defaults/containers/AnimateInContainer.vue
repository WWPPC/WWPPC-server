<script setup lang="ts">
// sacrilege
defineProps<{
    type: AnimateInType
    delay?: number
}>();
</script>
<script lang="ts">
export type AnimateInType = 'fade' | 'slideUp';
export default {
    mounted() {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                this.$el.classList.remove(`${this.$props.type}OnLoad`);
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
        this.$el.classList.add('invisible');
    }
}
</script>

<template>
    <div>
        <slot></slot>
    </div>
</template>