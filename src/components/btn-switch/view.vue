<script lang="ts">
import { onMounted } from 'vue'
import { defineComponent, ref, watch } from 'vue'

interface DropItem {
  value: string | number
  label: string
}

export default defineComponent({
  props: {
    list: {
      type: Array<DropItem>,
      required: true
    },
    value: {
      type: [String, Number]
    }
  },
  // 声明组件将要触发的自定义事件
  emits: ['update:value', 'change'],
  setup(props, context) {
    const currentSelect = ref(props.value)
    const navActive = ref<HTMLElement | null>(null)
    const navHover = ref<HTMLElement | null>(null)

    onMounted(() => {
      console.log('Testing: ', props.value)
      setActive(props.value)
    })

    watch(
      () => props.value,
      (newValue, oldValue) => {
        currentSelect.value = newValue
        setActive(newValue)
      }
    )

    const setActive = (value: any) => {
      const liElement = document.getElementById(
        `item_${props.list.findIndex((i: any) => i.value === value)}`
      )
      if (liElement) {
        const { left, width } = liElement.getBoundingClientRect()
        if (navActive.value) {
          // 修改 opacity 样式
          navActive.value.style.opacity = '1'
          navActive.value.style.left = left + 'px'
          navActive.value.style.width = width + 'px'
        }
      }
    }

    const setHover = (event: any) => {
      const target = event.target as HTMLElement
      const parent = target.parentElement
      if (parent) {
        const { left, width } = parent.getBoundingClientRect()
        if (navHover.value) {
          // 修改 opacity 样式
          navHover.value.style.opacity = '1'
          navHover.value.style.left = left + 'px'
          navHover.value.style.width = width + 'px'
          navHover.value.classList.add('squeeze')
        }
      }
    }

    const hideHover = () => {
      if (navHover.value) {
        navHover.value.style.opacity = '0'
        navHover.value.classList.remove('squeeze')
      }
    }

    const changeSelect = (values: DropItem) => {
      currentSelect.value = values.value
      setActive(values.value)
      //
      context.emit('update:value', currentSelect.value)
      context.emit('change', currentSelect.value)
    }

    return {
      navActive,
      navHover,
      //
      setHover,
      hideHover,
      //
      currentSelect,
      changeSelect
    }
  }
})
</script>

<template>
  <ul class="list-nav">
    <li ref="navActive" class="nav-active"></li>
    <li ref="navHover" class="nav-hover"></li>
    <li
      v-for="(item, index) in list"
      :key="item.value"
      :id="`item_${index}`"
      :class="item.value == currentSelect ? 'active' : ''"
    >
      <a v-on:click="changeSelect(item)" @mouseover="setHover($event)" @mouseout="hideHover()">
        {{ item.label }}
      </a>
    </li>
  </ul>
</template>

<style scoped>
.list-nav {
  position: relative;
  padding: 5px;
  width: max-content;
  border: none;
  border-radius: 10rem;
  list-style: none;
  background: #f1f2f3;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  display: flex;

  li {
    a {
      position: relative;
      padding: 5px 20px;
      color: #9199a2;
      font-size: 16px;
      font-weight: 700;
      border: none;
      outline: none;
      text-decoration: none;
      display: inline-block;
      z-index: 3;
    }

    &.active,
    &:hover {
      a {
        color: #000;
      }
    }
  }

  .nav-active,
  .nav-hover {
    position: absolute;
    /* display: inline-block; */
    height: 30px;
    border-radius: 10em;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1.05);
  }

  .nav-active {
    background-color: #fff;
    z-index: 2;
  }

  .nav-hover {
    opacity: 0;
    background-color: #e0e3df;
    z-index: 1;
    box-shadow: 0 0 20px #ffffffaa inset;
  }

  .squeeze {
    transform: scale(0.9);
  }
}
</style>
