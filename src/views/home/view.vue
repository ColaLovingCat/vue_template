<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import draggable from 'vuedraggable'

const drag = ref(false)
const pageInfos = reactive({
  pending: [
    { id: "1", name: 'AA', status: 'pending' },
    { id: "2", name: 'BB', status: 'pending' },
    { id: "3", name: 'CC', status: 'pending' },
    { id: "4", name: 'CC', status: 'pending' },
    { id: "5", name: 'CC', status: 'pending' },
    { id: "6", name: 'CC', status: 'pending' },
    { id: "7", name: 'CC', status: 'pending' },
    { id: "8", name: 'CC', status: 'pending' },
    { id: "9", name: 'CC', status: 'pending' },
    { id: "10", name: 'CC', status: 'pending' },
    { id: "11", name: 'CC', status: 'pending' },
    { id: "12", name: 'CC', status: 'pending' },
    { id: "13", name: 'CC', status: 'pending' },
  ],
  ongoing: [],
  closed: [],
})
const onDragEnd = (event: any) => {
  let status = event.to.dataset.id
  let itemID = event.item.dataset.id
  console.log('Testing: ', status, itemID)
  drag.value = false
}

const showModal = (action: string, values: any) => {

}
</script>

<template>
  <div class="box-contents">
    <div class="box-task">
      <div class="title">Pending</div>
      <draggable data-id="pending" class="list-task" v-model="pageInfos.pending" group="task" @start="drag = true"
        @end="onDragEnd" item-key="id">
        <template #item="{ element }">
          <div :data-id="element.id" class="task-item">{{ element.name }}</div>
        </template>
        <template #footer>
          <button class="btn btn-secondary" @click="showModal('add', {})">
            <i class="fa-solid fa-plus"></i>
            Add
          </button>
        </template>
      </draggable>
    </div>
    <div class="box-task">
      <div class="title">On-going</div>
      <draggable data-id="ongoing" class="list-task" v-model="pageInfos.ongoing" group="task" @start="drag = true"
        @end="onDragEnd" item-key="id">
        <template #item="{ element }">
          <div :data-id="element.id" class="task-item">{{ element.name }}</div>
        </template>
      </draggable>
    </div>
    <div class="box-task">
      <div class="title">Closed</div>
      <draggable data-id="closed" class="list-task" v-model="pageInfos.closed" group="task" @start="drag = true"
        @end="onDragEnd" item-key="id">
        <template #item="{ element }">
          <div :data-id="element.id" class="task-item">{{ element.name }}</div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scoped lang="scss">
.box-contents {
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  column-gap: 15px;

  .box-task {
    width: 400px;
    height: 100%;

    .title {
      padding: 6px 12px 6px 12px;
      color: #172b4d;
      font-size: 14px;
      font-weight: 700;
      line-height: 20px;
    }
  }
}

.list-task {
  padding: 20px;
  min-height: 50px;
  overflow-y: auto;
  background: #f1f2f4;
  display: flex;
  flex-direction: column;
  row-gap: 10px;

  .task-item {
    padding: 12px;
    border-radius: 8px;
    background: #fff;
  }
}
</style>
