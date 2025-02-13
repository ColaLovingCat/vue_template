<script lang="ts" setup>
import { ref, reactive, onMounted, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'

//@ts-ignore
import MarkdownIt from 'markdown-it'
//@ts-ignore
import markdownItKatex from 'markdown-it-katex'
import 'katex/dist/katex.min.css'
//@ts-ignore
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

import { useSystemInfosStore } from '@/commons/stores/index'
import { WebSocketService } from '@/commons/utils/websocket'
import echarts from '@/components/echarts/view.vue'
import * as extend from '@/commons/utils/extends'
import * as messages from '@/commons/utils/messages'

import * as current from './index.services'

const debug = true

interface ChatRecord {
  id: string
  name: string
  isBot: boolean
  messages: MessageInfo[]
}
interface MessageInfo {
  type: string;
  data: any
}

// 获取图标
const getIcon = (name: string) => {
  if (name == '小博') return '🤖'
  else return name[0]
}

// 富文本格式化
const md = new MarkdownIt({
  highlight: function (str: string, lang: any) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang }).value +
          '</code></pre>'
        )
      } catch (__) {
        //
      }
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
}).use(markdownItKatex)

// 监听页面的滚动
const container: Ref<any> = ref(null)
let autoScroll = true
const scrollTo = (action: string = 'bottom', force: boolean = false) => {
  // 强制滚动
  if (force) autoScroll = true

  if (autoScroll) {
    requestAnimationFrame(() => {
      container.value?.scrollTo({ top: action == 'bottom' ? container.value.scrollHeight : 0, behavior: "smooth" });
    });
  }
}
const handleUserScroll = () => {
  autoScroll = false;
};

// Token
const getToken = () => {
  if (!props.configs.activeToken) return 'noNeed'
  //
  let token = extend.LocalStore.get('token')
  if (token) return token
  //
  return null
}

// name
defineOptions({
  name: 'app-chat'
})
// emits
const emit = defineEmits<{
  (event: 'sended', values: any): void
  (event: 'received', values: any): void // 回答已接收完
  (event: 'cleared', values: any): void
}>()
// props
const props = defineProps({
  configs: {
    type: Object,
    default: () => {
      return {
        code: 'default',
        api: '',
        activeInput: true,
        activeToken: true,
        infos: {}
      }
    }
  },
  record: {
    type: Object,
    default: null
  },
  changeMark: {
    type: Boolean,
    require: false
  }
})

const chatInfos: {
  host: string,
  bot: {
    id: string,
    name: string,
  },
  thread_id: string,
  connectionID: string,
  message: string,
  messages: ChatRecord[]
  count: number,
  limit: number,
  timer: any,
} = reactive({
  host: 'wss://szhlinvma75.apac.bosch.com:59108/',
  bot: {
    id: '',
    name: '小博'
  },
  //
  thread_id: '', // 聊天的唯一ID
  connectionID: '', // 当前对话的ID
  //
  message: '',
  messages: [],
  // 计时器
  limit: 5,
  count: 0,
  timer: null
})

let wss: WebSocketService | null = null;
onMounted(async () => {
  // 生成唯一ID
  chatInfos.thread_id = extend.ExString.uuid()
  if (debug) console.log('[Chat] thread_id:', chatInfos.thread_id)

  // 启用websocket服务
  wss = new WebSocketService(chatInfos.host, receiveMessage)
  wss.connect()
})
onUnmounted(() => {
  // 清除计时器
  if (chatInfos.timer) {
    cancelIdleCallback(chatInfos.timer);
  }

  // 断开websocket
  if (wss) {
    wss.close()
  }
})

// 监听到父元素的信息，并且展示
watch(
  () => props.changeMark,
  () => {
    if (props.record) {
      if (debug) console.log('[Chat] watch: ', props.record)
      let record: any = { ...props.record }
      // 提示信息
      if (record.isBot) {
        record.id = extend.ExString.uuid()
        chatInfos.messages.push(record)
      }
      // 问题
      else {
        copyMessage(record.messages)
      }
      scrollTo('bottom')
    }
  }
)

