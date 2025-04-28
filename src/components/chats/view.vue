<script lang="ts" setup>
import { ref, reactive, onMounted, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'

import * as extend from '@/commons/utils/extends'
import * as messages from '@/commons/utils/messages'

import { WebSocketService } from '@/commons/utils/websocket'
import chartView from '@/components/echarts/view.vue'

//@ts-ignore
import MarkdownIt from 'markdown-it'
import 'katex/dist/katex.min.css'
//@ts-ignore
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const debug = true

interface ChatRecord {
  // id: string // 用于标记
  connectionID: string
  //
  name: string
  isBot: boolean
  //
  messages: {
    type: string
    data: any
  }[],
  suggests?: string[]
  think?: {
    isThinking: boolean
    content: string
    isShow: boolean
  } | null
}

// 富文本格式化
const md = new MarkdownIt({
  highlight: function (str: string, lang: any) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {/** empty **/ }
    }
    return md.utils.escapeHtml(str);
  },
});
md.renderer.rules.fence = (tokens: any, idx: any) => {
  const token = tokens[idx];
  const language = token.info ? token.info : "";
  const highlightedCode = md.options.highlight
    ? md.options.highlight(token.content, token.info)
    : md.utils.escapeHtml(token.content);

  return `
    <div class="code-block">
      <span class="code-type">#${language}</span>
      <button class="code-copy">Copy</button>
      <pre class="hljs language-${language}"><code>${highlightedCode}</code></pre>
    </div>
  `;
};
document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("code-copy")) {
    const codeElement = target.nextElementSibling?.querySelector("code");
    if (codeElement) {
      navigator.clipboard.writeText(codeElement.innerText).then(() => {
        target.innerText = "Copied";
        setTimeout(() => (target.innerText = "Copy"), 1500);
      });
    }
  }
});
//
md.renderer.rules.table_open = () => '<table class="table">\n';
md.renderer.rules.heading_open = (tokens: any, idx: any) => {
  const tag = tokens[idx].tag;
  return `<${tag} class="chat-txt">`;
};

// 监听页面的滚动
const container: Ref<any> = ref(null)
const scrollTo = (action: string = 'bottom', force: boolean = false) => {
  // 强制滚动
  if (force) chatInfos.isAutoScroll = true

  if (chatInfos.isAutoScroll) {
    requestAnimationFrame(() => {
      container.value?.scrollTo({ top: action == 'bottom' ? container.value.scrollHeight : 0, behavior: "smooth" });
    });
  }
}
const handleUserScroll = () => {
  chatInfos.isAutoScroll = false;
};

