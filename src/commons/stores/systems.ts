import { defineStore } from 'pinia'
import type { SystemInfos } from '../datas/datas.types'

export const useSystemInfosStore = defineStore('systemInfos', {
  state(): { systemInfos: SystemInfos } {
    return {
      systemInfos: {
        name: 'System Name',
        //
        autoSSO: false,
        clientID: 'ec12a58c-3742-415a-bf6e-7116beb38af6',
        tenant:
          'https://login.microsoftonline.com/0ae51e19-07c8-4e4b-bb6d-648ee58410f4/oauth2/v2.0/authorize',
        //
        headerStatus: true,
        theme: 'default'
      }
    }
  },
  actions: {
    setHeader(status: boolean) {
      this.systemInfos.headerStatus = status
    },
    setTheme(theme: string) {
      this.systemInfos.theme = theme
    }
  }
})
