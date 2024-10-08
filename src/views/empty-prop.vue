<script lang="ts">
import { ref, reactive, onMounted, defineComponent, computed, watch } from 'vue'
import type { Ref } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: String
    }
  },
  components: {},
  emits: [],
  setup(props, { emit }) {
    onMounted(() => { })

    watch(
      () => props.value,
      (newValue, oldValue) => { }
    )

    return {}
  }
})
</script>

<template>Empty</template>

<style scoped lang="scss"></style>
