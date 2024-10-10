<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Ref } from 'vue'

import { useI18n } from 'vue-i18n'

import { useLoadingStore } from '@/commons/stores/index'
const loadingStore = useLoadingStore()
const loadingStatus = computed(() => loadingStore.status)

import { useUserInfosStore } from '@/commons/stores/index'
const userInfosStore = useUserInfosStore()

import { useSystemInfosStore } from '@/commons/stores/index'
const systemStore = useSystemInfosStore()
const headerStatus = computed(() => systemStore.systemInfos.headerStatus)
const theme = computed(() => systemStore.systemInfos.theme)

import { usePageGo } from '@/commons/composables/routers'
const { pageGo } = usePageGo()

import * as systemDB from '@/commons/datas/datas.system'
import layout from '@/components/layouts/layout-platform.vue'

import * as extend from '@/commons/utils/extends'
import * as messageBox from '@/commons/utils/messages'
import * as current from './views/login/login.service'

onMounted(() => {
  // 设置语言，默认en
  let lang = extend.LocalStore.get('lang')
  locale.value = lang ? lang : 'en'

  //
  const theme = extend.LocalStore.get('theme')
  themesStatus.value = theme == 'default'
  setTheme(theme)

  // 检测token
  let token = extend.LocalStore.get('token')
  if (token && token != '') {
    // 如果有token则加载用户信息和菜单
    getinfosUser()
    jumpHome()
  } else {
    getlistMenus()
  }
})

// 语言
const { locale } = useI18n()
const changeLanguage = (lang: string) => {
  locale.value = lang
  //
  extend.LocalStore.set('lang', lang)
}

//
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
  systemStore.setTheme(theme)
}

// 用于后续统一跳转主页
const jumpHome = () => {
  pageGo('/home')
}

// 菜单数据
let menus: Ref<any[]> = ref([])
// 获取用户
const getinfosUser = () => {
  // 先获取用户信息
  loadingStore.loading()
  current.getinfosUser().then(
    (resp: any) => {
      loadingStore.end()
      //
      let { isSuccess, data, message } = resp
      if (isSuccess) {
        // 存储用户单例
        userInfosStore.refresh({
          num: data.sapPNR,
          ntAccount: data.ntAccount,
          name: data.lastName + ' ' + data.firstName,
          email: data.email,
          deptName: data.department,
          roles: data.roles
        })
        // 刷新菜单
        getlistMenus()
      } else {
        messageBox.showError(message)
      }
    },
    (error: any) => {
      loadingStore.end()
      //
      console.log('Testing: ', error)
      logout()
    }
  )
}
// 获取菜单
const getlistMenus = () => {
  menus.value = [...systemDB.menus]
}
// 注销
const logout = () => {
  clearSystem()
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

// 在其他页面也可以调用
;(window as any).eventBus = {
  getinfosUser,
  //
  jumpHome,
  //
  clearSystem,
  logout
}
</script>

<template>
  <layout :datas="menus" :status="headerStatus">
    <!-- Logo -->
    <template #logos>
      <img
        class="logo"
        :src="`/systems/bosch/bosch_logo${theme == 'default' ? '' : '-white'}.png`"
        alt=""
        srcset=""
        @click="pageGo('/home')"
      />
    </template>
    <template #logos-mini>
      <img
        class="logo-mini"
        src="/systems/bosch/bosch.png"
        alt=""
        srcset=""
        @click="pageGo('/home')"
      />
    </template>
    <!-- Right -->
    <template #infos>
      <!-- 主题 -->
      <div class="themes">
        <a-switch
          v-model:checked="themesStatus"
          checked-children="亮"
          un-checked-children="暗"
          @change="toggleThemes"
        />
      </div>
      <!-- 语言 -->
      <div class="langs">
        <img
          class="img-lan"
          :src="`/systems/lan/lan-${locale}.png`"
          @click="changeLanguage(locale == 'zh' ? 'en' : 'zh')"
        />
      </div>
      <!-- 用户 -->
      <a-dropdown class="users">
        <a class="ant-dropdown-link" @click.prevent>
          <i class="fa-solid fa-user"></i>
          <span>{{ userInfosStore.userInfos.name }}</span>
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
  </layout>
  <div class="loading" v-if="loadingStatus"></div>
</template>

<style scoped lang="scss"></style>
