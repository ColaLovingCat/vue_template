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
    type: "触发方式",
    category: [
       {
        id: "Trigger_Manually",
        name: "手动触发",
      },
      {
        name: "计划任务",
        id: "Trigger_Schedule",
      },
      {
        id: "Trigger_WebCall",
        name: "API请求",
      },
      {
        id: "Trigger_Chat",
        name: "聊天信息",
      },
    ]
  },
  {
    type: "数据输入",
    category: [
      {
        id: "Data_Input_Const",
        name: "常量参数",
      },
      {
        id: "Data_Input_File",
        name: "文件上传",
      },
      {
        id: "Data_Input_SQL",
        name: "数据库",
      },
      {
        id: "Data_Input_HTTP_Request",
        name: "HTTP请求",
      },
    ]
  },
  {
    type: "逻辑节点",
    category: [
      {
        id: "Logi_If",
        name: "判断",
      },
      {
        id: "Logi_Switch",
        name: "分支",
      },
      {
        id: "Logi_Merge",
        name: "分支合并",
      },
      {
        id: "Logi_Loops",
        name: "循环",
      },
      {
        id: "Logi_Loops_Continue",
        name: "循环继续",
      },
      {
        id: "Logi_Loops_Break",
        name: "循环中止",
      },
      {
        id: "Logi_Error_Output",
        name: "错误输出",
      },
    ]
  },
  {
    type: "数据处理",
    category: [
      {
        id: "Data_Process_Filter",
        name: "筛选",
      },
      {
        id: "Data_Process_Sort",
        name: "排序",
      },
      {
        id: "Data_Process_Remove_Duplicates",
        name: "去重",
      },
      {
        id: "Data_Process_Summarize",
        name: "聚合",
      },
      {
        id: "Data_Process_Code",
        name: "代码处理",
      },
    ]
  },
  {
    type: "数据输出",
    category: [
      {
        id: "Data_Output_Data",
        name: "数据输出",
      },
      {
        id: "Data_Output_File",
        name: "文件下载",
      },
    ]
  },
]
</script>

<template>
  <Workflow :stencils="stencils"></Workflow>
</template>

<style scoped lang="scss"></style>
