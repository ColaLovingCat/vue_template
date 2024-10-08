<script lang="ts">
import { defineComponent, ref, watch } from "vue";

interface DropItem {
  value: string | number;
  label: string;
}

export default defineComponent({
  props: {
    list: {
      type: Array<DropItem>,
      required: true,
    },
    value: {
      type: [String, Number],
    },
  },
  // 声明组件将要触发的自定义事件
  emits: ["update:value", "change"],
  setup(props, context) {
    const currentSelect = ref(props.value);

    watch(
      () => props.value,
      (newValue, oldValue) => {
        currentSelect.value = newValue;
      }
    );

    const changeSelect = (values: DropItem) => {
      currentSelect.value = values.value;
      //
      context.emit("update:value", currentSelect.value);
      context.emit("change", currentSelect.value);
    };

    return {
      currentSelect,
      changeSelect,
    };
  },
});
</script>

<template>
  <a-radio-group class="btn-group" v-model:value="currentSelect">
    <a-radio-button v-for="btn in list" :value="btn.value" @click="changeSelect(btn)">
      {{ btn.label }}
    </a-radio-button>
  </a-radio-group>
</template>

<style scoped>
.btn-group>* {
  margin: 0;
}

.ant-radio-button-wrapper-checked {
  color: #fff;
  background: #1677ff;
}
</style>