// 清除超时计时器
const clearTimer = () => {
  chatInfos.count = 0
  cancelIdleCallback(chatInfos.timer)
  chatInfos.timer = null
}
//
const startTimer = () => {
  if (chatInfos.timer) return;

  chatInfos.count = 0
  chatInfos.timer = requestIdleCallback(() => {
    chatInfos.count++
    if (debug) console.log('[Chat] timer:', chatInfos.count)

    // 已超时
    if (chatInfos.count > chatInfos.limit) {
      if (debug) console.log('[Chat] clear timer with timeout')
      messages.showError('The conversation has timed out')
      outTimer()
    }
  })
}
// 已超时
const outTimer = () => {
  if (debug) console.log('[Timer] timeout')
  let temp = chatInfos.messages.find((a: any) => a.id == chatInfos.connectionID)
  if (temp) {
    temp.id = 'error'
    // 清除loading元素
    temp.messages = temp.messages.filter((item: any) => item.type !== 'loading')
    temp.messages = [
      ...temp.messages,
      {
        type: 'text',
        data: 'server is busy, please try again later.'
      }
    ]
  }
  //
  if (debug) console.log('[Chat] end with timeout')
  endChat()
}

// 初始化聊天信息
const clearChat = (mark: boolean = false) => {
  // 判断 当前是否有对话正在进行中
  if (debug) console.log('[Chat] end with clear')
  endChat()
  //
  chatInfos.messages = []
  if (debug) console.log('[Trans] clear')
  emit('cleared', {})

  // 开启新聊天的时候重新生成一个ID
  if (mark) {
    chatInfos.thread_id = extend.ExString.uuid()
  }
}
// 对话结束
const endChat = () => {
  // 通知父组件
  if (chatInfos.connectionID != '') {
    if (debug) console.log('[Trans] received')
    emit('received', {
      connectionID: chatInfos.connectionID
    })
  }
  // 结束对话
  chatInfos.connectionID = ''
  clearTimer()
}

// 复制信息
const copyMessage = (message: any) => {
  if (debug) console.log('[Chat] copy')
  chatInfos.message = message
  //
  if (!props.configs.activeInput) {
    if (debug) console.log('[Chat] auto')
    sendMessage()
  }
}
// 正常使用聊天发送信息
const sendMessage = () => {
  autoScroll = true

  // 是否有其他聊天正在继续
  if (chatInfos.connectionID != '') {
    if (debug) console.log('[Chat] another conversation wait')
    messages.showInfo(
      'Another conversation is currently in progress. Please wait until it is completed.'
    )
    return false
  }

  // 验证用户信息
  let token = getToken()
  if (!token) {
    const systemStore = useSystemInfosStore()
    systemStore.showLogout(() => {
      ; (window as any).eventBus.logout()
    })
    return false
  }

  //
  const message = chatInfos.message
  if (message != '') {
    chatInfos.message = ''

    // 将发送的文本送入聊天窗口
    let id = extend.ExString.uuid()
    chatInfos.messages.push({
      id,
      name: 'You',
      isBot: false,
      messages: [
        {
          type: 'text',
          data: message
        }
      ]
    })
    handleChat(message, id)
  }
}
const sendAudio = () => {

}
const handleChat = (message: string, id: string) => {
  // 请求回答
  let params: any = {}
  switch (props.configs.code) {
    case 'lop': {
      params = {
        question: message,
        vehicle_name: props.configs.infos.vehicle
      }
      break
    }
    default: {
      params = {
        token: extend.LocalStore.get('token'),
        thread_id: chatInfos.thread_id,
        prompt: message
      }
      break
    }
  }
  current.chat(props.configs.api, params).then(
    (resp: any) => {
      const { status, result } = resp
      if (status) {
        // 记录对话，暂时无法接收新问题
        chatInfos.connectionID = result.connectionID
        if (debug) console.log('[Chat] receive connectionID:', result.connectionID)

        // 拿到回答然后送入聊天窗口
        let respBox = {
          id: chatInfos.connectionID,
          name: chatInfos.bot.name,
          isBot: true,
          messages: [
            {
              type: 'loading',
              data: ''
            }
          ]
        }
        chatInfos.messages.push(respBox)
        if (debug) console.log('[Chat] waiting resp')
        scrollTo('bottom')
        emit('sended', {
          connectionID: chatInfos.connectionID
        })

        // 计时开始
        startTimer()
      }
    },
    (err: any) => {
      console.error('Error', err)
      // 报错
      pushError()
    }
  )
}

