<script lang="ts">
export default {
    props: {
        single: Boolean
    },
    data() {
        return { show: false, createdObserver: false }
    },
    mounted() {
        if (this.createdObserver) return;
        this.createdObserver = true;
        if (this.$props.single) {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    this.$data.show = true;
                    observer.unobserve(this.$el)
                }
            }, { threshold: 0 });
            observer.observe(this.$el);
        } else {
            const observer = new IntersectionObserver(([entry]) => {
                this.$data.show = entry.isIntersecting;
            }, { threshold: 0 });
            observer.observe(this.$el);
        }
    }
}
</script>

<template>
    <div>
        <div v-if=$data.show>
            <slot></slot>
        </div>
    </div>
</template>