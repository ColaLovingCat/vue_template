<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import chats from '@/components/chats/view.vue'

const chatRef: any = ref(null)

let chatRecord: any = null
const chatAPI =
  'https://szhlinvma72.apac.bosch.com:51006/api/ai_platform/logistic_demand_forecast/chat_response/'
const chatMark = ref(false)

const afterSend = (e: any) => {
  console.log('Testing: After Send')
}
const afterReceive = (e: any) => { }
const afterClear = () => { }
</script>

<template>
  Home
  <div class="box-chats">
    <chats ref="chatRef" :configs="{
      code: 'lop',
      api: chatAPI,
      activeInput: true,
      activeToken: false,
      infos: {
        vehicle: '理想MEGA'
      }
    }" :record="chatRecord" :change-mark="chatMark" @sended="afterSend($event)" @received="afterReceive($event)"
      @cleared="afterClear()"></chats>
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
