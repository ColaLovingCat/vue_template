<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'

import { Graph } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
//@ts-ignore
import dagre from 'dagre'
import { Stencil } from '@antv/x6-plugin-stencil'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Keyboard } from '@antv/x6-plugin-keyboard'

import type { StencilInfos, FlowInfos, NodeData } from './contents/types'
import flowNode from './flows-node.vue'
import { getNode, getRunInfos } from './customs/custom'
import flowConfigs from './flows-configs.vue'

import * as messages from '@/commons/utils/messages'
import * as extend from '@/commons/utils/extends'

// name
defineOptions({
  name: 'app-flows'
})

// props
const props = defineProps({
  stencils: {
    type: Array<StencilInfos>,
    default: () => ([])
  },
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
  (event: 'update:datas', values: any): void
  (event: 'save'): void
}>()

//#region Register
const ports = {
  groups: {
    left: {
      position: 'left',
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: '#87ab7b',
          strokeWidth: 2,
          fill: '#fff'
        }
      }
    },
    right: {
      position: 'right',
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: '#87ab7b',
          strokeWidth: 2,
          fill: '#fff'
        }
      }
    }
  }
}
register({
  shape: 'flows-node',
  component: flowNode,
  ports
})
Graph.registerEdge(
  'dag-edge',
  {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#C2C8D5',
        strokeWidth: 1,
        targetMarker: null
      }
    }
  },
  true
)
//#endregion

onMounted(() => {
  initialGraph()
  //
  initialFuncs()
  refreshFuncs()
})

watch(
  () => props.changeMark,
  (newValue, oldValue) => { }
)

const defaultFlowName = "newflow01"
const flowInfos: FlowInfos = reactive({
  topic: '参数处理',
  flowID: '',
  name: defaultFlowName,
  datas: null as any,
  nodes: [] as any[],
  edges: [] as any[],
})

// 页面容器
const container: any = ref(null)
let graph: Graph | any
const container_stencil: any = ref(null)
let stencil: any = null
const nameForm: any = ref(null)

