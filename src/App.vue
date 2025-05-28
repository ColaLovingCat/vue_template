<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import type { Ref } from 'vue'
import eventBus from '@/commons/utils/eventBus'

import { useLoadingStore } from '@/commons/stores/index'
const loadingStore = useLoadingStore()
const loadingStatus = computed(() => loadingStore.status)

import { useUserInfosStore } from '@/commons/stores/index'
const userInfosStore = useUserInfosStore()

import { useSystemInfosStore } from '@/commons/stores/index'
const systemInfosStore = useSystemInfosStore()
const headerStatus = computed(() => systemInfosStore.systemStatus.headerShow)
const theme = computed(() => systemInfosStore.systemStatus.theme)

import * as systemDB from '@/commons/datas/datas.system'
import layoutView from '@/components/layouts/layout.vue'

import * as extend from '@/commons/utils/extends'
import * as messageBox from '@/commons/utils/messages'
import * as current from './views/login/login.service'

onMounted(async () => {
  // 清除所有的loading状态
  loadingStore.clear()

  // 设置语言，默认en
  let lang = extend.LocalStore.get('lang')
  locale.value = lang ? lang : 'en'

  // 设置主题
  let theme = extend.LocalStore.get('theme')
  theme = theme ? theme : 'default'
  //
  themesStatus.value = theme == 'default'
  setTheme(theme)

  // SSO配置
  if (systemInfosStore.systemInfos.azure == 'request') {
    // 从后台获取获取
    await getinfosAzure()
  }

  // 检测token
  let token = extend.LocalStore.get('token')
  console.log('[App] token: ', token)
  if (token && token != '') {
    // 如果有token则加载用户信息和菜单
    getinfosUser()
    jumpHome()
  }

  // 注册全局方法
  eventBus.on('getinfosUser', getinfosUser)
  eventBus.on('jumpHome', jumpHome)
  eventBus.on('clearSystem', clearSystem)
  eventBus.on('logout', logout)
})

onUnmounted(() => {
  // 注销全局方法
  eventBus.off('getinfosUser', getinfosUser)
  eventBus.off('jumpHome', jumpHome)
  eventBus.off('clearSystem', clearSystem)
  eventBus.off('logout', logout)
})

// 语言
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const changeLanguage = (lang: string) => {
  locale.value = lang
  //
  extend.LocalStore.set('lang', lang)
}

// 主题
const themesStatus = ref(true)
const toggleThemes = () => {
  const theme = themesStatus.value ? 'default' : 'dark'
  setTheme(theme)
}
const setTheme = (theme: string) => {
  // css样式
  document.documentElement.setAttribute('data-theme', theme)
  // 全局状态
  extend.LocalStore.set('theme', theme)
  systemInfosStore.setTheme(theme)
}

const getinfosAzure = async () => {
  let resp: any = await current.getinfosAzure()
  const { status, data } = resp;
  if (status) {
    console.log('[App] azure: ', data)
    systemInfosStore.setAzure({
      host: data.host,
      client_id: data.clientID,
      scope: data.scope,
      response_type: data.responseType,
    })
  }
}

// 菜单数据
let menus: Ref<any[]> = ref([])
// 获取用户和菜单
const getinfosUser = async () => {
  loadingStore.loading()
  try {
    // 先获取用户信息
    const resp: any = await current.getinfosUser()
    const { status, data, message } = resp
    if (status) {
      userInfosStore.refresh({ ...data })
      console.log('[App] user: ', userInfosStore.userInfos)
    } else {
      messageBox.showError(message)
    }
  } catch (error) {
    console.error('[App] error:', error)
    logout()
  } finally {
    loadingStore.end()
    // 后刷新菜单
    getlistMenus()
  }
}
// 获取菜单
const getlistMenus = () => {
  menus.value = [...systemDB.menus]
}

// 用于后续统一跳转主页
const jumpHome = () => {
  pageGo('/home')
}

// 注销
const logout = () => {
  clearSystem()
  console.log('[App] user: ', 'log out')
  pageGo('/login', {
    type: 'logout'
  })
}
const clearSystem = () => {
  // 清除用户信息
  extend.LocalStore.delete('token')
  userInfosStore.clear()
  // 清除菜单
  menus.value = []
}

// 跳转
import { useRouter } from 'vue-router'
const router = useRouter()
const pageGo = (path: string, query: any = {}) => {
  router.push({
    path,
    query
  })
}
</script>

<template>
  <layoutView :datas="menus" :status="headerStatus">
    <!-- Logo -->
    <template #logos>
      <img class="logo" :src="`/systems/logos/bosch_logo${theme == 'default' ? '' : '-white'}.png`" alt="" srcset=""
        @click="pageGo('/home')" />
    </template>
    <template #logos-mini>
      <img class="logo-mini" src="/systems/logos/bosch.png" alt="" srcset="" @click="pageGo('/home')" />
    </template>
    <!-- Right -->
    <template #infos>
      <!-- 主题 -->
      <div class="themes">
        <a-switch v-model:checked="themesStatus" checked-children="亮" un-checked-children="暗" @change="toggleThemes" />
      </div>
      <!-- 语言 -->
      <div class="langs">
        <img class="img-lan" :src="`/systems/lan/lan-${locale}.png`"
          @click="changeLanguage(locale == 'zh' ? 'en' : 'zh')" />
      </div>
      <!-- 用户 -->
      <a-dropdown class="users">
        <a class="ant-dropdown-link" @click.prevent>
          <i class="fa-solid fa-user"></i>
          <span>{{ userInfosStore.userInfos.username }}</span>
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item key="0" @click="logout">
              <i class="fa-solid fa-power-off"></i>
              <span>{{ $t('system.logout') }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </layoutView>
  <div class="loading" v-if="loadingStatus"></div>
</template>

<style scoped lang="scss"></style>