<script setup lang="ts">
defineProps<{
    width?: string
    height?: string
    borderColor?: string
    flipped? : boolean
    hoverAnimation?: 'lift' | 'swell'
}>();
</script>

<template>

    <div v-if="!flipped ?? true" class="doubleCutCornerContainerWrapper">
        <div class="doubleCutCornerContainer">
            <slot></slot>
        </div>
    </div>
    <!-- cut corner on the other side-->
    <div v-else class="doubleCutCornerContainerWrapperReverse">
        <div class="doubleCutCornerContainerReverse">
            <slot></slot>
        </div>
    </div>

</template>

<style>
.doubleCutCornerContainerWrapper {
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'initial'");
    height: v-bind("$props.height ?? 'initial'");
    padding: 4px 4px;
    clip-path: polygon(32px 0%, 100% 0%, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0% 100%, 0% 32px);
    background-color: v-bind("$props.borderColor ?? ' white'");
    text-align: left;
    transition: 200ms ease transform;
    overflow: hidden;
}

.doubleCutCornerContainer {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 12px 12px;
    clip-path: polygon(30px 0%, 100% 0%, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0% 100%, 0% 30px);
    background-color: black;
    overflow-x: hidden;
    overflow-y: auto;
}

.doubleCutCornerContainerWrapperReverse {
    box-sizing: border-box;
    width: v-bind("$props.width ?? 'initial'");
    height: v-bind("$props.height ?? 'initial'");
    padding: 4px 4px;
    clip-path: polygon(100% 32px, calc(100% - 32px) 0, 0 0, 0 calc(100% - 32px), 32px 100%, 100% 100%);;
    background-color: v-bind("$props.borderColor ?? ' white'");
    text-align: left;
    transition: 200ms ease transform;
    overflow: hidden;
}

.doubleCutCornerContainerReverse {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 12px 12px;
    clip-path: polygon(100% 30px, calc(100% - 30px) 0, 0 0, 0 calc(100% - 30px), 30px 100%, 100% 100%);;
    background-color: black;
    overflow-x: hidden;
    overflow-y: auto;
}

.doubleCutCornerContainerWrapper:hover {
    transform: v-bind("$props.hoverAnimation == 'lift' ? 'translateY(-8px)' : ($props.hoverAnimation == 'swell' ? 'scale(102%)' : '')");
}

.doubleCutCornerContainerWrapperReverse:hover {
    transform: v-bind("$props.hoverAnimation == 'lift' ? 'translateY(-8px)' : ($props.hoverAnimation == 'swell' ? 'scale(102%)' : '')");
}
</style>