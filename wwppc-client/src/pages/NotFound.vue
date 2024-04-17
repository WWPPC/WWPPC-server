<script setup lang="ts">
import { UIButton } from '@/components/ui-defaults/UIDefaults';
import { useRouter } from 'vue-router';

const router = useRouter();

const magicalFix = () => {
    if (Math.random() < 0.01) window.location.replace('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    else router.push('/home');
};
</script>

<template>
    <div class="notFound">
        <span style="color: red; font-size: var(--font-32);">BUG: 404 Not Found</span>
        <br>
        &lt;span style="color: red;"&gt;IS BORKEN!!!&lt;/span&gt;
        <br>
        <br>
        <span>
            <UIButton text="Magical Fix Button" color="lime" width="200px" @click="magicalFix"></UIButton>
        </span>
    </div>
</template>

<style>
.notFound {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: black;
    justify-content: center;
    text-align: center;
    overflow: hidden;
}
</style>