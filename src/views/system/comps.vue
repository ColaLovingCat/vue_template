<script lang="ts" setup>
import { onMounted, ref, reactive, computed, watch } from 'vue'

import { useRouter } from 'vue-router'
const routers = useRouter()

// name
defineOptions({
  name: 'app-comps'
})

onMounted(() => { })

const pageGo = (path: string, query: any = {}) => {
  routers.push({
    path,
    query
  })
}

fetch('/api/user/list')
  .then((resp: any) => {
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    return resp.json();
  })
  .then((resp: any) => {
    console.log('[Mock] test: ', resp)
  })
  .catch(err => {
    console.error('Fetch 错误:', err);
  });
</script>

<template>
  <div class="list-menu">
    <div class="menu-item" @click="pageGo('/forms-using')">
      <i class="fa-solid fa-table-list"></i> forms
    </div>
    <div class="menu-item" @click="pageGo('/editors-using')">
      <i class="fa-solid fa-pen-to-square"></i> editors
    </div>
    <div class="menu-item" @click="pageGo('/echarts-using')">
      <i class="fa-solid fa-chart-line"></i> eCharts
    </div>
    <div class="menu-item" @click="pageGo('/chats-using')">
      <i class="fa-solid fa-comments"></i> chats
    </div>
    <div class="menu-item" @click="pageGo('/flips-using')">
      <i class="fa-solid fa-arrow-down-1-9"></i> flips
    </div>
    <div class="menu-item" @click="pageGo('/workflows-using')">
      <i class="fa-solid fa-diagram-project"></i> workflows
    </div>
    <div class="menu-item" @click="pageGo('/gsap-using')">
      <i class="fa-solid fa-diagram-project"></i> gsap
    </div>
    <div class="menu-item" @click="pageGo('/directives-using')">
      <i class="fa-solid fa-keyboard"></i> directives
    </div>
    <div class="menu-item" @click="pageGo('/extend-using')">
      <i class="fa-solid fa-infinity"></i> extend
    </div>
    <div class="menu-item" @click="pageGo('/users-manage')">
      <i class="fa-solid fa-users"></i> user manage
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-menu {
  padding: 50px 300px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;

  .menu-item {
    cursor: pointer;
    padding: 20px;
    width: 300px;
    font-size: 21px;
    border-radius: 10px;
    background: #f0f0f0;
  }
}
</style>
