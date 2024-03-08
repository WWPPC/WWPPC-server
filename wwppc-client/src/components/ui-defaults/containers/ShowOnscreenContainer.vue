<script setup lang="ts">
import { ref } from 'vue';
</script>
<script lang="ts">
const show = ref(false);
export default {
    mounted() {
        const observer = new IntersectionObserver(([entry]) => {
            show.value = entry.isIntersecting;
        }, { threshold: 0 });
        observer.observe(this.$el);
    }
}
</script>

<template>
    <div>
        <div v-if="show">
            <slot></slot>
        </div>
    </div>
</template>