//#region Initial
const initialFuncs = () => {
  // 工具栏初始化
  stencil = new Stencil({
    title: '',
    target: graph,
    groups: [],
    //
    stencilGraphWidth: 320,
    stencilGraphHeight: 60,
    collapsable: true,
    layoutOptions: {
      columns: 1,
      columnWidth: 320,
      rowHeight: 60
    }
  })
  container_stencil.value.appendChild(stencil.container)
}
const refreshFuncs = () => {
  if (props.stencils.length > 0) {
    props.stencils.map((item: any) => {
      const newGroup = {
        name: item.type,
        title: item.type,
        graphHeight: 60 * item.category.length + 20
      }
      stencil.addGroup(newGroup)
      //
      let temp: any = []
      item.category.map((category: any) => {
        let node = getNode(item.type, category)
        temp.push(graph.createNode(node))
      })
      stencil.load(temp, item.type)
    })
  }
}
const initialGraph = () => {
  // 初始化设置
  graph = new Graph({
    container: container.value,
    width: container.value.clientWidth,
    height: container.value.clientHeight,
    // 网格
    grid: {
      visible: true,
      size: 20,
      type: 'dot',
      args: {
        color: '#a0a0a0',
        thickness: 1
      }
    },
    // 平移
    panning: true,
    // 缩放
    mousewheel: true,
    //
    connecting: {
      anchor: 'center',
      connectionPoint: 'anchor',
      connector: 'smooth', // 设置连接线样式
      allowBlank: false,
      allowMulti: false,
      snap: true,
      highlight: true,
      createEdge() {
        return graph.createEdge(getEdge())
      },
    }
  })
  graph
    .use( // 移动
      new Transform({
        resizing: false,
        rotating: false
      })
    )
    .use(new Snapline())    // 对齐线
    .use(
      new Selection({
        rubberband: false,
        showNodeSelectionBox: true
      })
    )
    .use(new Keyboard())

  // delete
  graph.bindKey('backspace', () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.removeCells(cells)
    }
  })
  graph.bindKey('delete', () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.removeCells(cells)
    }
  })

  // 监听 node
  graph.on('node:added', ({ node }: any) => {
    console.log('[Flow] node new:', node.id)
    // 设置新状态
    node.setData({ id: node.id, isStencil: false, status: 'initial' })
    // 设置新的宽高
    node.resize(250, 100)
  })
  graph.on('node:removed', ({ node }: any) => {
    console.log('[Flow] node remove:', node.id)
  })

  // 监听 edge
  graph.on('edge:added', ({ edge }: any) => {
    console.log('[Flow] edge add:', edge.id)
  });

  // 验证连接是否有效
  graph.on('edge:connected', ({ isNew, edge }: any) => {
    console.log('[Flow] edge connect:', edge.id)
    if (isNew) {

      // 检测端口输出
      if (edge.source.port != 'right' || edge.target.port != 'left') {
        graph.removeEdge(edge);
        messages.showError('只能连接节点的 右端口 → 左端口')
        return;
      }
      if (edge.source.cell == edge.target.cell) {
        graph.removeEdge(edge);
        messages.showError('只能连接不同节点的端口')
        return;
      }

      // 获取信息
      const sourceCell = graph.getCellById(edge.source.cell)
      const sourceData = sourceCell.getData() as NodeData
      const targetCell = graph.getCellById(edge.target.cell)
      if (!targetCell) return;
      const targetData = targetCell.getData() as NodeData

      // 检查是否已超出限制
      const limit = targetData.preCheck == 'single' ? 1 : targetData.preCheck == 'double' ? 2 : 999
      if (targetData.preInfos.length >= limit) {
        graph.removeEdge(edge);
        messages.showError('已超过最大连接限制')
        return;
      }

      // 更新
      targetData.preInfos = [
        {
          id: sourceData.id,
          resultID: sourceData.resultID
        },
        ...targetData.preInfos
      ]
      targetCell.setData({ ...targetData }, { overwrite: true })
      console.log('[Flow] update preinfo:', targetData)
    }
  })

  // 监听连接断开
  graph.on('edge:removed', ({ edge }: any) => {
    console.log('[Flow] edge remove:', edge.id)

    // 获取连接的节点
    const targetCell = graph.getCellById(edge.target.cell)
    if (!targetCell) return;
    const targetData = { ...targetCell.getData() as NodeData }

    // 更新
    targetData.preInfos = targetData.preInfos.filter((a: any) => a.id !== edge.source.cell).slice();
    targetCell.setData({
      ...targetData
    }, { overwrite: true })
    console.log('[Flow] update preinfo:', targetData)
  });

  // 监听 data
  graph.on('node:change:data', ({ node }: any) => { })

  // 监听 点击事件
  graph.on('node:click', ({ node, e }: any) => {
    console.log('[Flow] click node:', node.id)
    const nodeDatas: NodeData = node.getData() // 获取节点的 data 数据
    const target = e.target

    // 配置
    if (target.classList.contains('btn-configs')) {
      console.log('[Flow] config node:', node.id)
      // 展示配置窗口
      showModal('configs', {
        ...nodeDatas
      })
      return
    }

    // 开始任务
    if (target.classList.contains('btn-run')) {
      console.log('[Flow] run node:', node.id)
      start(nodeDatas.id)
      return
    }

    // 重命名
    if (target.classList.contains('btn-rename')) {
      console.log('[Flow] run rename:', node.id)
      showModal('rename', { id: nodeDatas.id })
      return
    }
  })
}
// 初始化Edge
const getEdge = () => {
  return {
    shape: 'edge',
    attrs: {
      line: {
        stroke: '#5F95FF',
        strokeWidth: 2,
        targetMarker: {
          name: 'block',
          width: 12,
          height: 8
        }
      }
    },
    zIndex: 0
  }
}
//#endregion

