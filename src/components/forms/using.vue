<script lang="ts" setup>
import { reactive, ref, type Ref } from 'vue';
import formView from './view.vue'
import type { FormItem } from '@/commons/datas/datas.types';

// name
defineOptions({
    name: 'custom-name'
})

const formConfig = reactive({
    class: {
        forms: '',
        items: 'inline',
        labelCol: 2
    },
})
const formList: Ref<FormItem[]> = ref([
    {
        type: 'input',
        key: 'username',
        label: 'Username',
        required: true,
    },
    {
        type: 'input',
        key: 'password',
        label: 'Password',
        isPassword: true,
        required: true,
    },
    {
        type: 'textarea',
        key: 'desc',
        label: 'Description',
        required: true,
        activeClear: true,
    },
    {
        type: 'select',
        key: 'location',
        label: 'Location',
        required: true,
        activeClear: true,
        activeSearch: true,
        list: [
            { value: 'Asia', label: 'Asia' },
            { value: 'Europe', label: 'Europe' },
        ],
    },
    {
        type: 'switch',
        key: 'status',
        label: 'Status',
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
        type: 'checks',
        key: 'hobby',
        label: 'Hobby',
        required: true,
        list: [
            { value: 'game', label: 'game' },
            { value: 'book', label: 'book' },
            { value: 'code', label: 'code' },
        ],
    },
    {
        type: 'date',
        key: 'birthday',
        label: 'Birthday',
        required: true,
    },
    {
        type: 'date-range',
        key: 'fromto',
        label: 'From to',
        required: true,
    },
])
type FormValue = {
    [key: string]: any;  // 可以是任何类型
};
const formValue: FormValue = ref({
    username: '',
    password: '',
    desc: '',
    location: null,
    status: true,
    sex: '女',
    hobby: [],
    birthday: null,
    fromto: [],
})

const onChange = (key: string) => {
    console.log('[Form] changed: ', key)
}

const formRef = ref();
const onSubmit = () => {
    if (formRef.value?.validate()) {
        console.log('校验通过！可以提交')
    } else {
        console.log('校验失败！请修正错误')
    }
}
</script>

<template>
    <div class="box-forms">
        <div class="box-form">
            <formView ref="formRef" :config="formConfig" :forms="formList" v-model:values="formValue"
                @changed="onChange"></formView>
            <a-button type="primary" @click="onSubmit">Submit</a-button>
        </div>
        <div class="box-result">
            <template v-for="item in formList">
                <p>{{ item.label }}: {{ formValue[item.key] }}</p>
            </template>
        </div>
    </div>
</template>

<style scoped lang="scss">
.box-forms {
    display: flex;
    gap: 20px;

    >* {
        flex: 1;
        padding: 20px;
    }
}
</style>
