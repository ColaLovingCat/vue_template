<script lang="ts" setup>
import { ref, watch, computed } from "vue";

// name
defineOptions({
  name: 'app-flip'
})

// props
const props = defineProps({
  value: {
    type: String,
    require: true
  },
  fontSize: {
    type: [Number, String],
    default: 16,
  },
})

const prevNumber = ref(props.value);
const flipping = ref(false);

watch(() => props.value, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    prevNumber.value = oldVal;
    flipping.value = true;
    setTimeout(() => {
      flipping.value = false;
    }, 500);
  }
});

const computedFontSize = computed(() => `${props.fontSize}px`);
const isDot = computed(() => props.value === ".");
</script>

<template>
  <div class="flip-container" :class="{ dot: isDot }" :style="{ fontSize: computedFontSize }">
    <!-- 前一个数字 -->
    <transition name="flip" mode="out-in">
      <span v-if="flipping" class="number old">{{ prevNumber }}</span>
    </transition>

    <!-- 当前数字 -->
    <transition name="flip" mode="out-in">
      <span v-if="!flipping" class="number new">{{ value }}</span>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.flip-container {
  position: relative;
  width: 1em;
  height: 1.5em;
  text-align: center;
  font-weight: 700;
  overflow: hidden;
  display: inline-block;
  margin: 2px;
  line-height: 1.5em;
}

.flip-container.dot {
  width: 0.5em;
  /* 小数点的宽度减少 */
}

.number {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  border-radius: 5px;
}

/* 翻转动画 */
.flip-enter-active,
.flip-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.flip-enter-from {
  transform: rotateX(90deg);
  opacity: 0;
}

.flip-leave-to {
  transform: rotateX(-90deg);
  opacity: 0;
}
</style>
