import { useRouter } from 'vue-router'

export const usePageGo = () => {
  const router = useRouter()

  const pageGo = (path: string, query = {}) => {
    router.push({
      path,
      query
    })
  }

  return { pageGo }
}
