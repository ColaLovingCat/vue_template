<script lang="ts" setup>
import { onMounted, ref, reactive, computed, watch } from 'vue'

import * as extend from '@/commons/utils/extends'

// name
defineOptions({
    name: 'custom-name'
})

const datas = ref<extend.ExPaginator<any> | null>(null)
onMounted(() => {
    datas.value = new extend.ExPaginator(
        [{ name: '1' }, { name: '2' }, { name: '3' }, { name: '4' }, { name: '5' }, { name: '6' }, { name: '7' }],
        3
    )
    //
    console.log('Testing: uuid', extend.ExString.uuid())
    console.log('Testing: createRand', extend.ExNumber.createRand(1, 10))
    console.log('Testing: array', extend.ExArray.initial(10))
    console.log('Testing: format', extend.ExDate.format(new Date()))
    console.log('Testing: format', extend.ExObject.buildODataFilter({
        and: [
            { Name: { op: "contains", value: 'ad', not: true } },
            {
                and: [
                    { Age: { op: "gt", value: 21 } },
                    { Birthday: { op: "now", link: "eq" } },
                    { Address: { op: "length", link: "eq", value: 5 } },
                ]
            }
        ]
    }))
})
</script>

<template>
    <div class="box-extend">
        <div class="box-pagination">
            <h4 class="titles">ExPaginator</h4>
            <div class="box-contents">
                <div class="box-show">
                    <div>
                        <span @click="datas?.prev()"><i class="fa-solid fa-angle-left"></i></span>
                        <span>current: {{ datas?.pagination.index }} </span>
                        <span>total: {{ datas?.pagination.total }} </span>
                        <span @click="datas?.next()"><i class="fa-solid fa-angle-right"></i></span>
                    </div>
                    <table class='table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in datas?.rows">
                                <td>{{ row.name }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="box-code"></div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.box-contents {
    display: flex;
    gap: 20px;

    .box-show,
    .box-code {
        flex: 1;
    }
}
</style>
