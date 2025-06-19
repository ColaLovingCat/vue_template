import { defineStore } from 'pinia'
import type { UserInfos } from '../types/datas.types'

export const useUserInfosStore = defineStore('userInfos', {
  state(): { userInfos: UserInfos } {
    return {
      userInfos: {
        userno: '',
        username: '',
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
        userno: '',
        username: '',
        ntAccount: '',
        email: '',
        roles: null
      }
    }
  }
})
