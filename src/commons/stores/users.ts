import { defineStore } from 'pinia'
import type { UserInfos } from '../datas/datas.types'

export const useUserInfosStore = defineStore('userInfos', {
  state(): { userInfos: UserInfos } {
    return {
      userInfos: {
        num: '',
        name: '',
        ntAccount: '',
        email: '',
        roles: null
      }
    }
  },
  actions: {
    refresh(values: UserInfos) {
      this.userInfos = Object.assign(this.userInfos, values)
    },
    clear() {
      this.userInfos = {
        num: '',
        name: '',
        ntAccount: '',
        email: '',
        roles: null
      }
    }
  }
})
