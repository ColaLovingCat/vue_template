import { createApp } from 'vue'
import App from './App.vue'

// 自定义样式
import './styles.scss'
// 图标库
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

// 导入语言文件
import { createI18n } from 'vue-i18n'
import en from '@/assets/locales/en.json'
import zh from '@/assets/locales/zh.json'
const i18n = createI18n({
  locale: 'zh', // 默认语言
  legacy: false, // 支持 Composition API
  globalInjection: true, // 全局注册$t方法
  messages: {
    en,
    zh
  }
})
app.use(i18n)

// pinia
import { createPinia } from 'pinia'
const pinia = createPinia()
// 持久化存储
import { createPersistedState } from 'pinia-plugin-persistedstate'
pinia.use(
  createPersistedState({
    auto: true
  })
)
// 重写 $reset 方法 => 解决组合式api中无法使用问题
pinia.use(({ store }) => {
  const initialState = JSON.parse(JSON.stringify(store.$state))
  store.$reset = () => {
    store.$patch(initialState)
  }
})
app.use(pinia)

// router
import router from './router/index'
app.use(router)

app.mount('#app')
