<script lang="ts">
import { ref, defineComponent, computed, watch } from 'vue'

import menuItem from './menu-item.vue'
import type { MenuInfos } from '@/commons/datas/datas.types'

export default defineComponent({
  props: {
    datas: {
      type: Array as () => Array<MenuInfos>,
      default: () => []
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  components: { menuItem },
  emits: [],
  setup(props, { emit }) {
    const current = ref<string[]>(['mail'])

    const headerStatus = computed(() => props.status)

    const menus = ref(props.datas)
    watch(
      () => props.datas,
      (newValue, oldValue) => {
        menus.value = newValue
      }
    )

    return {
      menus,
      headerStatus,
      current
    }
  }
})
</script>

<template>
  <a-layout class="pages">
    <a-layout-header class="page-header" v-if="headerStatus">
      <div class="headers">
        <div class="logos">
          <slot name="logos"></slot>
        </div>
        <div class="menus menus-inline">
          <a-menu v-model:selectedKeys="current" mode="horizontal">
            <template v-for="item in menus" :key="item.id">
              <menuItem :item="item"> </menuItem>
            </template>
          </a-menu>
        </div>
        <div class="infos">
          <slot name="infos"></slot>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content class="page-contents" :class="headerStatus ? '' : 'full'">
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<style scoped lang="scss"></style>
