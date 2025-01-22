import { defineStore } from 'pinia'
import { Modal } from 'ant-design-vue'

import type { SystemInfos } from '../datas/datas.types'

export const useSystemInfosStore = defineStore('systemInfos', {
  state(): { systemInfos: SystemInfos; systemStatus: any } {
    return {
      systemInfos: {
        name: 'System Name',
        //
        autoSSO: false,
        clientID: 'ec12a58c-3742-415a-bf6e-7116beb38af6',
        tenant:
          'https://login.microsoftonline.com/0ae51e19-07c8-4e4b-bb6d-648ee58410f4/oauth2/v2.0/authorize'
      },
      systemStatus: {
        headerShow: true,
        theme: 'default',
        logoutShow: false
      }
    }
  },
  actions: {
    setHeader(status: boolean) {
      this.systemStatus.headerShow = status
    },
    setTheme(theme: string) {
      this.systemStatus.theme = theme
    },
    //
    showLogout(callback: Function) {
      if (!this.systemStatus.logoutShow) {
        this.systemStatus.logoutShow = true
        //
        Modal.warning({
          title: 'Authentication Required',
          content: 'You will be redirected to the Login page.',
          onOk: () => {
            this.systemStatus.logoutShow = false
            //
            callback()
          }
        })
      }
    }
  }
})
