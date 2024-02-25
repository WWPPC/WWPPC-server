<script lang="ts">
import { ref } from 'vue';

export default {
    setup() {
        const loadingCover = ref(null);
        return { loadingCover };
    },
    mounted() {
        document.onreadystatechange = () => {
            if (document.readyState == "complete") {
                console.log(this.$refs)
                if (this.$refs.loadingCover) this.$refs.loadingCover.value.style.opacity = 0;
                this.$el.parentNode.removeChild(this.$el);
            }
        }
    }
}
</script>

<template>
    <div class="loadingCover">
        <div class="loadingCoverBar"></div>
        <noscript class="noscript">JavaScript was disabled!<br>Please enable it and <a href="" style="color: white">reload</a>!</noscript>
        <div class="loadingErrorsContainer">
            <div class="loadingErrors"></div>
        </div>
    </div>
</template>

<style>
.loadingCover {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    text-align: center;
    background-color: black;
    transition: 200ms linear opacity;
    z-index: 1000;
    cursor: wait;
}

.loadingCoverBar {
    position: fixed;
    top: calc(50vh - 0.5vw);
    left: 35vw;
    width: 30vw;
    height: 1vw;
    background: linear-gradient(red 0 0), linear-gradient(lime 0 0), white;
    background-size: 60% 100%;
    background-repeat: no-repeat;
    box-shadow: 0px 0px 0.5vw rgba(255, 255, 255, 0.5);
    animation: pageLoadCoverProgress ease 2s infinite;
}

.noscript {
    position: fixed;
    top: 55vh;
    left: 0vw;
    width: 100vw;
    text-align: center;
}

.loadingErrorsContainer {
    position: fixed;
    top: 55vh;
    left: 0vw;
    width: 100vw;
    text-align: center;
}

.loadingErrors {
    color: red;
}

@keyframes pageLoadCoverProgress {
    0% {
        background-position: -150% 0, -150% 0;
    }

    66% {
        background-position: 250% 0, -150% 0;
    }

    100% {
        background-position: 250% 0, 250% 0;
    }
}

#copyrightNotice2 {
    position: fixed;
    bottom: calc(10vh);
    left: 50vw;
    font-size: 2vh;
    transform: translateX(-50%);
}
</style>