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
        return { show: false, createdObserver: false }
    },
    mounted() {
        this.$el.classList.add(`${this.$props.type}OnLoad`);
        if (this.$props.showOnScreen) {
            if (this.createdObserver) return;
            this.createdObserver = true;
            if (this.$props.single) {
                const observer = new IntersectionObserver(([entry]) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            this.$el.classList.remove('invisible');
                            this.show = true;
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
                            this.show = true;
                        }, this.$props.delay ?? 0);
                    }
                }, { threshold: 0.2 });
                observer.observe(this.$el);
                const observer2 = new IntersectionObserver(([entry]) => {
                    if (!entry.isIntersecting) {
                        this.$el.classList.add('invisible');
                        this.show = false;
                    }
                }, { threshold: 0 });
                observer2.observe(this.$el);
            }
        } else {
            setTimeout(() => {
                this.$el.classList.remove('invisible');
                this.show = true;
            }, this.$props.delay ?? 0);
        }
    }
}
</script>

<template>
    <div class="invisible">
        <Transition>
            <div v-show=show>
                <slot></slot>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: 500ms cubic-bezier(0, 0, 0.5, 1) opacity, 500ms cubic-bezier(0, 0, 0.5, 1) transform;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.v-enter-to,
.v-leave-from {
    opacity: 1;
}

.v-enter-from.slideUpOnLoad,
.v-leave-to.slideUpOnLoad {
    transform: translateY(32px);
}

.v-enter-to.slideUpOnLoad,
.v-leave-from.slideUpOnLoad {
    transform: initial;
}
</style>