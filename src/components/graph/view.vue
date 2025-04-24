<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import * as G6 from '@antv/g6';
import { Graph, register } from '@antv/g6';
import { FruchtermanLayout } from '@antv/layout-gpu';

// name
defineOptions({
  name: 'app-graph'
})

// props
const props = defineProps({
  options: { type: Object, require: true, default: () => ({ nodes: [], links: [] }) }, // 节点数据
  changeMark: { type: Boolean, require: false }
})

const graphRef: any = ref(null);
let graph: any = null;

onMounted(() => {
  initGraph()
})

watch([() => props.changeMark], () => {
  updateGraph()
}, { deep: true });

register('layout', 'fruchterman-gpu', FruchtermanLayout);
const initGraph = () => {
  const container = graphRef.value;
  if (!container) return;

  // 获取容器宽高
  const width = container.clientWidth;
  const height = container.clientHeight;

  graph = new G6.Graph({
    container,
    width,
    height,
    // autoFit: 'view',
    // animation: false,
    animation: {
      duration: 1000, // 动画持续时间（毫秒）
      easing: 'ease-in-out', // 缓动函数
    },
    //
    layout: {
      type: 'd3-force',
      collide: {
        strength: 0.7,
      },
      //
      clustering: true,
      nodeClusterBy: 'type',
      linkDistance: 100,
      clusterNodeStrength: 100,
      clusterGravity: 16
      //
      // type: 'fruchterman',
      // gravity: 5,
      // speed: 5,
    },
    node: {
      style: {
        size: (d: any) => d.size,
        fill: (d: any) => d.color,
        halo: false,
        lineWidth: 1,
        //
        labelText: (d: any) => d.label,
        labelFill: '#fff',
        // labelPlacement: 'center',
        // labelWordWrap: true,
        // labelMaxWidth: '90%',
      },
      state: {
        highlight: {
          fill: '#ff5152',
          halo: true,
          lineWidth: 0,
        },
        dim: {
          fill: '#ff8787',
        },
      },
      palette: {
        type: 'group',
        field: 'type',
      },
    },
    edge: {
      style: {
        label: false,
        labelText: (d: any) => d.label,
        labelFill: '#fff',
        endArrow: true,
        endArrowType: 'vee',
      },
      state: {
        highlight: {
          stroke: '#D580FF',
          label: true,
        },
        active: {
          stroke: '#D580FF',
          label: true,
        },
        inactive: {
          strokeOpacity: 0,
        },
      },
    },
    //
    behaviors: [
      'zoom-canvas',
      'drag-canvas',
      'auto-adapt-label',
      'drag-element',
      // size
      {
        type: 'fix-element-size',
        enable: true,
        combo: [
          // { shape: 'key', fields: ['lineWidth'] },
          { shape: 'label' }
        ],
      },
      // Highlight
      function () {
        return {
          key: 'hover-activate',
          type: 'hover-activate',
          enable: (e: any) => e.targetType === 'node',
          state: 'highlight',
          degree: 1,
          inactiveState: 'inactive',
          onHover: (e: any) => {
            this.frontElement(e.target.id);
            e.view.setCursor('pointer');
          },
          onHoverEnd: (e: any) => {
            e.view.setCursor('default');
          },
        };
      },
    ],
    plugins: [
      // {
      //   type: 'fullscreen',
      //   key: 'fullscreen',
      // },
      // function () {
      //   const graph = this;
      //   return {
      //     type: 'toolbar',
      //     key: 'toolbar',
      //     position: 'top-left',
      //     onClick: (item: any) => {
      //       const fullscreenPlugin: any = graph.getPluginInstance('fullscreen');
      //       if (item === 'request-fullscreen') {
      //         fullscreenPlugin.request();
      //       }
      //       if (item === 'exit-fullscreen') {
      //         fullscreenPlugin.exit();
      //       }
      //     },
      //     getItems: () => {
      //       return [
      //         { id: 'request-fullscreen', value: 'request-fullscreen' },
      //         { id: 'exit-fullscreen', value: 'exit-fullscreen' },
      //       ];
      //     },
      //   };
      // },
      // {
      //   type: 'tooltip',
      //   getContent: (e: any, items: any) => {
      //     let result = `<h4>Node</h4>`;
      //     items.forEach((item: any) => {
      //       result += `<p>Label: <b>${item.label}</b></p>`;
      //     });
      //     return result;
      //   },
      // }
    ]
  });

  updateGraph()
};
const updateGraph = () => {
  const { nodes, edges } = props.options
  graph.setData({ nodes, edges });
  graph.render();
}
</script>

<template>
  <div class="graph-view" ref="graphRef" style="width: 100%; height: 100%;"></div>
</template>

<style scoped lang="scss"></style>
