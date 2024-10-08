<script setup lang="ts">
import { ref } from 'vue';
import btns from '@/components/btn-group/btn-group.vue'

const value = ref('Day')
const list = [
  { value: 'Day', label: 'Day' },
  { value: 'Week', label: 'Week' },
  { value: 'Month', label: 'Month' },
  { value: 'Year', label: 'Year' },
]
</script>

<template>
  <span>{{ value }}</span>
  <btns :list="list" v-model:value="value"></btns>
</template>

<style scoped lang="scss"></style>
