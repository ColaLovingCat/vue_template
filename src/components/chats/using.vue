<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import chats from '@/components/chats/view.vue'

const pageInfos: any = reactive({
    isOpen: true,
    //
    connectionID: '',
    thread_id: '',
    sendQueues: [],
    isProcessing: false,
})

const chatRef: any = ref(null)
const chatConfigs = {
  activeInput: true,
  limit: 10,
}
let chatRecord: any = null
const chatMark = ref(false)
//
const processQueue = async () => {
    if (pageInfos.isProcessing) return;
    //
    pageInfos.isProcessing = true;
    while (pageInfos.sendQueues.length > 0) {
        const record = pageInfos.sendQueues.shift();
        if (!record) continue;
        //
        chatRecord = { ...record };
        chatMark.value = !chatMark.value;
        await new Promise((resolve) => setTimeout(resolve, 500));
        chatRecord = null;
    }
    pageInfos.isProcessing = false;
};
const sendChat = (record: any) => {
    pageInfos.sendQueues.push(record);
    processQueue();
};
//
const afterSend = (event: any) => {
    console.log('afterSend', event)
    const { id, message } = event
    sendChat({
        action: 'waiting',
        id: "",
        name: '小博',
        isBot: true,
        messages: [
            {
                type: 'loading',
                data: id
            }
        ]
    })
}
const afterReceive = (event: any) => {
    console.log('afterReceive', event)
}
const afterClear = () => { }
const clickItem = (event: any) => {
    console.log('clickItem', event)
}
</script>

<template>
    <div class="bg-blue-500 text-white p-4 text-center">
        Home
    </div>
    <div class="box-chats">
        <chats ref="chatRef" :configs="chatConfigs" :record="chatRecord" :change-mark="chatMark"
            @sended="afterSend($event)" @received="afterReceive($event)" @cleared="afterClear()"
            @clickItem="clickItem($event)"></chats>
    </div>

</template>

<style scoped lang="scss">
.box-chats {
    margin: 0 auto;
    width: 1000px;
    height: calc(100vh - 100px);
    background: #fff;
}
</style>
