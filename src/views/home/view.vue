<script setup lang="ts">
import { onMounted, ref, reactive, computed, watch } from 'vue'

import compsView from '../system/comps.vue'

// name
defineOptions({
  name: 'app-home'
})

onMounted(() => {
})
</script>

<template>
  <div class="sections">
    <compsView></compsView>
  </div>
</template>

<style scoped lang="scss"></style>
