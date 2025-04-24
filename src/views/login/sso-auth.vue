<script lang="ts" setup>
import { onMounted } from 'vue'

import { useRouter } from 'vue-router'
const routers = useRouter()

import { useLoadingStore } from '../../commons/stores/index'
const loadingStore = useLoadingStore()

import * as extend from '../../commons/utils/extends'
import * as meessageBox from '../../commons/utils/messages'
import * as login from './login.service'

onMounted(() => {
  let params = extend.ExWeb.params()
  if (params.code) {
    loadingStore.loading()
    //
    const redirectUrl = extend.ExWeb.url().server + '/sso-auth'
    let param = {
      code: params.code,
      redirectUrl
    }
    login.checkCode(param).then(
      (resp: any) => {
        loadingStore.end()
        //
        const { isSuccess, message } = resp
        if (isSuccess) {
          extend.LocalStore.set('token', message)
          ;(window as any).eventBus.getinfosUser()
          //
          if (params.state) {
            let path = decodeURIComponent(decodeURIComponent(params.state))
            routers.push({
              path
            })
          } else {
            ;(window as any).eventBus.jumpHome()
          }
        } else {
          meessageBox.showError(message)
        }
      },
      (err: any) => {
        loadingStore.end()
        //
        meessageBox.showError(err)
      }
    )
  }
})
</script>

<template>
  <div class="sections">{{ $t('system.login.ssoing') }}</div>
</template>

<style scoped>
.sections {
  font-size: 35px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
