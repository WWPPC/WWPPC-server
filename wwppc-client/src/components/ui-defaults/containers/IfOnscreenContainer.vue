<script lang="ts">
export default {
    props: {
        single: Boolean
    },
    data() {
        return { show: true, createdObserver: false }
    },
    mounted() {
        if (this.createdObserver) return;
        this.createdObserver = true;
        if (this.$props.single) {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    this.$el.style.width = 'unset';
                    this.$el.style.height = 'unset';
                    this.$data.show = true;
                    observer.unobserve(this.$el)
                }
            }, { threshold: 0 });
            observer.observe(this.$el);
            const rect = this.$el.getBoundingClientRect();
            this.$el.style.width = rect.width + 'px';
            this.$el.style.height = rect.height + 'px';
        } else {
            const observer = new IntersectionObserver(([entry]) => {
                this.$data.show = entry.isIntersecting;
                if (this.$data.show) {
                    this.$el.style.width = 'unset';
                    this.$el.style.height = 'unset';
                } else {
                    const rect = this.$el.getBoundingClientRect();
                    this.$el.style.width = rect.height + 'px';
                    this.$el.style.height = rect.height + 'px';
                }
            }, { threshold: 0 });
            observer.observe(this.$el);
        }
    },
}
</script>

<template>
    <div>
        <div v-if=$data.show>
            <slot></slot>
        </div>
    </div>
</template>