<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import type { Ref } from 'vue'

import { configComponentMap } from '@/components/workflows/customs/modules'

// name
defineOptions({
  name: 'flows-configs'
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
  (event: 'updateParams', value: any): void
  // (event: 'updateResult', value: any): void
  // (event: 'updateItemInfos', value: any): void
  // (event: 'updateFlowData', value: any): void
}>()

const configInfos = reactive({
  id: '',
  category: '',
  //
  flowID: -1,
  dataID: -1, // 前置结果
  dataIDs: [], // 前置结果集
  //
  changeMark: false,
  datas: [], // 缓存数据集
})
// 节点数据
let nodeDatas: any = {}
const params: any = ref(null)

const currentComponent = ref()

onMounted(() => {
  console.log('Testing: ', props.datas)
})

watch(
  () => props.datas,
  (val) => {
    // 加载对应的配置表单
    if (val?.category?.id) {
      const id = val.category.id.toLowerCase()
      currentComponent.value = configComponentMap[id]
    } else {
      currentComponent.value = null
    }
  },
  { immediate: true }
)

</script>

<template>
  <component v-if="currentComponent" :is="currentComponent" :params="datas.params"
    @update="(val: any) => emit('updateParams', val)" />
  <div v-else>
    暂无对应配置组件
  </div>
</template>

<style scoped lang="scss"></style>
