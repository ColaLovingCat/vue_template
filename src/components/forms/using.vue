<script lang="ts" setup>
import { reactive, ref, type Ref } from 'vue';
import formView, { type FormItem } from './view.vue'

// name
defineOptions({
    name: 'custom-name'
})

const formList: Ref<FormItem[]> = ref([
    {
        type: 'input',
        key: 'name',
        label: 'Name',
        required: true,
    },
    {
        type: 'select',
        key: 'sex',
        label: 'Sex',
        list: [
            { value: '男', label: '男' },
            { value: '女', label: '女' },
        ],
    },
    {
        type: 'radios',
        key: 'sex',
        label: 'Sex',
        list: [
            { value: '男', label: '男' },
            { value: '女', label: '女' },
        ],
    },
    {
        type: 'date',
        key: 'birthday',
        label: 'Birthday',
    },
])
const formValue = reactive({
    name: '',
    sex: null,
})
</script>

<template>
    <div class="box-forms">
        <formView :forms="formList" v-model:values="formValue"></formView>
    </div>
</template>

<style scoped lang="scss">
.box-forms {
    width: 800px;
    padding: 20px;
}
</style>