// name
defineOptions({
  name: 'app-chat'
})
// emits
const emit = defineEmits<{
  (event: 'sended', values: any): void // 发送信息后触发外部方法
  (event: 'received', values: any): void // 回答已接收完
  (event: 'cleared', values: any): void
  (event: 'clickItem', values: any): void // 点击了某一元素 table|chart
  (event: 'update:thread_id', values: any): void // 点击了某一元素 table|chart
}>()
// props
const props = defineProps({
  configs: {
    type: Object,
    default: () => {
      return {
        activeInput: true,
        limit: 5,
      }
    }
  },
  thread_id: {
    type: String,
    default: ''
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
  isActive: boolean,
  //
  thread_id: string,
  connectionID: string,
  botName: string,
  //
  message: string,
  messages: ChatRecord[]
  isAutoScroll: boolean,
  //
  // limit: number,
  count: number,
  timer: any,
  //
  isThinking: boolean,
} = reactive({
  // wb状态
  host: 'wss://szhlinvma75.apac.bosch.com:59108/',
  isActive: false,
  //
  thread_id: '', // 聊天的唯一ID，可以连接上下文
  connectionID: '', // 当前对话的ID
  botName: '小博',
  //
  message: '',
  messages: [],
  isAutoScroll: true,  // 是否自动滚动
  // 计时器
  // limit: 5,
  count: 0,
  timer: null,
  //
  isThinking: false,
})

let wss: WebSocketService | null = null;
onMounted(async () => {
  // 生成唯一ID
  chatInfos.thread_id = extend.ExString.uuid()
  emit('update:thread_id', chatInfos.thread_id);
  if (debug) console.log('[Chat] thread_id:', chatInfos.thread_id)

  // 启用websocket服务
  wss = new WebSocketService(chatInfos.host, receiveMessage,
    () => {
      chatInfos.isActive = true
    }, (status: boolean) => {
      chatInfos.isActive = false
    })
  wss.connect()
})
onUnmounted(() => {
  // 结束聊天
  endChat()

  // 断开websocket
  if (wss) {
    wss.close()
  }
})

const sleep = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))
// 监听到父元素的信息，并且展示
watch(
  () => props.changeMark,
  async () => {
    if (props.record) {
      if (debug) console.log('[Chat] watch: ', props.record)
      let record: any = { ...props.record }
      //
      switch (record.action) {
        // 提示信息
        case 'tips': {
          chatInfos.messages.push(record)
          break
        }
        // 将外部的文本处理成流式
        case 'flows': {
          const text = record.messages[0].data
          //
          record.messages = [
            {
              type: 'loading'
            }
          ]
          chatInfos.messages.push(record)
          //
          const words = text.split(" ");
          for (const word of words) {
            pushText({
              connectionID: record.connectionID,
              text: word + ' '
            })
            await sleep(200)
          }
          break
        }
        // 外部直接提问
        case 'question': {
          sendDirect(record.messages)
          break
        }
        // 等待回答
        case 'waiting': {
          chatInfos.messages.push(record)
          // 记录下当前的 connectionID
          chatInfos.connectionID = record.connectionID
          // 替换问题的临时id
          let q = chatInfos.messages.find((a: any) => a.connectionID == record.messages[0].data)
          if (q) q.connectionID = chatInfos.connectionID
          // 开始计时
          if (props.configs.limit > 0) {
            startTimer()
          }
          break
        }
        // 外部的接口出现报错
        case 'error': {
          pushError()
          break
        }
        default: {
          break
        }
      }
      //
      chatInfos.isAutoScroll = true
      scrollTo('bottom')
    }
  }
)
watch(() => props.thread_id, (newValue) => {
  chatInfos.thread_id = newValue;
});

// Send
// 发送信息
const sendMessage = (event?: KeyboardEvent) => {
  if (event) event.preventDefault();

  // 是否连接正常
  if (!chatInfos.isActive) {
    messages.showError("the connection to the Websocket was lost!")
    return false
  }

  // 是否有其他聊天正在继续
  if (chatInfos.connectionID != '') {
    if (debug) console.log('[Chat] another conversation wait')
    messages.showInfo(
      'Another conversation is currently in progress. Please wait until it is completed.'
    )
    return false
  }

  chatInfos.isAutoScroll = true
  const message = chatInfos.message
  if (message != '') {

    // 对话的临时id
    let id = extend.ExString.uuid()
    // 将发送的文本送入聊天窗口
    chatInfos.messages.push({
      connectionID: id,
      name: 'You',
      isBot: false,
      messages: [
        {
          type: 'text',
          data: message
        }
      ]
    })
    // 通知外部已开始对话
    emit('sended', {
      id,
      thread_id: chatInfos.thread_id,
      message,
    })
    //
    chatInfos.message = ''
  } else {
    messages.showError('please input something')
  }
}

// 录音
const voiceInfos: any = reactive({
  show: false,
  count: 0,
  timer: null
})
const startRecord = () => {
  voiceInfos.show = !voiceInfos.show
  //
  if (voiceInfos.show) {
    voiceInfos.count = 0
    voiceInfos.timer = setInterval(() => {
      voiceInfos.count++
    }, 1000);
  } else {
    voiceInfos.count = 0
    clearInterval(voiceInfos.timer)
    voiceInfos.timer = null
    //
    sendAudio()
  }

}
const sendAudio = () => {
  messages.showInfo("暂未开放")
}

// 上传文件
const upload = () => {
  messages.showInfo("暂未开放")
}

// 复制信息
const copyToClipboard = async (message: any) => {
  try {
    await navigator.clipboard.writeText(message);
    messages.showInfo('The information has been copied to the clipboard.')
  } catch (err) {
    console.error("复制失败:", err);
  }
};
// 重新生成该问题
const regenerate = (values: any) => {
  if (debug) console.log('[Chat] regenerate')
  const connectionID = values.connectionID
  const message = values.messages[0].data
  //
  for (let i = chatInfos.messages.length - 1; i >= 0; i--) {
    if (chatInfos.messages[i].connectionID === connectionID) {
      chatInfos.messages.splice(i, 1);
    }
  }
  //
  sendDirect(message)
}
// 直接提问
const sendDirect = (message: any) => {
  if (debug) console.log('[Chat] send directly')
  chatInfos.message = message
  sendMessage()
}

