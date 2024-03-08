<script setup lang="ts">
import { setTitlePanel } from '@/scripts/title';

// load problem information from server

</script>

<template>
    <br><br>
    {{ $route.params.probDiv }}
    {{ $route.params.probRound }}
    {{ $route.params.probNum }}
</template>