import * as extend from './extends'

export const fetchRequest = (url: string, options: any = {}, remarks = '') => {
  const opts: any = {}
  // 请求方式
  opts.method = (options.method || 'GET').toUpperCase()
  // 头部信息
  opts.headers =
    options.type != 'none'
      ? {
          'Content-Type': options.type || 'application/json; charset=utf-8',
          Accept: 'application/json,text/plain,*/*'
        }
      : {}
  Object.assign(opts.headers, options.headers)
  // 获取token信息
  const token = extend.LocalStore.get('token')
  if (token) {
    Object.assign(opts.headers, {
      Authorization: token
    })
  }
  // opts.credentials = options.credentials || 'include'; // 设置cookie是否一起发送 omit | same-origin | include
  // opts.mode= options.mode || 'no-cors', // 跨域设置 cors | no-cors | same-origin
  // 格式化参数
  switch (opts.method) {
    // 拼接GET参数
    case 'GET': {
      if (options.data) {
        url += '?' + extend.ExObject.stringfyParams(options.data)
      }
      break
    }
    // body存入POST参数
    case 'POST':
    default: {
      opts.body = !options.type ? JSON.stringify(options.data) : options.data
      break
    }
  }
  remarks != '' ? console.log(remarks + ' Request: ', url, opts) : void 0
  // 返回数据的解析方式
  const dataType = options.dataType || 'json'
  //
  return new Promise((resolve, reject) => {
    fetch(checkAPI(url), opts)
      .then(async (res) => {
        remarks != '' ? console.log(remarks + ' Status: ', res.status) : void 0
        if (res.status == 401) {
          extend.LocalStore.delete('token')
          reject(res)
        }
        // response.status 表示响应的http状态码
        if (res.status !== 200) {
          reject(res)
        }
        // 刷新token
        const token = res.headers.get('Token')
        if (token) {
          extend.LocalStore.set('token', token)
        }
        // 处理返回的数据
        let data = null
        switch (dataType) {
          case 'text': {
            data = await res.text()
            break
          }
          case 'blob': {
            data = await res.blob()
            break
          }
          default: {
            data = await res.json()
            break
          }
        }
        remarks != '' ? console.log(remarks + ': ', data) : void 0
        resolve(data)
      })
      .catch(function (err) {
        remarks != '' ? console.error(remarks + ': ', err) : void 0
        reject(err)
      })
  })
}

const checkAPI = (url: string) => {
  // 接口以http或https开头
  const check = new RegExp('^http.*$').test(url) || new RegExp('^https.*$').test(url)
  if (check) return url

  // 前端部署在wwwroot中
  if (import.meta.env.VITE_APP_ROOT == 'true') return url

  // 默认地址
  return import.meta.env.VITE_APP_API_URL + url
}
