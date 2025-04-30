<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import type { Ref } from 'vue'

// name
defineOptions({
  name: 'app-roller'
})

// props
const props = defineProps({
  number: {
    type: String,
    required: true,
  },
  fontSize: {
    type: Number,
    default: 18, // 默认字体大小
  },
  auto: {
    type: Boolean,
    required: false,
  },
  timer: {
    type: Number,
    required: false,
  },
})

const roller: any = ref(null);
const digits = [...Array(10).keys(), ...Array(10).keys()]; // 0-9两轮，确保完整滚动
let intervalId = null;

const startRolling = () => {
  if (!roller.value) return;

  const currentIndex = digits.indexOf(props.number * 1);
  const targetIndex = currentIndex + 10; // 一圈后回到当前数字

  roller.value.style.transition = "none";
  roller.value.style.transform = `translateY(-${currentIndex * props.fontSize * 1.25}px)`;

  setTimeout(() => {
    if (!roller.value) return;

    roller.value.style.transition = "transform 1.5s ease-in-out";
    roller.value.style.transform = `translateY(-${targetIndex * props.fontSize * 1.25}px)`;
  }, 50);
};


// 监听 number 变化
watch(() => props.number, startRolling);

// 自动每 5 秒滚动
onMounted(() => {
  startRolling();
  if (props.auto) {
    intervalId = setInterval(startRolling, props.timer);
  }
});
</script>

<template>
  <div class="number-roller" :style="{
    height: `${fontSize * 1.25}px`,
    width: `${fontSize * 0.8}px`
  }">
    <span ref="roller" class="roller">
      <span v-for="num in digits" :key="num" class="digit" :style="{
        fontSize: `${fontSize}px`,
        height: `${fontSize * 1.25}px`,
        lineHeight: `${fontSize * 1.25}px`,
        width: `${fontSize * 0.8}px`
      }">
        {{ num }}
      </span>
    </span>
  </div>
</template>

<style scoped lang="scss">
.number-roller {
  display: inline-block;
  overflow: hidden;
  width: auto;
  text-align: center;
  position: relative;
}

.roller {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
}

.digit {
  text-align: center;
  font-weight: bold;
}
</style>
