import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state() {
    return {
      _count: 0
    }
  },
  getters: {
    status: (state) => state._count > 0
  },
  actions: {
    set(value: boolean) {
      this._count = value ? 1 : 0
    },
    loading() {
      this._count++
    },
    end() {
      if (this._count > 0) this._count--
    },
    clear() {
      this.set(false)
    }
  }
})
