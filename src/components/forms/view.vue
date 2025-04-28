<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import dayjs from 'dayjs'

import type { FormItem } from '@/commons/datas/datas.types';

// name
defineOptions({
  name: 'app-form'
})

// props
const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      class: {
        forms: '',
        items: '',
        labelCol: 12,
      }
    })
  },
  forms: {
    type: Array<FormItem>,
    default: () => []
  },
  values: {
    type: Object,
    default: () => ({})
  },
  changeMark: {
    type: Boolean,
    require: false
  },
})

const emit = defineEmits(['update:values', 'changed'])

const formValues: any = reactive({})
onMounted(() => {
  refreshValues(props.values)
})
watch(() => props.values, (newVal) => {
  refreshValues(newVal)
}, { deep: true })
const refreshValues = (values: any) => {
  Object.keys(values).forEach((key) => {
    const temp = props.forms.find((a: any) => a.key === key)
    const value = values[key]
    if (temp) {
      switch (temp.type) {
        case 'date': {
          if (value) {
            formValues[key] = dayjs(value);
          } else {
            formValues[key] = null
          }
          break
        }
        case 'date-range': {
          if (value.length == 2) {
            formValues[key] = [dayjs(value[0]), dayjs(value[1])];
          } else {
            formValues[key] = []
          }
          break
        }
        default: {
          formValues[key] = value;
          break
        }
      }
    }
  });
}

const onChanged = (form: any, event?: any) => {
  // 验证单个控件
  if (!validateItem(form)) {
    errorInfos.value[form.key] = `${form.label} required`;
  } else {
    delete errorInfos.value[form.key];
  }
  //
  syncValues()
  emit('changed', form.key)
}
const syncValues = () => {
  let values = JSON.parse(JSON.stringify(formValues))
  props.forms.map((form: any) => {
    switch (form.type) {
      case 'date': {
        if (values[form.key]) {
          values[form.key] = dayjs(values[form.key]).format('YYYY-MM-DD')
        }
        break
      }
      case 'date-range': {
        if (values[form.key] && values[form.key].length > 2) {
          values[form.key] = [
            dayjs(values[form.key][0]).format('YYYY-MM-DD'), dayjs(values[form.key][1]).format('YYYY-MM-DD')
          ]
        }
        break
      }
      default: {
        break
      }
    }
  })
  emit('update:values', values)
}

// select search
const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

// validate
const errorInfos: any = ref({});
const validate = () => {
  // 清空之前的错误信息
  errorInfos.value = {};
  //
  let isValid = true;
  for (const form of props.forms) {
    if (!validateItem(form)) {
      errorInfos.value[form.key] = `${form.label} 是必填项`;
      isValid = false;
    }
  }
  return isValid;
}
const validateItem = (form: any) => {
  if (form.required) {
    const value = formValues[form.key];

    if (form.type === 'checks') {
      return value && value.length > 0;
    }

    if (value === '' || value == null || (Array.isArray(value) && value.length === 0)) {
      return false
    }
  }
  return true
}
defineExpose({
  validate
})
</script>

<template>
  <div class="forms" :class="config.class.forms">
    <template v-for="form in forms" :key="form.key">
      <div class="form-item" :class="config.class.items">
        <label :class="`col-${config.class.labelCol}`">
          {{ form.label }}
          <span v-if="form.required" class="required">*</span>
        </label>
        <!-- Input -->
        <template v-if="form.type == 'input'">
          <template v-if="!form.isPassword">
            <a-input style="width: 100%;" :placeholder="form.label" v-model:value="formValues[form.key]"
              @change="onChanged(form)" :disabled="form.disabled" :allowClear="form.activeClear"
              :status="errorInfos[form.key] ? 'error' : ''" />
          </template>
          <template v-else>
            <a-input-password style="width: 100%;" :placeholder="form.label" v-model:value="formValues[form.key]"
              @change="onChanged(form)" :disabled="form.disabled" :status="errorInfos[form.key] ? 'error' : ''" />
          </template>
        </template>
        <!-- Textarea -->
        <template v-if="form.type == 'textarea'">
          <a-textarea style="width: 100%;" :placeholder="form.label" v-model:value="formValues[form.key]"
            @change="onChanged(form)" :disabled="form.disabled" :allowClear="form.activeClear"
            :status="errorInfos[form.key] ? 'error' : ''" />
        </template>

        <!-- Select -->
        <template v-if="form.type == 'select'">
          <a-select style="width: 100%;" :mode="form.isMulti ? 'multiple' : undefined" :placeholder="form.label"
            v-model:value="formValues[form.key]" @change="onChanged(form)" :disabled="form.disabled"
            :allowClear="form.activeClear" :show-search="form.activeSearch" :filter-option="filterOption"
            :status="errorInfos[form.key] ? 'error' : ''">
            <a-select-option v-for="option in form.list" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </template>

        <!-- Switch -->
        <template v-if="form.type == 'switch'">
          <div style="width: 100%;">
            <a-switch v-model:checked="formValues[form.key]" @change="onChanged(form)" :disabled="form.disabled" />
          </div>
        </template>

        <!-- Radio -->
        <template v-if="form.type == 'radios'">
          <a-radio-group style="width: 100%;" :name="form.key" v-model:value="formValues[form.key]"
            @change="onChanged(form)" :disabled="form.disabled">
            <a-radio v-for="option in form.list" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-radio>
          </a-radio-group>
        </template>
        <!-- Checks -->
        <template v-if="form.type == 'checks'">
          <a-checkbox-group style="width: 100%;" :name="form.key" v-model:value="formValues[form.key]"
            @change="onChanged(form)" :disabled="form.disabled">
            <a-checkbox v-for="option in form.list" :key="option.value" :value="option.value">
              <span v-if="errorInfos[form.key]" style="color: red">{{ option.label }}</span>
              <span v-else>{{ option.label }}</span>
            </a-checkbox>
          </a-checkbox-group>
        </template>

        <!-- Date -->
        <template v-if="form.type == 'date'">
          <a-date-picker style="width: 100%;" v-model:value="formValues[form.key]" @change="onChanged(form)"
            :disabled="form.disabled" :allowClear="form.activeClear" :status="errorInfos[form.key] ? 'error' : ''" />
        </template>
        <!-- Date Range -->
        <template v-if="form.type == 'date-range'">
          <a-range-picker style="width: 100%;" v-model:value="formValues[form.key]" @change="onChanged(form)"
            :disabled="form.disabled" :allowClear="form.activeClear" :status="errorInfos[form.key] ? 'error' : ''" />
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@import url(./styles.scss);
</style>
