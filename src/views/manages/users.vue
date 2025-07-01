<script lang="ts" setup>
import { onMounted, ref, type Ref, reactive } from 'vue'

import formView from '@/components/forms/view.vue'
import type { FormItem } from '@/components/forms/form.types'
import type { TableInfos } from '@/commons/types/table.types'

import * as current from './users.services'
import * as messages from '@/commons/utils/messages'

// name
defineOptions({
    name: 'app-users'
})

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
            key: 'roles',
            dataIndex: 'roles',
            title: 'Roles'
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

onMounted(() => {
    getlistData()
})

const formConfig = reactive({
    class: {
        forms: 'inline',
        items: 'col-4',
        label: 'hidden'
    },
    format: {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss'
    }
})

// Search Form
const searchRef = ref();
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
const searchInfos: any = ref({
    userno: '',
    username: '',
    ntAccount: '',
})

//
const search = () => {
    console.log('Testing: ', searchInfos.value)
}
const getlistData = async () => {
    const params = {}
    let resp: any = await current.getlistUsers(params)
    const { status, data, message } = resp;
    if (status) {
        pageInfos.rows = [...data]
        pageInfos.pagination.total = 1
    } else {
        messages.showError(message)
    }
}

// User Modal
const userModal = ref(false)
const userConfig = reactive({
    class: {
        forms: '',
        items: '',
        label: 'col-12'
    },
    format: {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss'
    },
    showError: true
})
const userRef = ref();
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
    {
        type: 'select',
        key: 'roleIDs',
        label: 'Roles',
        list: [],
        isMulti: true
    },
])
const enum formIndex {
    password = 2,
    roles = 6,
}
const userInfos: any = ref({
    userno: '',
    password: '',
    username: '',
    ntAccount: '',
    deptName: '',
    email: '',
    roleIDs: [],
})
const userInfo = reactive({
    action: 'New',
    id: '',
})
//
const clearUser = () => {
    userInfos.value = {
        userno: '',
        password: '',
        username: '',
        ntAccount: '',
        deptName: '',
        email: '',
        roleIDs: [],
    }
}
const getlistRoles = async () => {
    let resp: any = await current.getlistRoles()
    const { status, data, message } = resp;
    if (status) {
        roleInfo.rows = [...data]
        //
        let temp = data.map((a: any) => ({ value: a.id, label: a.roleName }))
        userForms.value[formIndex.roles].list = temp
    } else {
        messages.showError(message)
    }
}
// Edit
const saveUser = async () => {
    if (userRef.value?.validate()) {
        let params = {
            ...userInfos.value,
            avatar: ""
        }
        userInfo.action == "New" ?
            Object.assign(params, { id: '' }) :
            Object.assign(params, { id: userInfo.id })
        console.log('Testing: ', params)
        //
        let resp: any = await current.saveUser(params)
        const { status, data, message } = resp;
        if (status) {
            userModal.value = false
            getlistData()
        } else {
            messages.showError(message)
        }
    }
}
const deleteUser = async (values: any) => {
    const params = {
        id: values.id
    }
    let resp: any = await current.deleteUser(params)
    const { status, data, message } = resp;
    if (status) {
        getlistData()
    } else {
        messages.showError(message)
    }
}

const roleModal = ref(false)
//
const roleConfig = reactive({
    class: {
        forms: 'inline',
        items: 'col-6',
        label: 'hidden'
    },
    format: {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss'
    },
    showError: false
})
const roleRef = ref();
const roleForms: Ref<FormItem[]> = ref([
    {
        type: 'input',
        key: 'roleName',
        label: 'Role Name',
        required: true,
    },
    {
        type: 'input',
        key: 'remark',
        label: 'Remark',
    },
])
const roleInfos: any = ref({
    roleName: '',
    remark: '',
})
//
const roleInfo: any = reactive({
    columns: [
        {
            key: 'roleName',
            dataIndex: 'roleName',
            title: 'Role Name'
        },
        {
            key: 'remark',
            dataIndex: 'remark',
            title: 'Remark'
        },
        {
            key: 'count',
            dataIndex: 'count',
            title: 'Assigned Users'
        },
        {
            key: 'actions',
            dataIndex: 'actions',
            title: 'Actions'
        },
    ],
    rows: []
})
//
const saveRole = async () => {
    if (roleRef.value.validate()) {
        const params = {
            ...roleInfos.value,
            id: "",
        }
        let resp: any = await current.saveRole(params)
        const { status, data, message } = resp;
        if (status) {
            roleInfos.value = {
                roleName: '',
                remark: '',
            }
            //
            getlistRoles()
        } else {
            messages.showError(message)
        }
    } else {
        messages.showError("Please complete all required fields.")
    }
}
const deleteRole = async (values: any) => {
    const params = {
        id: values.id
    }
    let resp: any = await current.deleteRole(params)
    const { status, data, message } = resp;
    if (status) {
        getlistRoles()
        //
        getlistData()
    } else {
        messages.showError(message)
    }
}

