<script lang="ts">
export default {
    mounted() {
        const navBar: HTMLElement = this.$el?.querySelector('.panelNav');
        if (navBar == undefined) return;
        navBar.addEventListener('wheel', (e) => {
            if (e.deltaX == 0) {
                navBar.scrollBy({ left: e.deltaY / 10, behavior: 'auto' });
            }
        }, { passive: true });
    },
}
</script>

<template>
    <div class="panelNavOuter">
        <nav class="panelNav">
            <slot></slot>
        </nav>
    </div>
</template>

<style scoped>
.panelNavOuter {
    position: relative;
    display: flex;
    flex-grow: 1;
    overflow-y: hidden;
}

.panelNav {
    display: flex;
    flex-direction: row;
    padding: 0px 16px;
    overflow-x: scroll;
}

.panelNav::-webkit-scrollbar {
    height: 0px;
}

.panelNavOuter::after {
    content: '';
    position: absolute;
    top: -32px;
    left: 0px;
    width: 100%;
    height: calc(100% + 64px);
    margin: 0px 0px;
    padding: 0px 0px;
    box-shadow: 0px 0px 8px 8px #222 inset;
    pointer-events: none;
}
</style>