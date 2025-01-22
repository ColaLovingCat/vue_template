<script lang="ts" setup>
import { onMounted } from 'vue'

import { useSystemInfosStore } from '@/commons/stores/index'
const systemStore = useSystemInfosStore()

import * as extend from '@/commons/utils/extends'

// name
defineOptions({
  name: 'app-contents'
})

onMounted(() => {
  // 每当有路由切换时，都会触发
  let token = extend.LocalStore.get('token')
  if (token && token != '') {
    // 有token
  } else {
    systemStore.showLogout(() => {
      ;(window as any).eventBus.logout()
    })
  }
})
</script>

<template>
  <router-view></router-view>
</template>

<style scoped lang="scss"></style>
