<script lang="ts" setup>
import { onMounted, ref, reactive, computed, watch } from 'vue'

//@ts-ignore
import { GridLayout, GridItem } from 'vue3-grid-layout';

interface LayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  component: string
  datas: any
}

// name
defineOptions({
  name: 'comp-grid'
})

// props
const props = defineProps({
  configs: {
    type: Object,
    require: true,
    default: () => ({
      canEdit: false,
    }),
  },
  layouts: {
    type: Array<LayoutItem>,
    require: true,
    default: () => ([]),
  },
  componentMap: {
    type: Object as () => Record<string, any>,
    required: true
  }
})

onMounted(() => { })
</script>

<template>
  <GridLayout :layout="layouts" :col-num="4" :row-height="100" :is-draggable="configs.canEdit"
    :is-resizable="configs.canEdit" :vertical-compact="true" :margin="[10, 10]" :use-css-transforms="true">
    <GridItem v-for="item in layouts" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
      <div class="card-widget">
        <component :is="componentMap[item.component]" v-bind="item.datas" />
      </div>
    </GridItem>
  </GridLayout>
</template>

<style scoped lang="scss">
.card-widget {
  padding: 10px;
  height: 100%;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