// Modal
const showModal = (action: string, values: any) => {
    switch (action) {
        case 'add': {
            userInfo.action = "New"
            //
            userInfo.id = ''
            userForms.value[formIndex.password].hidden = false
            clearUser()
            //
            getlistRoles()
            //
            userModal.value = true
            break
        }
        case 'update': {
            userInfo.action = "Update"
            //
            userInfo.id = values.id
            userForms.value[formIndex.password].hidden = true
            clearUser()
            //
            Object.assign(userInfos.value, values)
            console.log('Testing: ', values)
            userInfos.value.roleIDs = values.roles.map((a: any) => a.id)
            getlistRoles()
            //
            userModal.value = true
            break
        }
        case 'roles': {
            getlistRoles()
            //
            roleModal.value = true
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
            <h4 class="titles">User management</h4>
            <h5 class="sub-titles">Manage your team members and their account permissions here.</h5>
        </div>
        <div class="section-contents">
            <div class="box-bar">
                <div class="header">All users <span class="header-infos">{{ pageInfos.rows.length }}</span></div>
                <div class="tools">
                    <div class="box-search">
                        <formView ref="searchRef" :config="formConfig" :forms="searchForms"
                            v-model:values="searchInfos">
                        </formView>
                        <a-button type="default" @click="search">
                            <i class="fa-solid fa-magnifying-glass"></i> Search
                        </a-button>
                    </div>
                    <!-- <a-button type="default" @click="search">
                        <i class="fa-solid fa-filter"></i> Filters
                    </a-button> -->
                    <a-button type="primary" @click="showModal('add', {})">
                        <i class="fa-solid fa-plus"></i> Add user
                    </a-button>
                    <a-button type="primary" @click="showModal('roles', {})">
                        <i class="fa-solid fa-gear"></i> Role config
                    </a-button>
                </div>

            </div>
            <div class="box-table box-shadow">
                <a-table :columns="pageInfos.columns" :data-source="pageInfos.rows">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'roles'">
                            <template v-for="role in record.roles">
                                <div class="role-item">{{ role.roleName }}</div>
                            </template>
                        </template>
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

    <!-- 角色信息 -->
    <a-modal v-model:open="roleModal" title="Role List" width="60vw" :footer="[]">
        <div class="role-modal">
            <div class="box-table">
                <a-table :columns="roleInfo.columns" :data-source="roleInfo.rows">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'count'">
                            <span>{{ record.users.length }}</span>
                        </template>
                        <template v-if="column.key === 'actions'">
                            <div class="btns">
                                <template v-if="record.roleName === 'SystemAdmin'">
                                    <a-button type="default" disabled class="btn btn-tools">
                                        <i class="fa-solid fa-lock"></i>
                                    </a-button>
                                </template>
                                <a-popconfirm v-else title="Are you sure delete this role?" ok-text="Yes"
                                    cancel-text="No" @confirm="deleteRole(record)">
                                    <a-button type="default" class="btn btn-tools">
                                        <i class="fa-solid fa-trash"></i>
                                    </a-button>
                                </a-popconfirm>
                            </div>
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="box-forms">
                <formView ref="roleRef" :config="roleConfig" :forms="roleForms" v-model:values="roleInfos">
                </formView>
                <a-button type="primary" @click="saveRole">Save</a-button>
            </div>
        </div>
    </a-modal>
</template>

<style scoped lang="scss">
.sections {
    position: relative;
    background-size: 1050px;
    background-position: -9px 22px;

    .section-header {
        padding: 10px;

        .titles {
            padding: 10px 0;
            font-size: 21px;
            font-weight: 700;
        }

        .sub-titles {
            font-size: 14px;
        }
    }

    .section-contents {
        display: flex;
        flex-direction: column;
    }
}

.box-bar {
    margin-top: 15px;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header {
        font-size: 1.1rem;

        .header-infos {
            color: #747474;
        }
    }

    .tools {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .box-search {
        display: flex;
    }
}

.role-modal {
    .box-forms {
        margin-top: 5px;
        padding-top: 15px;
        border-top: 1px solid #c4cecf8d;
        display: flex;
    }
}
</style>
