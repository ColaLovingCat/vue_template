import axios, { AxiosRequestConfig } from 'axios'
import * as extend from './extends'
import { useSystemInfosStore } from '@/commons/stores/index'

const instance = axios.create({
  timeout: 10000
})

instance.interceptors.request.use(
  (config) => {
    const token = extend.LocalStore.get('token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: token
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => {
    const newToken = response.headers['token']
    if (newToken) {
      extend.LocalStore.set('token', newToken)
    }
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      extend.LocalStore.delete('token')
      // 可选调用 store 和 eventBus
      // const systemStore = useSystemInfosStore()
      // systemStore.showLogout(() => {
      //   ;(window as any).eventBus.logout()
      // })
    }
    return Promise.reject(error)
  }
)

const checkAPI = (url: string): string => {
  const isFullUrl = /^https?:\/\//.test(url)
  if (isFullUrl) return url
  // @ts-ignore
  if (import.meta.env.VITE_APP_ROOT === 'true') return url
  // @ts-ignore
  return import.meta.env.VITE_APP_API_URL + url
}

export const axiosRequest = (
  url: string,
  options: {
    method?: 'GET' | 'POST' | string
    headers?: Record<string, string>
    type?: string // content-type
    data?: any
    dataType?: 'json' | 'text' | 'blob'
    activeBody?: boolean
  } = {},
  remarks = ''
) => {
  const method = (options.method || 'GET').toUpperCase()
  const contentType = options.type || 'application/json; charset=utf-8'
  const dataType = options.dataType || 'json'

  const config: AxiosRequestConfig = {
    url: checkAPI(url),
    method,
    headers: contentType !== 'none'
      ? {
          'Content-Type': contentType,
          Accept: 'application/json,text/plain,*/*',
          ...options.headers
        }
      : {
          ...options.headers
        }
  }

  // 参数处理
  if (method === 'GET') {
    config.params = options.data
  } else {
    config.data = contentType === 'application/json; charset=utf-8'
      ? JSON.stringify(options.data)
      : options.data
  }

  if (remarks) console.log(`${remarks} Request:`, config)

  return new Promise((resolve, reject) => {
    instance(config)
      .then(async (res) => {
        const responseData = res.data

        if (remarks) console.log(`${remarks}:`, responseData)

        if (options.activeBody) {
          const headers: { [key: string]: any } = {}
          Object.entries(res.headers).forEach(([key, value]) => {
            headers[key] = value
          })
          resolve({ headers, body: responseData })
        } else {
          resolve(responseData)
        }
      })
      .catch((err) => {
        if (remarks) console.error(`${remarks} Error:`, err)
        reject(err)
      })
  })
}