// 处理回复信息
const receiveMessage = (msg: any): void => {
  // 重置当前计时器
  if (chatInfos.timer && chatInfos.connectionID == msg.connectionID) {
    chatInfos.count = 0
    if (debug) console.log('[Chat] reset timer with receive')
  }

  let remarks = JSON.parse(msg.remarks)
  switch (msg.category) {
    case 'text': {
      // 段落开始
      if (remarks.paragraph_start) {
        pushMessage({
          id: msg.connectionID,
          messages: [
            {
              type: msg.category,
              data: msg.message
            }
          ]
        })
      } else {
        // 填补前一个段落
        pushText({
          id: msg.connectionID,
          text: msg.message
        })
      }
      break
    }
    default: {
      pushMessage({
        id: msg.connectionID,
        messages: [
          {
            type: msg.category,
            data: JSON.parse(msg.message)
          }
        ]
      })
      break
    }
    case 'error': {
      pushMessage({
        id: msg.connectionID,
        messages: [
          {
            type: 'text',
            data: msg.message
          }
        ]
      })
      break
    }
  }

  if (!remarks.response_end) {
    // 等待之后的内容
    pushMessage({
      id: msg.connectionID,
      messages: [
        {
          type: 'loading',
          data: ''
        }
      ]
    })
  } else {
    // 对话结束
    if (debug) console.log('[Chat] end with response_end')
    endChat()
  }
}

// 接收信息
const pushMessage = (values: any) => {
  const { id, messages } = values
  let temp = chatInfos.messages.find((a: any) => a.id == id)
  if (temp) {
    // 清除loading元素
    temp.messages = temp.messages.filter((item: any) => item.type !== 'loading')
    temp.messages = [...temp.messages, ...messages]
    //
    scrollTo('bottom')
  }
}
// 文本流
const pushText = (values: any) => {
  const { id, text } = values
  let temp = chatInfos.messages.find((a: any) => a.id == id)
  if (temp) {
    // 清除loading元素
    temp.messages = temp.messages.filter((item: any) => item.type !== 'loading')
    // 检查是否最后的类型是text，不是则补充一个新的
    let latestMessage = temp.messages[temp.messages.length - 1]
    if (latestMessage.type != 'text') {
      temp.messages.push({
        type: 'text',
        data: text
      })
    } else {
      latestMessage.data += text
    }
    //
    scrollTo('bottom')
  }
}
// Error
const pushError = () => {
  let messageInfos = {
    id: chatInfos.bot.id,
    name: chatInfos.bot.name,
    isBot: true,
    messages: [
      {
        type: 'text',
        data: 'Server Error'
      }
    ]
  }
  chatInfos.messages.push(messageInfos)
}

