<script lang="ts" setup>
import { reactive, watch, toRaw } from 'vue'

// name
defineOptions({
  name: 'app-form'
})

export interface FormItem {
  type: string;
  key: string;
  label: string;
  //
  required?: boolean,
  disabled?: boolean,
  list?: DrpItem[]
}

interface DrpItem {
  value: string | number,
  label: string
}

// props
const props = defineProps<{
  config?: Record<string, any>
  forms: FormItem[]
  values: Record<string, any>
  changeMark?: boolean
}>()

const emit = defineEmits(['update:values', 'submit'])

const formValues = reactive({ ...props.values })
watch(() => props.values, (newVal) => {
  Object.assign(formValues, newVal)
})
watch(formValues, (newVal) => {
  emit('update:values', toRaw(newVal))
}, { deep: true })
</script>

<template>
  <div class="forms">
    <template v-for="form in forms" :key="form.key">
      <div class="form-item">
        <label for="">{{ form.label }}<span v-if="form.required" class="required">*</span></label>
        <!-- Input -->
        <template v-if="form.type == 'input'">
          <a-input :placeholder="form.label" v-model:value="formValues[form.key]" />
        </template>
        <!-- Select -->
        <template v-if="form.type == 'select'">
          <a-select ref="select" style="width: 100%;" :placeholder="form.label" v-model:value="formValues[form.key]">
            <a-select-option v-for="option in form.list" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </template>
        <!-- Radio -->
        <template v-if="form.type == 'radios'">
          <a-radio-group :name="form.key" v-model:value="formValues[form.key]">
            <a-radio v-for="option in form.list" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-radio>
          </a-radio-group>
        </template>
        <!-- Date -->
        <template v-if="form.type == 'date'">
          <a-date-picker v-model:value="formValues[form.key]" />
        </template>
        <!-- Date Range -->
        <template v-if="form.type == 'date-range'">
          <a-range-picker style="width: 100%;" v-model:value="formValues[form.key]" />
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@import url(./styles.scss);
</style>