// Run节点 & 状态更新
const start = async (id: string) => {
  const node = graph.getCellById(id)
  const data: NodeData = node.getData() as NodeData
  //
  if (node) {
    // 检查前置信息
    const check = refreshNodePre(id)
    if (!check.status) {
      messages.showError(check.message)
      return false
    }
    // 设置running
    node.setData({ status: 'running' })
    // 获取参数
    let params = {
      node_id: id,
      flow_id: data.flowID,
      ...data.params
    }
    // 获取方法名 & 调整参数
    let runInfos = getRunInfos(data, params)
    console.log('[Flow] run infos: ', runInfos)
    // let methodName: string = 'startUpload'
    // switch (data.category.id) {
    //   case CategoryID.DataEx_Input_File: {
    //     methodName = 'startUpload'
    //     break
    //   }
    //   case CategoryID.DataEx_Input_SQL: {
    //     methodName = 'startSQL'
    //     break
    //   }
    //   case CategoryID.DataEx_Input_Position: {
    //     methodName = 'startWorkPosition'
    //     if (params.dateRange) {
    //       params.start_date = extend.ExDate.format(params.dateRange[0], 'yyyy-MM-dd')
    //       params.end_date = extend.ExDate.format(params.dateRange[1], 'yyyy-MM-dd')
    //     } else {
    //       params.start_date = ''
    //       params.end_date = ''
    //     }
    //     break
    //   }
    //   case CategoryID.DataEx_Input_DMC: {
    //     methodName = 'startDMC'
    //     break
    //   }
    //   //
    //   case CategoryID.DataEx_Processing: {
    //     methodName = 'getlistDataProcess'
    //     params.node_data_id = data.preInfos[0].resultID
    //     params.index = 0
    //     break
    //   }
    //   //
    //   case CategoryID.DataEx_Connection_hstack: {
    //     methodName = 'StackDataH'
    //     params.node_data_id_list = data.preInfos.map((a: any) => a.resultID)
    //     break
    //   }
    //   case CategoryID.DataEx_Connection_vstack: {
    //     methodName = 'StackDataV'
    //     break
    //   }
    //   //
    //   case CategoryID.DataEx_Output_Download: {
    //     methodName = 'downloadData'
    //     params.node_data_id = data.preInfos[0].resultID
    //     break
    //   }
    //   default: {
    //     break
    //   }
    // }
    // run
    // return await current[methodName](params).then(
    //   (resp: any) => {
    //     switch (methodName) {
    //       case 'downloadData': {
    //         const filename = `${extend.ExDate.format(new Date(), 'yyyyMMdd')}_download_${extend.ExString.uuid()}.csv`
    //         // 处理 Blob 文件流
    //         const url = window.URL.createObjectURL(resp)
    //         const a = document.createElement('a')
    //         a.href = url
    //         a.download = filename
    //         document.body.appendChild(a)
    //         a.click()
    //         document.body.removeChild(a)
    //         window.URL.revokeObjectURL(url)
    //         //
    //         node.setData({
    //           status: 'success'
    //         })
    //         return true
    //       }
    //       default: {
    //         if (!resp) {
    //           node.setData({
    //             status: 'error'
    //           })
    //           return false
    //         }
    //         //
    //         const { status, result } = resp
    //         if (status == 1) {
    //           // 结束状态，记录结果
    //           updateResult({
    //             id: id,
    //             resultID: result.node_data_id
    //           })
    //           return true
    //         } else {
    //           messages.showError(result)
    //           //
    //           node.setData({
    //             status: 'error'
    //           })
    //           return false
    //         }
    //       }
    //     }
    //   },
    //   (error: any) => {
    //     node.setData({
    //       status: 'error'
    //     })
    //     return false
    //   }
    // )
  }
}

