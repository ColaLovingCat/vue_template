<script setup lang="ts">
import { useRouter } from 'vue-router'
const routers = useRouter()
const pageGo = (path: string, query: any = {}) => {
  routers.push({
    path,
    query
  })
}

fetch('/api/user/list').then((resp: any) => {
  console.log('Testing: ', resp)
})
</script>

<template>
  <div class="sections">
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
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  .menu-item {
    cursor: pointer;
    padding: 20px;
    width: 300px;
    font-size: 21px;

    &:hover {
      background: #f0f0f0;
    }
  }
}
</style>
