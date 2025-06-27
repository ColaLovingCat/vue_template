<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import type { Ref } from 'vue'

import Workflow from './flows.vue'

// name
defineOptions({
  name: 'custom-name'
})

onMounted(() => { })

const stencils = [
  {
    type: "基础节点",
    category: [
      {
        name: "常量输入",
        id: "Const_Input"
      },
    ]
  },
  {
    type: "逻辑节点",
    category: [
      {
        name: "Routing",
        id: "Logi"
      },
      {
        name: "Switch",
        id: "Logi"
      },
      {
        name: "Filter",
        id: "Logi"
      },
      {
        name: "Loops",
        id: "Logi"
      },
    ]
  },
  {
    type: "参数配置",
    category: [
      {
        name: "MES参数选择_Szh",
        id: "ParaMonitoring_param_select_szh"
      },
      {
        name: "MES参数选择_Wuj",
        id: "ParaMonitoring_param_select_wuj"
      },
      {
        name: "工站匹配",
        id: "DataEx_Input_Position"
      }
    ]
  },
  {
    type: "数据处理",
    category: [
      {
        name: "数据处理",
        id: "DataEx_Processing"
      }
    ]
  },
  {
    type: "数据展示",
    category: [
      {
        name: "数据展示",
        id: "DataEx_Show"
      }
    ]
  },
  {
    type: "监控规则配置",
    category: [
      {
        name: "Sigma监控",
        id: "ParaMonitor_Rule_Sigma"
      },
      {
        name: "CPK监控",
        id: "ParaMonitor_Rule_CPK"
      },
      {
        name: "CMK监控",
        id: "ParaMonitor_Rule_CMK"
      },
      {
        name: "多规则监控",
        id: "ParaMonitor_Rule_Multi"
      }
    ]
  },
  {
    type: "监控任务部署",
    category: [
      {
        name: "周期性任务定制",
        id: "ParaMonitor_Task_Periodic"
      }
    ]
  }
]
</script>

<template>
  <Workflow :stencils="stencils"></Workflow>
</template>

<style scoped lang="scss"></style>
