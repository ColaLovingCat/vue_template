import { Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'

export const usePageGo = () => {
  const router = useRouter()
  const pageGo = (path: string, query = {}) => {
    router.push({
      path,
      query
    })
  }

  const showLogout = () => {
    Modal.warning({
      title: 'Authentication Required',
      content: 'You will be redirected to the Login page.',
      onOk: () => {
        pageGo('/login', {
          type: 'logout'
        })
      }
    })
  }

  return { pageGo, showLogout }
}
