<script setup lang="ts">
// sacrilege
defineProps<{
    type: AnimateInType
    showOnScreen?: boolean
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
        if (this.$props.showOnScreen) {
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
        } else {
            setTimeout(() => {
                this.$el.classList.remove(`invisible`);
                this.$el.classList.add(`${this.$props.type}OnLoad`);
            }, this.$props.delay ?? 0);
        }
    }
}
</script>

<template>
    <div class="invisible">
        <slot></slot>
    </div>
</template>

<style scoped>
.fadeOnLoad {
    animation: 500ms cubic-bezier(0, 0, 0.5, 1) fade-in-on-load;
    animation-fill-mode: forwards;
}

@keyframes fade-in-on-load {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.slideUpOnLoad {
    animation: 500ms cubic-bezier(0, 0, 0.5, 1) slide-up-on-load;
}

@keyframes slide-up-on-load {
    from {
        opacity: 0;
        transform: translateY(32px);
    }

    to {
        opacity: 1;
        transform: initial;
    }
}
</style>