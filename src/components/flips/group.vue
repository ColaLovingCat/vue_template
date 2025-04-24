<script lang="ts" setup>
import { computed } from "vue";
import flipView from "./flip.vue";
import rollerView from "./roller.vue";

// name
defineOptions({
  name: 'app-flip'
})

// props
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  dec: {
    type: Number,
    required: true,
  },
  fontSize: {
    type: Number,
    default: 16,
  },
  auto: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const digits = computed(() => props.value.toFixed(props.dec).split(""));
</script>

<template>
  <div class="flip-group">
    <template v-for="(char, index) in digits" :key="index">
      <template v-if="char == '.'">
        <span :style="`width: ${fontSize * 0.5}px; font-size: ${fontSize}px; font-weight: 700`">.</span>
      </template>
      <template v-else>
        <template v-if="type == 'flip'">
          <flipView :number="char" :font-size="fontSize" />
        </template>
        <template v-else>
          <rollerView :number="char" :auto="auto" :font-size="fontSize" />
        </template>
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss">
.flip-group {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
