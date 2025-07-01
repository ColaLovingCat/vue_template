<script setup lang="ts">
const props = defineProps<{
    title: string
}>()
</script>

<template>
    <div class="widget-box">
        <h2>{{ title }}</h2>
    </div>
</template>

<style scoped>
h2 {
    text-align: center;
    font-weight: 700;
}
</style>