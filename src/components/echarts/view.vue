<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, onUnmounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  props: {
    // 定义属性
    options: {},
    width: {
      type: String,
      default: '100%' // 默认宽度
    },
    height: {
      type: String,
      default: '100%' // 默认高度
    },
    changeMark: {
      type: Boolean
    }
  },
  emits: ['chartClick'],
  setup(props, { emit }) {
    const echartsRef: any = ref(null)
    let chartInstance: any = null

    const error = ref(false)

    onMounted(() => {
      chartInstance = echarts.init(echartsRef.value)
      //
      refreshChart()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeChart)
    })

    onUnmounted(() => {
      chartInstance.dispose()
    })

    watch(
      () => props.changeMark,
      () => {
        chartInstance.clear()
        refreshChart()
      }
    )

    const refreshChart = () => {
      try {
        // 初始化图表
        chartInstance.setOption(props.options)
        //
        window.addEventListener('resize', resizeChart)
        //
        chartInstance.on('click', (params: any) => {
          emit('chartClick', params)
        })
      } catch (err) {
        error.value = true
      }
    }

    const resizeChart = () => {
      if (echartsRef.value) {
        echartsRef.value.resize()
      }
    }

    const defaultOptions = {
      title: {
        text: '',
        left: 'center',
        textStyle: {
          color: '#333',
          fontWeight: 500,
          fontSize: 18
        },
        subtext: ''
      },
      //
      color: [
        '#c23531',
        '#2f4554',
        '#61a0a8',
        '#d48265',
        '#91c7ae',
        '#749f83',
        '#ca8622',
        '#bda29a',
        '#6e7074',
        '#546570',
        '#c4ccd3'
      ],
      grid: {
        left: 0,
        bottom: 0,
        containLabel: true
      },
      //
      legend: {
        type: 'scroll',
        show: true,
        orient: 'vertical', // vertical| horizontal
        left: 'right',
        top: 'middle'
      },
      tooltip: {
        show: true,
        trigger: 'axis', // item| axis
        axisPointer: {
          type: 'cross'
        }
      },
      //
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: [
        {
          type: 'value'
        },
        {
          type: 'value'
        }
      ],
      //
      series: [
        {
          name: 'Demo',
          type: 'line',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        },
        {
          name: 'Demo',
          type: 'line',
          yAxisIndex: 1,
          data: [10, 12, 15, 17, 21, 8, 2]
        }
      ]
    }

    return {
      echartsRef,
      error
    }
  }
})
</script>

<template>
  <div class="echart-ele" v-if="!error" :style="{ width: width, height: height }" ref="echartsRef"></div>
  <div class="echart-error" v-if="error" :style="{ width: width, height: height }">
    图表初始化失败，请检查数据或配置
  </div>
</template>

<style scoped>
.echart-error {
  color: #5a5a5f4d;
  font-size: 16px;
  border: 2px dashed #c4cecf6d;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
