import { createVNode } from 'vue'
import { notification, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

export const showSuccess = (message: string) => {
  notification.success({
    message: 'Success',
    description: message
  })
}

export const showWarning = (message: string) => {
  notification.warning({
    message: 'Warning',
    description: message
  })
}

export const showError = (message: string) => {
  notification.error({
    message: 'Error',
    description: message
  })
}

export const showInfo = (message: string) => {
  notification.info({
    message: 'Info',
    description: message
  })
}

export const showConfirm = (opts: { title: string; message: string }, callback: Function) => {
  const modal = Modal.confirm({
    title: opts.title,
    icon: createVNode(ExclamationCircleOutlined),
    content: opts.message,
    okText: '确认',
    onOk() {
      callback(true)
    },
    cancelText: '取消',
    onCancel() {
      callback(false)
    }
  })
}
