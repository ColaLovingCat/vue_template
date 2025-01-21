<script setup lang="ts">
import { onMounted, ref } from 'vue'
import comp from '@/components/upload-form/view.vue'

import * as extend from '@/commons/utils/extends'

const datas: any = []

onMounted(() => {
  console.log('Testing: ', extend.ExArray.insert([0, 1, 2, 3, 4, 5], 1, 6))
})
</script>

<template>Empty</template>

<style scoped lang="scss"></style>
