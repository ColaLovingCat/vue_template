<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import chats from '@/components/chats/view.vue'

const chatRef: any = ref(null)
const chatConfigs = {
  activeInput: true,
  activeToken: false,
}
let chatRecord: any = null
const chatMark = ref(false)
//
const sendChat = (record: any) => {
  chatRecord = { ...record }
  chatMark.value = !chatMark.value
  //
  setTimeout(() => {
    chatRecord = null
  }, 500)
}
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
  Home
  <div class="box-chats">
    <chats ref="chatRef" :configs="chatConfigs" :record="chatRecord" :change-mark="chatMark" @sended="afterSend($event)"
      @received="afterReceive($event)" @cleared="afterClear()" @clickItem="clickItem($event)"></chats>
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