// 计时器
const startTimer = () => {
  // 已经在计时了
  if (chatInfos.timer) return;

  chatInfos.count = 0
  chatInfos.timer = setInterval(() => {
    chatInfos.count++
    if (debug) console.log('[Chat] timer:', chatInfos.count)

    // 已超时
    if (chatInfos.count > props.configs.limit) {
      if (debug) console.log('[Chat] clear timer with timeout')
      messages.showError('The conversation has timed out')
      outTimer()
    }
  }, 1000)
}
// 已超时
const outTimer = () => {
  if (debug) console.log('[Timer] timeout')
  let loadingChat = chatInfos.messages.find((a: any) => a.connectionID == chatInfos.connectionID && a.isBot)
  if (loadingChat) {
    // 清除loading元素
    loadingChat.messages = loadingChat.messages.filter((item: any) => item.type !== 'loading')
    loadingChat.messages = [
      ...loadingChat.messages,
      {
        type: 'text',
        data: 'server is busy, please try again later.'
      }
    ]
  }
  // 结束对话
  if (debug) console.log('[Chat] end with timeout')
  endChat()
}
// 清除超时计时器
const clearTimer = () => {
  chatInfos.count = 0
  clearInterval(chatInfos.timer)
  chatInfos.timer = null
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
    emit('update:thread_id', chatInfos.thread_id);
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

// Receive
// 处理回复信息
const receiveMessage = (msg: any): any => {
  if (chatInfos.connectionID == msg.connectionID) {
    // 重置当前计时器
    if (chatInfos.timer) {
      clearTimer()
      if (debug) console.log('[Chat] clear timer with receive')
      // chatInfos.count = 0
      // if (debug) console.log('[Chat] reset timer with receive')
    }

    let remarks = JSON.parse(msg.remarks)
    switch (msg.category) {
      case 'text': {
        // 思考开始
        if (msg.message == '<think>') {
          chatInfos.isThinking = true
          return false
        }
        // 思考结束
        if (msg.message == '</think>') {
          chatInfos.isThinking = false
          endThinking(msg.connectionID)
          return false
        }

        if (chatInfos.isThinking) {
          pushThinking({
            connectionID: msg.connectionID,
            message: msg.message
          })
        } else {
          if (remarks.paragraph_start) {
            pushMessage({
              connectionID: msg.connectionID,
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
              connectionID: msg.connectionID,
              text: msg.message
            })
          }
        }
        break
      }
      default: {
        pushMessage({
          connectionID: msg.connectionID,
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
          connectionID: msg.connectionID,
          messages: [
            {
              type: 'error',
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
        connectionID: msg.connectionID,
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
}

// 接收信息
const pushMessage = (values: any) => {
  const { connectionID, messages } = values
  let temp = chatInfos.messages.find((a: any) => a.connectionID == connectionID && a.isBot)
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
  const { connectionID, text } = values
  let temp = chatInfos.messages.find((a: any) => a.connectionID == connectionID && a.isBot)
  if (temp) {
    // 清除loading元素
    temp.messages = temp.messages.filter((item: any) => item.type !== 'loading')
    // 检查是否最后的类型是text，不是则补充一个新的
    let latestMessage = temp.messages[temp.messages.length - 1]
    if (latestMessage && latestMessage.type == 'text') {
      latestMessage.data += text
    } else {
      temp.messages.push({
        type: 'text',
        data: text
      })
    }
    //
    scrollTo('bottom')
  }
}
//
const pushThinking = (values: any) => {
  const { connectionID, message } = values
  let temp = chatInfos.messages.find((a: any) => a.connectionID == connectionID && a.isBot)
  if (temp) {
    if (temp.think) {
      temp.think.content += message
    } else {
      temp.think = {
        isThinking: true,
        content: message,
        isShow: true
      }
    }
  }
}
const endThinking = (connectionID: string) => {
  let temp = chatInfos.messages.find((a: any) => a.connectionID == connectionID && a.isBot)
  if (temp && temp.think) {
    temp.think.isThinking = false
    //
    if (checkEmpty(temp.think.content)) {
      temp.think = null
    }
  }
}
const checkEmpty = (str: string) => {
  const sWithoutNewlines = str.replace(/\n/g, '');
  return sWithoutNewlines.length === 0;
}
// Error
const pushError = () => {
  let messageInfos = {
    connectionID: '',
    name: chatInfos.botName,
    isBot: true,
    messages: [
      {
        type: 'error',
        data: 'server is busy, please try again later.'
      }
    ]
  }
  chatInfos.messages.push(messageInfos)
}

// 处理 Table
const tableClick = (column: string, row: any) => {
  emit('clickItem', {
    action: 'table',
    values: {
      column,
      row,
    }
  })
}

// 处理Chart
const chartClick = (event: any) => {
  emit('clickItem', {
    action: 'chart',
    values: event
  })
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
const getOptionForFPY = (values: any) => {
  let params = {
    title: values.Title,
    category: values.Category,
    First_Pass: formatFPY(values.First_Pass, values.parameter),
    Pseudo_Failure: formatFPY(values.Pseudo_Failure, values.parameter),
    Real_Failure: formatFPY(values.Real_Failure, values.parameter),
    FPY: formatFPY(values.FPY, values.parameter),
    FPY_Target: formatFPY(values.FPY_Target, values.parameter)
  }
  return {
    title: {
      text: params.title,
      top: 5,
      left: 'center'
    },
    grid: {
      bottom: 100
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
      data: params.category,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: [
      {
        type: 'value'
      },
      {
        type: 'value',
        min: 0,
        max: 1,
        axisLabel: {
          formatter: function (value: any) {
            return value * 100 + '%'
          }
        }
      }
    ],
    //
    series: [
      {
        type: 'bar',
        name: '1st Pass',
        stack: 'Failure',
        colr: '#92d050',
        data: params.First_Pass
      },
      {
        type: 'bar',
        name: 'Pseudo Failure',
        stack: 'Failure',
        colr: '#00b0f0',
        data: params.Pseudo_Failure
      },
      {
        type: 'bar',
        name: 'Real Failure',
        stack: 'Failure',
        colr: '#ff0000',
        data: params.Real_Failure
      },
      {
        type: 'line',
        name: 'FPY',
        colr: '#8064a2',
        yAxisIndex: 1,
        data: params.FPY
      },
      {
        type: 'line',
        name: 'FPY Target',
        colr: '#20ba66',
        yAxisIndex: 1,
        data: params.FPY_Target
      }
    ]
  }
}
const formatFPY = (arr: any, params: any) => {
  let result: any = []
  if (arr && arr.length > 0) {
    arr.map((item: any, index: number) => {
      result.push([index, item, params])
    })
  }
  return result
}

defineExpose({
  clearChat
})
</script>

<template>
  <div class="app-chat">
    <!-- 聊天窗口 -->
    <div class="chat-contents" ref="container" @wheel="handleUserScroll">
      <div class="list-chat">
        <div class="chat-item" v-for="record in chatInfos.messages" :key="record.connectionID"
          :class="record.isBot ? '' : 'item-user'">
          <div class="item-content">
            <div class="item-name">
              <div class="item-icon">🤖</div>
              <span>{{ record.name }}</span>
              <template v-if="record.think">
                <button type="button" class="btn-toggle" @click="record.think.isShow = !record.think.isShow">
                  <i class="fa-solid fa-atom"></i>
                  <span>{{ record.think.isThinking ? 'Thinking...' : 'Thought' }}</span>
                  <i v-if="!record.think.isShow" class="fa-solid fa-angle-down"></i>
                  <i v-if="record.think.isShow" class="fa-solid fa-angle-up"></i>
                </button>
              </template>
            </div>
            <div class="item-thinks" v-if="record.think">
              <p class="think-contents" v-if="record.think.isShow">{{ record.think.content }}</p>
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
                <template v-if="msg.type == 'error'">
                  <p class="item-error" v-html="md.render(msg.data)"></p>
                </template>
                <!-- 列表 -->
                <template v-if="msg.type == 'list'">
                  <div class="list-suggests">
                    <div class="suggest-item" v-for="item in msg.data" :key="item" @click="sendDirect(item)">
                      {{ item }} <i class="fa-solid fa-arrow-right"></i>
                    </div>
                  </div>
                </template>
                <!-- 表格 -->
                <template v-if="msg.type == 'table'">
                  <div class="box-table">
                    <table class="table">
                      <thead>
                        <tr>
                          <th v-for="th in msg.data.columns" :key="th.name">{{ th.name }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in msg.data.rows" :key="row.name">
                          <td v-for="column in msg.data.columns" :key="column.name" @click="tableClick(column, row)">
                            {{ row[column.name] }}
                          </td>
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
                  <div class="item-chart">
                    <chartView width="100%" height="300px" :options="getOptionBasic(msg.data)" @chartClick="chartClick">
                    </chartView>
                  </div>
                </template>
                <!-- Chart Pieces -->
                <template v-if="msg.type == 'chart_pieces'">
                  <div class="item-chart">
                    <chartView width="100%" height="300px" :options="getOptionPieces(msg.data)"
                      @chartClick="chartClick">
                    </chartView>
                  </div>
                </template>
                <!-- Chart FPY -->
                <template v-if="msg.type == 'chart_fpy'">
                  <div class="item-chart">
                    <div v-for="data in msg.data" :key="data">
                      <chartView width="500px" height="300px" :options="getOptionForFPY(data)" @chartClick="chartClick">
                      </chartView>
                    </div>
                  </div>
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
            <!-- Btns -->
            <div class="item-tools" v-if="!record.isBot">
              <a-tooltip placement="bottom">
                <template #title>Copy</template>
                <a-button shape="circle" class="btn btn-tools" @click="copyToClipboard(record.messages[0].data)">
                  <i class="fa-solid fa-copy"></i>
                </a-button>
              </a-tooltip>
              <a-tooltip placement="bottom">
                <template #title>Regenerate</template>
                <a-button shape="circle" class="btn btn-tools" @click="regenerate(record)">
                  <i class="fa-solid fa-arrows-rotate"></i>
                </a-button>
              </a-tooltip>
              <!-- <a-tooltip placement="bottom">
                <template #title>Edit Message</template>
                <a-button shape="circle" class="btn btn-tools">
                  <i class="fa-solid fa-pen-to-square"></i>
                </a-button>
              </a-tooltip> -->
            </div>
            <div class="item-tools" v-if="record.isBot">
              <!-- <a-tooltip placement="bottom">
                <template #title>Copy</template>
                <a-button shape="circle" class="btn btn-tools" @click="copyToClipboard(record.messages[0].data)">
                  <i class="fa-solid fa-copy"></i>
                </a-button>
              </a-tooltip> -->
              <!-- <a-tooltip placement="bottom">
                <template #title>Read aloud</template>
                <a-button shape="circle" class="btn btn-tools">
                  <i class="fa-solid fa-volume-high"></i>
                </a-button>
              </a-tooltip> -->
            </div>
            <!-- Suggests -->
            <div class="item-suggests">
              <div class="suggest-item" v-for="suggest in record.suggests" :key="suggest" @click="sendDirect(suggest)">
                {{ suggest }} <i class="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 信息输入 -->
    <div class="chat-footer" v-if="props.configs.activeInput">
      <div class="box-input">
        <div class="input">
          <a-textarea :autoSize="{ minRows: 1, maxRows: 4 }" v-model:value="chatInfos.message"
            @keydown.enter="sendMessage" placeholder="Message here..." />
        </div>
        <div class="btns">
          <div class="btns-left">
            <a-tooltip>
              <template #title>Upload files</template>
              <a-button shape="circle" class="btn btn-tools btn-upload" @click="upload">
                <i class="fa-solid fa-paperclip"></i>
              </a-button>
            </a-tooltip>
            <a-tooltip>
              <template #title>Upload images</template>
              <a-button shape="circle" class="btn btn-tools btn-upload" @click="upload">
                <i class="fa-solid fa-images"></i>
              </a-button>
            </a-tooltip>
          </div>
          <div class="btns-right">
            <a-popover v-model:open="voiceInfos.show" :title="`Recording: ${voiceInfos.count}s`" placement="leftBottom"
              trigger="click">
              <template #content>
                <div class="voice-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </template>
              <a-tooltip>
                <template #title>Voice input</template>
                <a-button shape="circle" class="btn btn-tools btn-speech" @click="startRecord">
                  <i class="fa-solid fa-microphone"></i>
                </a-button>
              </a-tooltip>
            </a-popover>
            <a-tooltip>
              <template #title>Send Message</template>
              <a-button shape="circle" class="btn btn-send" @click="sendMessage()"
                :disabled="chatInfos.message == ''">
                <i class="fa-solid fa-arrow-up"></i>
              </a-button>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- 滚动按钮 -->
    <div class="chat-top">
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
