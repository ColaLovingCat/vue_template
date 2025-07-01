<script lang="ts" setup>
import { onMounted, ref, reactive, computed, watch, type Ref } from 'vue'

import formView from '@/components/forms/view.vue'
import type { FormItem } from '@/components/forms/form.types';

import * as db from '@/commons/datas/datas'
import * as messages from '@/commons/utils/messages'

// name
defineOptions({
    name: 'custom-name'
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
const emits = defineEmits<{
    (event: 'update', values: any): void
}>()

const pageInfos = ref({
    loading: 0
})

onMounted(() => {
    console.log('Testing: ', props.datas)
    // 加载列表
    db.weeks.map((item: any) => {
        weeks.value.push({
            value: item.full,
            label: item.full,
        })
    })
})

watch(
    () => props.changeMark,
    (newValue, oldValue) => { }
)

const intervals = ref([
    { value: 'Seconds', label: 'Seconds' },
    { value: 'Minutes', label: 'Minutes' },
    { value: 'Hours', label: 'Hours' },
    { value: 'Days', label: 'Days' },
    { value: 'Weeks', label: 'Weeks' },
    { value: 'Months', label: 'Months' },
    { value: 'Custom', label: 'Custom (Cron)' },
])
const weeks: any = ref([])

const formRef = ref();
const formConfig = reactive({
    class: {
        forms: '',
        items: '',
        label: 'col-12',
    },
    format: {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss'
    },
    showError: true
})
const formList: Ref<FormItem[]> = ref([
    {
        type: 'input',
        key: 'taskName',
        label: 'Task Name',
        required: true,
    },
    {
        type: 'select',
        key: 'interval',
        label: 'Trigger Interval',
        required: true,
        activeClear: true,
        activeSearch: true,
        list: intervals.value,
    },
    {
        type: 'input',
        key: 'value',
        label: 'Between Triggers',
        hidden: (formValue: any) => formValue.interval === 'Custom',
        isNumber: true,
        required: true,
    },
    {
        type: 'input',
        key: 'day',
        label: 'Trigger at Day of Month',
        hidden: (formValue: any) => formValue.interval !== 'Months',
        isNumber: true,
        required: true,
    },
    {
        type: 'select',
        key: 'weeks',
        label: 'Trigger on Weekdays',
        hidden: (formValue: any) => formValue.interval !== 'Weeks',
        isMulti: true,
        required: true,
        list: weeks.value
    },
    {
        type: 'input',
        key: 'hour',
        label: 'Trigger at Hour',
        hidden: (formValue: any) => { return formValue.interval !== 'Days' && formValue.interval !== 'Weeks' && formValue.interval !== 'Months' },
        isNumber: true,
        required: true,
    },
    {
        type: 'input',
        key: 'minute',
        label: 'Trigger at Minute',
        hidden: (formValue: any) => { return formValue.interval !== 'Hours' && formValue.interval !== 'Days' && formValue.interval !== 'Weeks' && formValue.interval !== 'Months' },
        isNumber: true,
        required: true,
    },
    {
        type: 'input',
        key: 'expression',
        label: 'Expression',
        placeholder: 'eg. 0 15 * 1 sun',
        hidden: (formValue: any) => formValue.interval !== 'Custom',
        required: true,
    },
])
const formValue: any = ref({
    taskName: '',
    interval: null,
    value: null,
    day: null,
    weeks: [],
    hour: null,
    minute: null,
})
//
const onChange = (key: string) => {
    console.log('[Form] changed: ', key)
}

const save = () => {
    emits('update', formValue.value)
}
const reset = () => { }
</script>

<template>
    <div class="box-configs">
        <div class="config-header">
            <h4>Run the flow every day, hour, or custom interval.</h4>
        </div>
        <div class="config-contents">
            <h4 class="titles">
                <i class="fa-solid fa-gears"></i>
                Trigger Rules
            </h4>
            <div class="config-form">
                <formView ref="formRef" :config="formConfig" :forms="formList" v-model:values="formValue"
                    @changed="onChange">
                    <template #customSlot="{ value, onChange }">
                        <a-slider style="flex:1" :value="value" @change="onChange" :min="0" :max="100" />
                    </template>
                </formView>
                <div class="tips" v-if="formValue.interval === 'Custom'">
                    Format: [Second] [Minute] [Hour] [Day of Month] [Month] [Day of Week]
                </div>
            </div>
        </div>
        <div class="config-footer">
            <div class="btns">
                <button type="button" class="btn btn-primary" @click="save()">Save</button>
                <button type="button" class="btn btn-default" @click="reset()">Reset</button>
            </div>
        </div>
        <div class="loading" v-if="pageInfos.loading > 0"></div>
    </div>
</template>

<style scoped lang="scss">
@import url(../configs.scss);

.config-form {
    padding: 10px;

    .tips {
        padding: 5px 0;
        color: #71747a;
    }
}
</style>