// 检查前置节点 & 刷新前置信息
const refreshNodePre = (nodeID: string) => {
  let node = graph.getCellById(nodeID)
  let nodeData = node.getData() as NodeData

  let result = {
    status: true,
    message: ''
  }

  // 检查 前置信息所需数量
  switch (nodeData.preCheck) {
    case 'single':
    case 'double': {
      const limit = nodeData.preCheck == 'single' ? 1 : 2
      if (nodeData.preInfos.length < limit) {
        result.status = false
        result.message += nodeData.preCheck + ' 前置信息未设置完成！\r\n'
      }
      if (nodeData.preInfos.length > limit) {
        result.status = false
        result.message += nodeData.preCheck + ' 前置信息设置超出限制！\r\n'
      }
      break
    }
    case 'multi': {
      if (nodeData.preInfos.length < 2) {
        result.status = false
        result.message += nodeData.preCheck + ' 前置信息未设置完成！\r\n'
      }
      break
    }
    default: {
      break
    }
  }
  console.log('[Flow] check pre/length:', nodeData.preCheck, nodeData.preInfos.length)

  // 检查 前置节点是否完成 resultID
  const temp = [...nodeData.preInfos]
  temp.map((item: any) => {
    let source = graph.getCellById(item.id)
    const sourceData = source.getData() as NodeData
    //
    item.resultID = sourceData.resultID
    if (nodeData.model == 'param') {
      item.resultID = item.id
    }
    //
    if (!item.resultID) {
      result.status = false
      result.message += '前置节点未完成结果！\r\n'
    }
    console.log('[Flow] check pre id/resultID:', item.id, item.resultID)
  })
  // 刷新 前置信息
  node.setData({
    preInfos: [...temp]
  })
  //
  return result
}

const onRun = () => { }

const onSave = () => {
  const flowDatas = formatFlowDatas()
  console.log('[Flow] save datas: ', flowDatas)
  emit('update:datas', flowDatas)
  emit('save')
}
const formatFlowDatas = () => {
  const sourceNodes = graph.getNodes()
  const sourceEdges = graph.getEdges()

  const nodes = sourceNodes.map((node: any) => {
    const data = node.getData() as NodeData
    return {
      id: node.id,
      flowID: data.flowID,
      type: data.type,
      category: data.category,
      name: data.name,
      params: data.params
    }
  })

  const edges = sourceEdges.map((edge: any) => {
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target
    }
  })
  if (!flowInfos.name) {
    flowInfos.name = defaultFlowName
  }

  return {
    ...flowInfos,
    nodes,
    edges
  }
}

const debug = ref(true)
const onDebug = () => {
  console.log('[Debug] flow datas: ', formatFlowDatas())
}

//#region Template Modal
const templateModal = ref(false)
const setTemplate = async (data: any | null) => {
  templateModal.value = false

  if (data) {
    if (data.name) {
      flowInfos.name = data.name
    }
    // try {
    //   const resp: any = await current.template_create({
    //     function_name: flowInfos.topic,
    //     template_id: data.id
    //   })
    //   const { status, result } = resp

    //   if (status === 1 && result) {
    //     processWorkflowData({
    //       ...result,
    //       nodes: (result.nodes ?? []).map((node: any) => ({
    //         flowID: pageInfos.flowID,
    //         ...node
    //       })),
    //       edges: (result.edges ?? []).map((edge: any) => {
    //         if (edge.sourceID || edge.targetID) {
    //           return {
    //             source: {
    //               cell: edge.sourceID,
    //               port: 'right'
    //             },
    //             target: {
    //               cell: edge.targetID,
    //               port: 'left'
    //             }
    //           }
    //         }

    //         return edge
    //       })
    //     })
    //   }
    // } catch (error) {
    //   console.error(error)
    // }
  }
}
//#endregion


//#region Configs Modal
const configDraw = ref(false)
const changeMark = ref(false)
let configForm: any = reactive({})
//#endregion

//#region Rename Modal
const renameModal = ref(false);
const renameInfos = reactive({
  id: '',
  name: ''
})
const updateName = () => {
  if (renameInfos.name != '') {
    const node = graph.getCellById(renameInfos.id)
    node.setData({
      name: renameInfos.name,
    })
    renameModal.value = false
  }
}
//#endregion

