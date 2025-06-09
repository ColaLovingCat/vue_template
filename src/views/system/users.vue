<script lang="ts" setup>
import { onMounted, ref, type Ref, reactive } from 'vue'

import formView from '@/components/forms/view.vue'
import type { FormItem } from '@/commons/types/form.types'
import type { TableInfos } from '@/commons/types/table.types'

import * as current from './users.services'
import * as messages from '@/commons/utils/messages'

// name
defineOptions({
    name: 'app-users'
})

onMounted(() => {
    getlistData()
})

const formConfig = reactive({
    class: {
        forms: 'inline',
        items: 'col-2',
        labelCol: 12
    },
    format: {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss'
    }
})

const searchForms: Ref<FormItem[]> = ref([
    {
        type: 'input',
        key: 'userno',
        label: 'User No',
    },
    {
        type: 'input',
        key: 'username',
        label: 'User Name',
    },
    {
        type: 'input',
        key: 'ntAccount',
        label: 'NT Account',
    },
])
const searchRef = ref();
const searchInfos: any = ref({
    userno: '',
    username: '',
    ntAccount: '',
})

const search = () => {
    console.log('Testing: ', searchInfos.value)
}
const pageInfos: TableInfos = reactive({
    columns: [
        {
            key: 'userno',
            dataIndex: 'userno',
            title: 'User No'
        },
        {
            key: 'ntAccount',
            dataIndex: 'ntAccount',
            title: 'NT Account'
        },
        {
            key: 'username',
            dataIndex: 'username',
            title: 'User Name'
        },
        {
            key: 'deptName',
            dataIndex: 'deptName',
            title: 'Department'
        },
        {
            key: 'email',
            dataIndex: 'email',
            title: 'Email'
        },
        {
            key: 'actions',
            dataIndex: 'actions',
            title: 'Actions'
        },
    ],
    rows: [] as any[],
    pagination: {
        index: 0,
        size: 10,
        total: 0,
    }
})
const getlistData = async () => {
    const params = {}
    let resp: any = await current.getlistUsers(params)
    const { status, data } = resp;
    if (status) {
        console.log('Testing: ', data);
        pageInfos.rows = [...data]
    }
}

const userConfig = reactive({
    class: {
        forms: '',
        items: '',
        labelCol: 12
    },
    format: {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss'
    },
    showError: true
})
const userModal = ref(false)
const userForms: Ref<FormItem[]> = ref([
    {
        type: 'input',
        key: 'userno',
        label: 'User No',
        required: true,
    },
    {
        type: 'input',
        key: 'ntAccount',
        label: 'NT Account',
        required: true,
    },
    {
        type: 'input',
        key: 'password',
        label: 'Password',
        isPassword: true,
        required: true,
        hidden: true,
    },
    {
        type: 'input',
        key: 'username',
        label: 'User Name',
        required: true,
    },
    {
        type: 'input',
        key: 'deptName',
        label: 'Department',
        required: true,
    },
    {
        type: 'input',
        key: 'email',
        label: 'Email',
        isEmail: true
    },
])

const userRef = ref();
const userInfo = reactive({
    action: 'New',
    id: '',
})
const clearUser = () => {
    userInfos.value = {
        userno: '',
        password: '',
        username: '',
        ntAccount: '',
        deptName: '',
        email: '',
    }
}
const userInfos: any = ref({
    userno: '',
    password: '',
    username: '',
    ntAccount: '',
    deptName: '',
    email: '',
})
const saveUser = async () => {
    if (userRef.value?.validate()) {
        switch (userInfo.action) {
            case 'New': {
                const params = {
                    ...userInfos.value,
                    avatar: ""
                }
                let resp: any = await current.addUser(params)
                const { status, data, message } = resp;
                if (status) {
                    userModal.value = false
                    getlistData()
                } else {
                    messages.showError(message)
                }
                break
            }
            case 'Update': {
                const params = {
                    id: userInfo.id,
                    ...userInfos.value,
                    avatar: ""
                }
                let resp: any = await current.updateUser(params)
                const { status, data, message } = resp;
                if (status) {
                    userModal.value = false
                    getlistData()
                } else {
                    messages.showError(message)
                }
                break
            }
            default: {
                break
            }
        }
    }
}
const deleteUser = async (values: any) => {
    const params = {
        id: values.id
    }
    let resp: any = await current.deleteUser(params)
    const { status, result } = resp;
    if (status) {
        getlistData()
    }
}

const showModal = (action: string, values: any) => {
    switch (action) {
        case 'add': {
            userInfo.action = "New"
            //
            userForms.value[2].hidden = false
            clearUser()
            //
            userModal.value = true
            break
        }
        case 'update': {
            userInfo.action = "Update"
            userInfo.id = values.id
            //
            userForms.value[2].hidden = true
            Object.assign(userInfos.value, values)
            //
            userModal.value = true
            break
        }
        default: {
            break
        }
    }
}
</script>

<template>
    <div class="sections">
        <div class="section-header">
            <h4 class="titles">
                <span>User List</span>
                <div class="header-tools">
                    <div class="btns">
                        <a-button type="primary" @click="showModal('add', {})">
                            <i class="fa-solid fa-plus"></i>
                        </a-button>
                    </div>
                </div>
            </h4>
        </div>
        <div class="section-contents">
            <div class="box-search box-shadow">
                <formView ref="searchRef" :config="formConfig" :forms="searchForms" v-model:values="searchInfos">
                </formView>
                <div class="btns">
                    <a-button type="primary" @click="search">Search</a-button>
                </div>
            </div>
            <div class="box-table box-shadow">
                <a-table :columns="pageInfos.columns" :data-source="pageInfos.rows">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'actions'">
                            <div class="btns">
                                <a-button type="default" @click="showModal('update', record)">
                                    <i class="fa-solid fa-edit"></i>
                                </a-button>
                                <a-popconfirm title="Are you sure delete this user?" ok-text="Yes" cancel-text="No"
                                    @confirm="deleteUser(record)">
                                    <a-button type="default">
                                        <i class="fa-solid fa-trash"></i>
                                    </a-button>
                                </a-popconfirm>
                            </div>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </div>

    <a-modal v-model:open="userModal" :title="`${userInfo.action} User`" @ok="saveUser">
        <formView ref="userRef" :config="userConfig" :forms="userForms" v-model:values="userInfos">
        </formView>
    </a-modal>
</template>

<style scoped lang="scss">
.sections {
    .section-header {
        .titles {
            padding: 10px 0;
            font-size: 21px;
            font-weight: 700;
            display: flex;
            gap: 15px;
        }
    }

    .section-contents {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}

.box-search {
    padding: 10px;
    border-radius: 8px;
    background: #fff;

    .btns {
        margin-top: 10px;
    }
}
</style>
