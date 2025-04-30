<script lang="ts" setup>
import { reactive, onMounted } from 'vue'

import flipView from './group.vue'

// name
defineOptions({
  name: 'custom-name'
})

onMounted(() => {
  setInterval(() => {
    flipInfos.number += 5.5
    rollerInfos.number += 5.5
  }, 5000)
})

const flipInfos = reactive({
  number: 1100,
  configs: {
    type: 'flip',
    dec: 1,
    fontSize: 30,
  },
})
const rollerInfos = reactive({
  number: 1100,
  configs: {
    type: 'roller',
    dec: 1,
    fontSize: 30,
    auto: true,
    timer: 5000,
  },
})
</script>

<template>
  <flipView :value="flipInfos.number" :configs="flipInfos.configs"></flipView>
  <flipView :value="rollerInfos.number" :configs="rollerInfos.configs"></flipView>
</template>

<style scoped lang="scss"></style>