const showModal = (action: string, values: any) => {
  const nodeID = values.id
  switch (action) {
    case 'configs': {
      // 需要前置信息
      if (values.preCheck != 'none') {
        const check = refreshNodePre(nodeID)
        if (!check.status) {
          messages.showError(check.message)
          return false
        }
      }
      // 获取最新数据
      let node = graph.getCellById(nodeID)
      let nodeData = node.getData() as NodeData
      // 同步flow数据
      if (values.model == 'root' || values.model == 'param') {
        let dataID = values.model == 'root' ? nodeID : values.preInfos[0].resultID
        let datas = flowInfos.datas[dataID]
        console.log('[Flow] from flow data: ', datas)
        if (datas) {
          Object.assign(nodeData.params, datas)
        }
      }
      //
      configForm = reactive({ ...nodeData })
      changeMark.value = !changeMark.value
      //
      configDraw.value = true
      break
    }
    case 'rename': {
      renameInfos.id = nodeID
      renameInfos.name = ''
      //
      renameModal.value = true
      break
    }
    case 'template': {
      templateModal.value = true
      break
    }
    default: {
      break
    }
  }
}
</script>

<template>
  <div class="view-workflows">
    <!-- 工具栏 -->
    <div class="flows-left">
      <div class="title">
        {{ flowInfos.topic }}
      </div>
      <div ref="container_stencil" class="container-stencil"></div>
    </div>

    <!-- 画布 -->
    <div class="flows-right">
      <div ref="container" class="container"></div>
    </div>

    <!-- 编辑工具 -->
    <div class="flows-tools">
      <div class="btns">
        <div class="item-name">
          <a-input ref="nameForm" placeholder="名称" v-model:value="flowInfos.name" size="small" :bordered="false" />
        </div>
        <a-tooltip>
          <template #title>重命名</template>
          <button type="button" class="btn btn-tools" @click="nameForm?.focus()">
            <i class="fa-solid fa-edit"></i>
          </button>
        </a-tooltip>
        <a-tooltip>
          <template #title>运行</template>
          <button type="button" class="btn btn-tools" @click="onRun">
            <i class="fa-solid fa-play"></i>
          </button>
        </a-tooltip>
        <a-tooltip>
          <template #title>保存</template>
          <button type="button" class="btn btn-tools" @click="onSave">
            <i class="fa-solid fa-floppy-disk"></i>
          </button>
        </a-tooltip>
        <a-tooltip v-if="debug">
          <template #title>调试工具</template>
          <button type="button" class="btn btn-tools" @click="onDebug">
            <i class="fa-solid fa-screwdriver-wrench"></i>
          </button>
        </a-tooltip>
      </div>
      <!-- 额外按钮组 -->
      <div class="btns">

      </div>
    </div>
  </div>

  <!-- Configs -->
  <a-drawer v-model:open="configDraw" :maskClosable="false" :destroy-on-close="true" placement="right"
    :title="configForm.category?.name" width="70%" root-class-name="drawer-configs">
    <flowConfigs :datas="configForm" :changeMark="changeMark"></flowConfigs>
  </a-drawer>

  <!-- Rename -->
  <a-modal v-model:open="renameModal" width="500px" title="Rename" @ok="updateName">
    <a-input v-model:value="renameInfos.name" placeholder="new name" />
  </a-modal>
</template>

<style scoped lang="scss">
.view-workflows {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;

  .flows-left {
    position: relative;
    margin: 20px 10px;
    width: 350px;
    border-radius: 10px;
    box-shadow:
      rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
      rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
    display: flex;
    flex-direction: column;

    .title {
      position: absolute;
      top: 0;
      z-index: 1;
      width: 100%;
      height: 60px;
      font-size: 21px;
      line-height: 60px;
      font-weight: 700;
      text-align: center;
      background: #fff;
    }

    .container-stencil {
      flex: 1;
      overflow: auto;
    }
  }

  .flows-right {
    flex: 1;

    .container {
      width: 100%;
      height: 100%;
    }
  }

  .flows-tools {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;

    .btns {
      padding: 5px 10px;
      border-radius: 0 5px;
      background: #fff;
      box-shadow:
        rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
        rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
      display: flex;
      align-items: center;
      gap: 10px;

      .item-name {
        min-width: 120px;
        border-bottom: 1px dashed #0000007d;
      }

      .btn {
        cursor: pointer;
        padding: 5px;
        font-size: 16px;
        border: unset;
        background: unset;
      }
    }
  }
}
</style>