// 处理Chart
const chartClick = (event: any) => {
  const { name, data } = event
  let params = { ...data[2] }
  //
  if (!('sub_family' in params)) {
    Object.assign(params, { sub_family: name })
  }
  if (!('date' in params)) {
    Object.assign(params, { date: name })
  }
}
const getOptionBasic = (values: any) => {
  const options = {
    title: {
      text: values.title || '',
      left: 'center'
    },
    grid: {
      left: 0,
      right: 0,
      top: 10,
      bottom: 50,
      containLabel: true
    },
    //
    legend: {
      show: true,
      orient: 'horizontal', // horizontal| vertical
      x: 'center', // left| center| right
      y: 'bottom' // top| middle| bottom
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    //
    xAxis: {
      type: 'category',
      data: values.category,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: [
      {
        type: 'value'
      },
      {
        type: 'value'
      }
    ],
    //
    series: values.series
  }
  return options
}
const getOptionPieces = (values: any) => {
  let pieces: any[] = []
  let markArea: any = {
    data: []
  }
  values.marks.map((item: any) => {
    markArea.data.push([
      {
        xAxis: item.index[0],
        itemStyle: {
          color: item.color
        },
      },
      { xAxis: item.index[1] }
    ])
  })
  //
  values.series[0].markArea = markArea
  //
  const options = {
    title: {
      text: values.title || '',
      left: 'center'
    },
    grid: {
      left: 0,
      right: 0,
      top: 10,
      bottom: 50,
      containLabel: true
    },
    //
    legend: {
      show: true,
      orient: 'horizontal', // horizontal| vertical
      x: 'center', // left| center| right
      y: 'bottom' // top| middle| bottom
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    //
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: values.category,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: [
      {
        type: 'value'
      },
      {
        type: 'value'
      }
    ],
    //
    series: values.series
  }
  return options
}

defineExpose({
  clearChat
})
</script>

<template>
  <div class="app-chat">
    <!-- 聊天窗口 -->
    <div class="box-chat" ref="container" @wheel="handleUserScroll">
      <div class="list-chat">
        <div class="chat-item" v-for="record in chatInfos.messages " :key="record.id"
          :class="record.isBot ? '' : 'item-user'">
          <div class="item-content">
            <div class="item-name">
              <div class="item-icon">{{ getIcon(record.name) }}</div>
              <span>{{ record.name }}</span>
            </div>
            <div class="item-messages">
              <!-- 信息 -->
              <div class="item-message" v-for="msg in record.messages" :key="msg.type">
                <!-- 加载 -->
                <template v-if="msg.type == 'loading'">
                  <div class="dots">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </template>
                <!-- 文本 -->
                <template v-if="msg.type == 'text'">
                  <p class="item-txt" v-html="md.render(msg.data)"></p>
                </template>
                <!-- 列表 -->
                <template v-if="msg.type == 'list'">
                  <div class="list-sugs">
                    <div class="sug-item" v-for="item in msg.data" :key="item" @click="copyMessage(item)">
                      {{ item }}
                    </div>
                  </div>
                </template>
                <!-- 表格 -->
                <template v-if="msg.type == 'table'">
                  <div class="box-table">
                    <table class="table">
                      <thead>
                        <tr>
                          <th v-for="th in msg.data.columns" :key="th">{{ th }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="tr in msg.data.rows" :key="tr">
                          <td v-for="td in msg.data.columns" :key="td">{{ tr[td] }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </template>
                <!-- 音频 -->
                <template v-if="msg.type === 'audio'">
                  <audio controls>
                    <source :src="msg.data.url" :type="msg.data.contentType" />
                    Your browser does not support the audio tag.
                  </audio>
                </template>
                <!-- 视频 -->
                <template v-if="msg.type === 'video'">
                  <video controls>
                    <source :src="msg.data.url" :type="msg.data.contentType" />
                    Your browser does not support the video tag.
                  </video>
                </template>
                <!-- Chart Basic -->
                <template v-if="msg.type == 'chart_basic'">
                  <echarts width="100%" height="300px" :options="getOptionBasic(msg.data)">
                  </echarts>
                </template>
                <!-- Chart Pieces -->
                <template v-if="msg.type == 'chart_pieces'">
                  <echarts width="100%" height="300px" :options="getOptionPieces(msg.data)">
                  </echarts>
                </template>
              </div>
              <!-- 空信息 -->
              <div class="item-message item-empty" v-if="record.messages && record.messages.length == 0">
                <div class="dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>

          </div>
          <div class="item-tools">
            <a-button shape="circle" title="Copy" class="btn btn-tools" @click="copyMessage(record.messages[0].data)">
              <i class="fa-solid fa-copy"></i>
            </a-button>
            <a-button shape="circle" title="Regenerate" class="btn btn-tools">
              <i class="fa-solid fa-arrows-rotate"></i>
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 信息输入 -->
    <div class="box-footer" v-if="props.configs.activeInput">
      <div class="box-input">
        <input type="text" v-model="chatInfos.message" @keydown.enter="sendMessage" placeholder="Message here..." />
        <a-button shape="circle" class="btn btn-tools" @click="sendMessage">
          <i class="fa-solid fa-envelope"></i>
        </a-button>
      </div>
    </div>

    <!-- 滚动按钮 -->
    <div class="box-top">
      <a-button shape="circle" title="Scroll to top" class="btn btn-tools" @click="scrollTo('top', true)">
        <i class="fa-solid fa-arrow-up"></i>
      </a-button>
      <a-button shape="circle" title="Scroll to bottom" class="btn btn-tools" @click="scrollTo('bottom', true)">
        <i class="fa-solid fa-arrow-down"></i>
      </a-button>
      <a-button shape="circle" title="Clear Chat" class="btn btn-tools" @click="clearChat()">
        <i class="fa-solid fa-brush"></i>
      </a-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import url(chat.scss);
</style>
