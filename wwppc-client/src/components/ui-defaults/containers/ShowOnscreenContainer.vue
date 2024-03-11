<script lang="ts">
export default {
    props: {
        single: Boolean
    },
    data() {
        return { createdObserver: false }
    },
    mounted() {
        if (this.createdObserver) return;
        this.createdObserver = true;
        if (this.$props.single) {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    this.$el.classList.remove('invisible');
                    observer.unobserve(this.$el)
                }
            }, { threshold: 0 });
            observer.observe(this.$el);
        } else {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) this.$el.classList.remove('invisible');
                else this.$el.classList.add('invisible');
            }, { threshold: 0 });
            observer.observe(this.$el);
        }
    }
}
</script>

<template>
    <div>
        <div class="invisible">
            <slot></slot>
        </div>
    </div>
</template>