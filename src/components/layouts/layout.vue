<script lang="ts">
import { ref, reactive, onMounted, defineComponent, computed, watch } from 'vue'

import menuItem from './menu-item.vue'

export default defineComponent({
  props: {
    menus: {
      type: Array as () => Array<any>,
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

    const menus = ref(props.menus)
    watch(
      () => props.menus,
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
            <template v-for="item in menus">
              <menuItem :item="item">
              </menuItem>
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
