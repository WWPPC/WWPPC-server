<script setup lang="ts">
defineProps<{
    type: 'fade' | 'slideUp'
    width?: string
    height?: string
    showOnScreen?: boolean
    delay?: number
    single?: boolean
}>();
</script>
<script lang="ts">
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
                            this.$el.classList.remove('animHidden');
                            this.$el.classList.add('animShow');
                        }, this.$props.delay ?? 0);
                        observer.unobserve(this.$el);
                    }
                }, { threshold: 0 });
                observer.observe(this.$el);
            } else {
                const observer = new IntersectionObserver(([entry]) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            this.$el.classList.remove('animHidden');
                            this.$el.classList.add('animShow');
                        }, this.$props.delay ?? 0);
                    } else {
                        this.$el.classList.remove('animShow');
                        this.$el.classList.add('animHidden');
                    }
                }, { threshold: 0 });
                observer.observe(this.$el);
            }
        } else {
            setTimeout(() => {
                this.$el.classList.remove('animHidden');
                this.$el.classList.add('animShow');
            }, this.$props.delay ?? 0);
        }
    }
}
</script>

<template>
    <div :class="'animateInContainer animHidden anim-' + $props.type">
        <slot></slot>
    </div>
</template>

<style scoped>
.animateInContainer {
    width: v-bind("$props.width ?? 'initial'");
    height: v-bind("$props.height ?? 'initial'");
    will-change: transform, opacity;
}
.animHidden.anim-fade {
    opacity: 0;
}

.animShow.anim-fade {
    transition: 500ms cubic-bezier(0, 0, 0.5, 1) opacity;
    opacity: 1;
}

.animHidden.anim-slideUp {
    opacity: 0;
    transform: translateY(32px);
}

.animShow.anim-slideUp {
    transition: 500ms cubic-bezier(0, 0, 0.5, 1) opacity, 500ms cubic-bezier(0, 0, 0.5, 1) transform;
    opacity: 1;
    transform: translateY(0);
}
</style>