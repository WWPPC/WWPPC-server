<script setup lang="ts">
defineProps<{
    profileUrl: string
    user?: string
    icon: string
    color: string
}>();
</script>

<template>
    <a class="homeAboutCreditsCardIconLink" :href="$props.profileUrl + $props.user" target="_blank" v-if="$props.user != undefined">
        <div class="homeAboutCreditsCardIconImage"></div>
    </a>
</template>

<style scoped>
.homeAboutCreditsCardIconLink {
    text-decoration: none;
}

.homeAboutCreditsCardIconImage {
    width: 30px;
    height: 30px;
    padding: 0px 8px;
    mask-size: 30px;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-image: v-bind("`url('${$props.icon}')`");
    background-color: white;
    transition: 50ms linear background-color;
}

.homeAboutCreditsCardIconImage:hover {
    background-color: v-bind("$props.color");
}
</style>