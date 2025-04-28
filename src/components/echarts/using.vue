<script lang="ts" setup>
import { reactive } from 'vue'
import chartView from './view.vue'

// name
defineOptions({
    name: 'custom-name'
})

const chartInfos = reactive({
    options: {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
            }
        ]
    },
    changeMark: false,
    changeData: false,
})
</script>

<template>
    <div class="box-chart">
        <chartView :options="chartInfos.options" :change-mark="chartInfos.changeMark"
            :change-data="chartInfos.changeData"></chartView>
    </div>
</template>

<style scoped lang="scss">
.box-chart {
    width: 800px;
    height: 400px;
}
</style>
