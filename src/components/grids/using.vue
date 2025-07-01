<script lang="ts" setup>
import { onMounted, ref, reactive, defineAsyncComponent } from 'vue'

import gridView from './view.vue'

// name
defineOptions({
    name: 'custom-name'
})

onMounted(() => { })

const configs = reactive({
    canEdit: false
})
const changeStatus = () => {
    configs.canEdit = !configs.canEdit
}
const layout = ref([
    { i: '1', x: 0, y: 0, w: 4, h: 1, component: 'TitleWidget', datas: { title: '这是标题组件' } },
    {
        i: '2', x: 0, y: 1, w: 3, h: 4, component: 'ChartWidget', datas: {
            options: {
                title: {
                    text: '这是Echart组件',
                },
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
            }
        }
    },
    {
        i: '3', x: 3, y: 1, w: 1, h: 7, component: 'ChatWidget', datas: {
            chatConfigs: {
                activeInput: true,
                limit: 10,
            },
            record: {
                action: 'tips',
            },
            changeMark: false
        }
    },
])
const componentMap = {
    TitleWidget: defineAsyncComponent(() => import('./comps/title.vue')),
    ChartWidget: defineAsyncComponent(() => import('@/components/echarts/view.vue')),
    ChatWidget: defineAsyncComponent(() => import('@/components/chats/view.vue')),
}
</script>

<template>
    <div class="sections">
        <div class="box-grid">
            <gridView :configs="configs" :layouts="layout" :componentMap="componentMap"></gridView>
        </div>
        <div class="btns">
            <a-button type="primary" shape="circle" v-if="!configs.canEdit" @click="changeStatus">
                <i class="fa-solid fa-pen-to-square"></i>
            </a-button>
            <a-button type="primary" shape="circle" v-if="configs.canEdit" @click="changeStatus">
                <i class="fa-solid fa-save"></i>
            </a-button>
            <a-button type="primary" shape="circle">
                <i class="fa-solid fa-plus"></i>
            </a-button>
        </div>
    </div>


</template>

<style scoped lang="scss">
.sections {
    position: relative;
}

.box-grid {
    width: 100%;
    height: calc(100vh - 90px);
}

.btns {
    position: absolute;
    top: 20px;
    right: 20px;
}
</style>
