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
        type: 'checks',
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
    {
        type: 'date-range',
        key: 'fromto',
        label: 'From to',
    },
])
const formValue = reactive({
    name: '',
    sex: null,
    birthday: null,
})

const onChange = (event: any) => {
    console.log('Testing: ', event)
}
</script>

<template>
    <div class="box-forms">
        <formView :forms="formList" v-model:values="formValue" @changed="onChange"></formView>
    </div>
    <div class="box-result">
        <p>Name: {{ formValue.name }}</p>
        <p>Sex: {{ formValue.sex }}</p>
        <p>Birthday: {{ formValue.birthday }}</p>
    </div>
</template>

<style scoped lang="scss">
.box-forms {
    width: 800px;
    padding: 20px;
}
</style>
