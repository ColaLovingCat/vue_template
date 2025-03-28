<script lang="ts" setup>
import { computed } from "vue";
import flipView from "./view.vue";

// name
defineOptions({
  name: 'app-flip'
})

// props
const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  dec: {
    type: Number,
    required: true,
  },
  fontSize: {
    type: [Number, String],
    default: 16,
  },
})

const digits = computed(() => props.value.toFixed(props.dec).split(""));
</script>

<template>
 <div class="flip-group">
    <flipView v-for="(char, index) in digits" :key="index" :value="char" :font-size="fontSize" />
  </div>
</template>

<style scoped lang="scss">
.flip-group {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
