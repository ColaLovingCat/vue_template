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
  // Common
  required?: boolean,
  disabled?: boolean,
  activeClear?: boolean,
  // Input
  isPassword?: boolean,
  // Select
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

const emit = defineEmits(['update:values', 'changed'])

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
          <template v-if="!form.isPassword">
            <a-input :placeholder="form.label" v-model:value="formValues[form.key]"
              @change="emit('changed', form.key)" />
          </template>
          <template v-else>
            <a-input-password :placeholder="form.label" v-model:value="formValues[form.key]"
              @change="emit('changed', form.key)" />
          </template>
        </template>
        <!-- Textarea -->
        <template v-if="form.type == 'textarea'">
          <a-textarea :placeholder="form.label" v-model:value="formValues[form.key]" show-count />
        </template>
        <!-- Select -->
        <template v-if="form.type == 'select'">
          <a-select ref="select" style="width: 100%;" :placeholder="form.label" v-model:value="formValues[form.key]"
            @change="emit('changed', form.key)">
            <a-select-option v-for="option in form.list" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </template>
        <!-- Radio -->
        <template v-if="form.type == 'radios'">
          <a-radio-group :name="form.key" v-model:value="formValues[form.key]" @change="emit('changed', form.key)">
            <a-radio v-for="option in form.list" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-radio>
          </a-radio-group>
        </template>
        <!-- Checks -->
        <template v-if="form.type == 'checks'">
          <a-checkbox-group :name="form.key" v-model:value="formValues[form.key]" @change="emit('changed', form.key)">
            <a-checkbox v-for="option in form.list" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-checkbox>
          </a-checkbox-group>
        </template>
        <!-- Date -->
        <template v-if="form.type == 'date'">
          <a-date-picker v-model:value="formValues[form.key]" @change="emit('changed', form.key)" />
        </template>
        <!-- Date Range -->
        <template v-if="form.type == 'date-range'">
          <a-range-picker style="width: 100%;" v-model:value="formValues[form.key]"
            @change="emit('changed', form.key)" />
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@import url(./styles.scss);
</style>
