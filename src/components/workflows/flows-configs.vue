<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import type { Ref } from 'vue'

// name
defineOptions({
  name: 'custom-name'
})

// props
const props = defineProps({
  datas: {
    type: Object,
    default: () => ({})
  },
  changeMark: {
    type: Boolean,
    require: false
  }
})

// emits
const emit = defineEmits<{
  (event: 'update', values: any): void
}>()

onMounted(() => {})

watch(
  () => props.changeMark,
  (newValue, oldValue) => {}
)
</script>

<template>Empty</template>

<style scoped lang="scss"></style>
