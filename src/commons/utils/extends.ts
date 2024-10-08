/**
 * @summary 字符串拓展
 */
export const ExString = {
  /**
   * @summary 当字符串不为 undefined|null|""|"  " 时返回true
   */
  isNotEmpty: function (str: any, force: boolean = false): boolean {
    return str !== undefined && str !== null && str.trim() !== ''
  },
  /**
   * @summary 是否符合数字格式
   */
  isNumber: function (str: string) {
    return /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/.test(str)
  },
  /**
   * @summary 邮件格式
   */
  isEmail: function (str: string) {
    return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(
      str
    )
  },
  /**
   * @summary 是否符合文件路径格式
   */
  isFilePath: function (str: any) {
    return /^(?:[a-zA-Z]:)?[\\/](?:(?:(?:\.\.?(?:[\\/]))|(?:[\w-_.]+(?:[\\/])))*(?:[\w-_.]+[^\.])?)?$/.test(
      str
    )
  },
  /**
   * @summary 获取文件名后缀
   */
  fileType: function (fileName: any) {
    return fileName.toLowerCase().split('.').pop() // .match(/.[^.]+$/)[0]
  },
  /**
   * @summary 获取文件图标
   */
  fileIcon: function (fileType: string) {
    let result = 'fa-file'
    switch (fileType) {
      case 'jpg':
      case 'png': {
        result = 'fa-file-image'
        break
      }
      case 'pdf': {
        result = 'fa-file-pdf'
        break
      }
      case 'txt': {
        result = 'fa-file-lines'
        break
      }
      case 'csv':
      case 'xlsx': {
        result = 'fa-file-excel'
        break
      }
      case 'docx': {
        result = 'fa-file-word'
        break
      }
      case 'pptx': {
        result = 'fa-file-powerpoint'
        break
      }
      case 'mp3': {
        result = 'fa-file-audio'
        break
      }
      case 'mp4': {
        result = 'fa-file-video'
        break
      }
      default: {
        break
      }
    }
    return result
  },
  /**
   * @summary 去除空格
   * @param type 1-前后空格| 2-前空格| 3-后空格| 4-所有空格
   */
  trim: function (str: string, type: number = 1): string {
    type = type || 1
    switch (type) {
      case 1:
        return str.replace(/(^\s*)|(\s*$)/g, '')
      case 2:
        return str.replace(/(^\s*)/g, '')
      case 3:
        return str.replace(/(\s*$)/g, '')
      case 4:
        return str.replace(/\s+/g, '')
      default:
        return str
    }
  },
  /**
   * @summary 大小写转换
   * @param type 1-首字母大写| 2-首字母小写| 3-大小写转换| 4-全部大写| 5-全部小写
   */
  toCase: function (str: string, type: number = 1): string {
    switch (type) {
      case 1:
        return str.replace(/\b\w+\b/g, function (word) {
          return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase()
        })
      case 2:
        return str.replace(/\b\w+\b/g, function (word) {
          return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase()
        })
      case 3:
        return str
          .split('')
          .map(function (word) {
            if (/[a-z]/.test(word)) {
              return word.toUpperCase()
            } else {
              return word.toLowerCase()
            }
          })
          .join('')
      case 4:
        return str.toUpperCase()
      case 5:
        return str.toLowerCase()
      default:
        return str
    }
  },
  /**
   * @summary 替换全部
   * @param ignoreCase 是否忽略大小写，默认不忽略
   */
  replaceAll: function (str: string, findText: string, replaceWith: string, ignoreCase = false) {
    if (!RegExp.prototype.isPrototypeOf(findText)) {
      return str.replace(new RegExp(findText, ignoreCase ? 'gi' : 'g'), replaceWith)
    } else {
      return str.replace(findText, replaceWith)
    }
  },
  /**
   * @summary 生成uuid，默认可生成标准uuid
   * @param len 字符长度
   * @param radix 字符范围
   */
  uuid: function (len = null, radix: any = null) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    let s = [],
      i
    radix = radix || chars.length
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) s[i] = chars[0 | (Math.random() * radix)]
    } else {
      // rfc4122, version 4 form
      let r
      // rfc4122 requires these characters
      s[8] = s[13] = s[18] = s[23] = '-'
      s[14] = '4'
      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!s[i]) {
          r = 0 | (Math.random() * 16)
          s[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    return s.join('')
  },
  uuidFixed: function () {
    let d = new Date().getTime()
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now() // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
  }
}

/**
 * @summary 数字拓展
 */
export const ExNumber = {
  /**
   * @summary 创建随机数，包含左右值
   * @param point 返回值保留几位小数
   */
  createRand: function (min: number, max: number, point: number | undefined = undefined): number {
    point = point || 0
    if (point === 0) {
      return Math.round(min + Math.random() * (max - min))
    } else {
      const up = Math.pow(10, point)
      return min + Math.round(Math.random() * (max - min) * up) / up
    }
  },
  /**
   * @summary 转字符并保持小数位数
   * @param point 返回值保留几位小数
   */
  toFixed: function (num: number, point: number | null | undefined) {
    const isNegative = num < 0
    num = Math.abs(num)

    const temp: any[] = this.split(num)
    let result = temp[0].toString()
    if (point && point > 0) {
      let dec = temp[1].toString().replace('0.', '')
      if (dec.length < point) {
        dec += new Array(point - dec.length).fill(0).join('')
      } else {
        dec = dec.substring(0, point)
      }
      result = result + '.' + dec
    }

    if (isNegative) {
      result = '-' + result
    }
    return result
  },
  /**
   * @summary 金额分隔符
   * @param thousandsSep 千分位分隔符
   * @param decPoint 小数点符号
   * @param decCount 保留小数点位数
   */
  formatMoney: function (num: number, thousandsSep = ',', decPoint = '.', decCount = 0) {
    const sign = num < 0 ? '-' : ''
    const absNumber = Math.abs(num).toFixed(decCount)

    const parts = absNumber.split('.')
    let integerPart = parts[0]
    const decimalPart = parts[1] ? decPoint + parts[1] : ''

    while (/(\d+)(\d{3})/.test(integerPart)) {
      integerPart = integerPart.replace(/(\d+)(\d{3})/, '$1' + thousandsSep + '$2')
    }

    return sign + integerPart + decimalPart
  },
  /**
   * @summary 进制转换
   * @param m 从
   * @param n 转至
   */
  transRadix: function (num: any, m = 10, n = 16) {
    return parseInt(num + '', m).toString(n)
  },
  /**
   * @summary 获取整数和小数部分
   * @returns [] [整数部分,小数部分]
   */
  split: function (num: number) {
    return [Math.floor(num), this.fixFloatingPointError(num, 1, (a: any, b: any) => a % b)]
  },
  /**
   * @summary 将数值限制在范围内
   */
  limit: function (num: number, min: number, max: number) {
    return Math.max(min, Math.min(num, max))
  },
  /**
   * @summary 修正浮点数运算小数溢出的问题
   * @param operator (a,b) => a + b
   */
  fixFloatingPointError: function (num1: any, num2: any, operator: any) {
    const precision = Math.max(this._getDecimalPlaces(num1), this._getDecimalPlaces(num2))
    const factor = 10 ** precision
    const result = operator(num1 * factor, num2 * factor) / factor
    return result
  },
  _getDecimalPlaces: function (num: number) {
    const match = String(num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/)
    if (!match) {
      return 0
    }
    const fraction = match[1] ? match[1].length : 0
    const exponent = match[2] ? Number(match[2]) : 0
    return Math.max(0, fraction - exponent)
  },
  /**
   * @summary 数值间差值
   */
  gap(dataA: number, dataB: number): string {
    const result = dataA - dataB
    if (result > 0) {
      return '+' + result
    }
    return result.toString()
  }
}

/**
 * @summary Array拓展方法
 */
export const ExArray = {
  /**
   * @summary 初始化简单数组
   */
  initial: function (length: number, startIndex = 0): number[] {
    const result: number[] = []
    for (let loop = 0; loop < length; loop++) {
      result.push(startIndex + loop)
    }
    return result
  },
  /**
   * @summary 添加相应index的元素
   */
  insert: function (arr: any[], index: number, obj: any) {
    arr.splice(index, 0, obj)
    return arr
  },
  /**
   * @summary 删除相应index的元素
   */
  delete: function (arr: any[], index: number) {
    const len = arr.length - 1
    for (let i = index; i < len; i++) arr[i] = arr[i + 1]
    arr.length = len
    return arr
  },
  /**
   * @summary 检查索引是否可用
   */
  checkIndex: function (arr: any[], index: number) {
    return index > -1 && index < arr.length
  },
  /**
   * @summary 检查元素是否在数组中，注意区分数据类型
   */
  checkExist: function (arr: any[], obj: any) {
    return arr.indexOf(obj)
  },
  checkExistbyEle: function (arr: any[], obj: any, prop: string) {
    return arr.findIndex((item) => item[prop] == obj[prop]) != -1
  },
  /**
   * @summary 深拷贝
   */
  copy: function (arr: any[]) {
    return deepCopyArr(arr)
  },
  /**
   * @summary 交换两个索引位置的元素在数组中的位置
   */
  exchange: function (arr: any[], index1: number, index2: number) {
    if (this.checkIndex(arr, index1) && this.checkIndex(arr, index2)) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
    }
    return arr
  },
  /**
   * @summary 切换数组中该元素的状态，没有则添加，有则删除
   */
  switch: function (arr: any[], value: any) {
    const index = this.checkExist(arr, value)
    if (index == -1) {
      // 未找到
      arr.push(value)
    } else {
      // 删除元素
      arr.splice(index, 1)
    }
  },
  switchbyEle: function (arr: any[], obj: any, prop: string) {
    const index = arr.findIndex((item) => item[prop] == obj[prop])
    if (index == -1) {
      // 未找到
      arr.push(obj)
    } else {
      // 删除元素
      arr.splice(index, 1)
    }
  },
  /**
   * @summary 排序
   */
  sort: function (arr: any[], sortBy = 'asc') {
    arr.sort((a, b) => {
      if (sortBy == 'asc') {
        return this._sortCompare(a, b)
      } else {
        return this._sortCompare(b, a)
      }
    })
    return arr
  },
  sortbyEle: function (arr: any[], func: Function, sortBy = 'asc') {
    arr.sort((a, b) => {
      if (sortBy == 'asc') {
        return this._sortCompare(func(a), func(b))
      } else {
        return this._sortCompare(func(b), func(a))
      }
    })
    return arr
  },
  _sortCompare: function (a: any, b: any) {
    if (typeof a === 'string' && typeof b === 'string') {
      // 如果 a 和 b 都是字符串类型，按照字典序进行排序
      return a.localeCompare(b)
    } else {
      // 否则将 a 和 b 转换为数字类型并进行比较
      return Number(a) - Number(b)
    }
  },
  /**
   * @summary 去重
   */
  unique: function (arr: any[]) {
    const result = []
    for (let i = 0; i < arr.length; i++) {
      if (result.indexOf(arr[i]) === -1) {
        result.push(arr[i])
      }
    }
    return result
  },
  /**
   * @summary 基于单一属性值将数组分组
   * @param { Function } fun - item => item.id
   */
  group: function (arr: any[], fun: Function) {
    const groups: any = {}
    arr.forEach(function (o) {
      const group = fun(o)
      groups[group] = groups[group] || []
      groups[group].push(o)
    })
    return Object.keys(groups).map(function (group) {
      return { name: group, datas: groups[group] }
    })
  },
  /**
   * @summary 基于单一属性值模糊搜索包含文本信息的项
   * @param { Function } fun - item => item.value
   */
  filter: function (arr: any[], filterTxt: string, fun: Function) {
    return filterTxt !== ''
      ? arr.filter((item) => {
        return fun(item).toLocaleLowerCase().indexOf(filterTxt.toLocaleLowerCase()) != -1
      })
      : arr
  },
  /**
   * @summary 随机打乱
   */
  shuffle: function (arr: any[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      arr = this.exchange(arr, i, j)
    }
    return arr
  },
  /**
   * @summary forEach
   * @param func 示例：(item, index) => {}
   */
  forEach: function (arr: any[], fun: Function) {
    for (let loop = 0; loop < arr.length; loop++) {
      fun.call(arr, arr[loop], loop)
    }
    return arr
  },
  /**
   * @summary 两数组联查
   * @param type 0-简单合并(默认)| 1-交集| 2-并集 |3-差集
   */
  intersect: function (arr1: any[], arr2: any[], type = 0) {
    switch (type) {
      case 1:
        return arr1.filter((item) => arr2.includes(item))
      case 2:
        return arr1.concat(arr2.filter((item) => !arr1.includes(item))) // [...new Set([...arr1, ...arr2])]
      case 3:
        return arr1.filter((item) => !arr2.includes(item))
      default:
        return arr1.concat(arr2)
    }
  }
}

/**
 * @summary Object拓展方法
 */
export const ExObject = {
  /**
   * @summary 将json对象转为请求参数格式
   */
  stringfyParams: function (obj: any) {
    //对象序列化【对象转url参数】
    if (!obj) return ''
    const pairs = []
    for (const key in obj) {
      const value = obj[key]
      if (value instanceof Array) {
        for (let i = 0; i < value.length; ++i) {
          pairs.push(encodeURIComponent(key + '[' + i + ']') + '=' + encodeURIComponent(value[i]))
        }
        continue
      }
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    }
    return pairs.join('&')
  },
  /**
   * @summary 深拷贝
   */
  copy: function (obj: any) {
    return deepCopyObj(obj)
  },
  /**
   * @summary 返回数据类型
   * @returns {string} Number| String| Boolean| Null| Undefined| Object| Array| Date| Function| RegExp| BigInt| Symbol
   */
  typeof: function (obj: any) {
    return Object.prototype.toString.call(obj).split(' ')[1].replace(']', '')
  },
  /**
   * @summary 返回对象对应路径的值，不存在则返回默认值
   * @param {Object} object 对象
   * @param {Array} path 属性路径的数组
   * @param {any} defaultValue 默认值
   */
  getValuebyPath: function (object: any, path: any, defaultValue = null) {
    return path.reduce((obj: any, prop: any) => {
      return obj && obj[prop] ? obj[prop] : defaultValue
    }, object)
  }
}

/**
 * @summary Date拓展方法
 */
export const ExDate = {
  /**
   * @summary 时间格式化
   */
  format(date: any, format: string | undefined = undefined) {
    if (date === '' || date === null) {
      return ''
    }
    //无参数
    if ((date == undefined && format === undefined) || date === 'now') {
      date = new Date()
    }
    if (format === undefined) {
      format = 'yyyy-MM-dd HH:mm:ss'
    }
    if (typeof date === 'string') {
      date = date.replace('T', ' ')
    }
    date = new Date(date)
    //
    const map: any = {
      y: date.getFullYear() + '', //年份
      M: date.getMonth() + 1 + '', //月份
      d: date.getDate() + '', //日
      H: date.getHours(), //小时 24
      m: date.getMinutes() + '', //分
      s: date.getSeconds() + '', //秒
      q: Math.floor((date.getMonth() + 3) / 3) + '', //季度
      f: date.getMilliseconds() + '' //毫秒
    }
    //小时 12
    if (map['H'] > 12) {
      map['h'] = map['H'] - 12 + ''
    } else {
      map['h'] = map['H'] + ''
    }
    map['H'] += ''

    const reg = 'yMdHhmsqf'
    let all = '',
      str = ''
    for (let i = 0, n = 0; i < reg.length; i++) {
      n = format.indexOf(reg[i])
      if (n < 0) {
        continue
      }
      all = ''
      for (; n < format.length; n++) {
        if (format[n] != reg[i]) {
          break
        }
        all += reg[i]
      }
      if (all.length > 0) {
        if (all.length == map[reg[i]].length) {
          str = map[reg[i]]
        } else if (all.length > map[reg[i]].length) {
          if (reg[i] == 'f') {
            str = map[reg[i]] + this._charString('0', all.length - map[reg[i]].length)
          } else {
            str = this._charString('0', all.length - map[reg[i]].length) + map[reg[i]]
          }
        } else {
          switch (reg[i]) {
            case 'y':
              str = map[reg[i]].substr(map[reg[i]].length - all.length)
              break
            case 'f':
              str = map[reg[i]].substr(0, all.length)
              break
            default:
              str = map[reg[i]]
              break
          }
        }
        format = format.replace(all, str)
      }
    }
    return format
  },
  _charString: function (char: string, count: number) {
    return new Array(count).fill(char).join('')
  },
  /**
   * @summary 针对chart的时间格式
   */
  formatChart: function (date: any) {
    // 时区差值
    let offsetGMT = new Date().getTimezoneOffset()
    offsetGMT = 0
    //
    const result = date ? new Date(date).getTime() : new Date().getTime()
    const timeStamp = new Date(result + offsetGMT * 60 * 1000)
    return timeStamp.getTime()
  },
  formatUTC(date: any) {
    const offsetGMT = 0 // new Date().getTimezoneOffset() / 60
    if (typeof date == 'string') {
      date = new Date(date)
    }
    return Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours() + offsetGMT,
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  },
  /**
   * @summary 时间增减
   * @param (string) strInterval y|M|q|w|d|h|m|s
   */
  add: function (date: any, strInterval: string, num: number) {
    const dtTmp = date
    switch (strInterval) {
      case 's':
        return new Date(Date.parse(dtTmp) + 1000 * num)
      case 'm':
        return new Date(Date.parse(dtTmp) + 60000 * num)
      case 'h':
        return new Date(Date.parse(dtTmp) + 3600000 * num)
      case 'd':
        return new Date(Date.parse(dtTmp) + 86400000 * num)
      case 'w':
        return new Date(Date.parse(dtTmp) + 86400000 * 7 * num)
      case 'q':
        return new Date(
          dtTmp.getFullYear(),
          dtTmp.getMonth() + num * 3,
          dtTmp.getDate(),
          dtTmp.getHours(),
          dtTmp.getMinutes(),
          dtTmp.getSeconds()
        )
      case 'M':
        return new Date(
          dtTmp.getFullYear(),
          dtTmp.getMonth() + num,
          dtTmp.getDate(),
          dtTmp.getHours(),
          dtTmp.getMinutes(),
          dtTmp.getSeconds()
        )
      case 'y':
        return new Date(
          dtTmp.getFullYear() + num,
          dtTmp.getMonth(),
          dtTmp.getDate(),
          dtTmp.getHours(),
          dtTmp.getMinutes(),
          dtTmp.getSeconds()
        )
      default:
        return new Date(date)
    }
  },
  /**
   * @summary 时间差值 A-B
   */
  diff: function (dateA: any, dateB: any, strInterval = 'd') {
    try {
      dateA = typeof dateA == 'string' ? new Date(dateA) : dateA
      dateB = typeof dateB == 'string' ? new Date(dateB) : dateB
      const dtDiff = dateA.getTime() - dateB.getTime()
      // 计算
      const days = Math.floor(dtDiff / (24 * 60 * 60 * 1000))
      const hourLevel = dtDiff % (24 * 60 * 60 * 1000)
      const hours = Math.floor(hourLevel / (60 * 60 * 1000))
      const minutesLevel = hourLevel % (60 * 60 * 1000)
      const minutes = Math.floor(minutesLevel / (60 * 1000))
      const seconds = Math.round((minutesLevel % (60 * 1000)) / 1000)
      //
      switch (strInterval) {
        case 'd':
          return days
        case 'h':
          return hours
        case 'm':
          return minutes
        case 's':
          return seconds
        default:
          return days
      }
    } catch (e) {
      return null
    }
  },
  /**
   * @summary 获取上一周期的时间起始
   */
  lastPeriod: function (type: string) {
    const result = {
      start: '',
      end: ''
    }
    //
    const dateNow = new Date()
    let year = dateNow.getFullYear()
    let month = dateNow.getMonth() + 1
    switch (type) {
      case 'week': {
        const dayNum = dateNow.getDay()
        result.start = this.format(this.add(dateNow, 'd', -(dayNum + 6)))
        result.end = this.format(this.add(dateNow, 'd', -dayNum))
        break
      }
      case 'month': {
        if (month == 1) {
          year = year - 1
          month = 12
        } else {
          month = month - 1
        }
        result.start = this.format(year + '-' + month + '-1')
        result.end = this.format(year + '-' + month + '-' + new Date(year, month, 0).getDate())
        break
      }
      case 'year': {
        result.start = this.format(year - 1 + '-1-1')
        result.end = this.format(year - 1 + '-12-31')
        break
      }
    }
    return result
  },
  lastShift: function () {
    const result = {
      start: '',
      end: ''
    }
    //
    const dateNow = new Date()
    result.end = this.format(dateNow, 'yyyy/MM/dd HH:mm:ss')
    //
    const hour = dateNow.getHours()
    if (hour < 7) {
      result.start = this.format(this.add(dateNow, 'd', -1), 'yyyy/MM/dd') + ' 19:00:00'
    } else if (hour < 19) {
      result.start = this.format(dateNow, 'yyyy/MM/dd') + ' 07:00:00'
    } else {
      result.start = this.format(dateNow, 'yyyy/MM/dd') + ' 19:00:00'
    }
    //
    return result
  },
  /**
   * @summary 格式化显示日期的不同阶段
   */
  formatShow: function (date: any, maxInterval = 'y', defaultFormat = 'yyyy/MM/dd') {
    const timeGap = parseInt(((new Date().getTime() - new Date(date).getTime()) / 1000).toString())
    if (timeGap < 60) {
      return 'just submitted'
    } else if (timeGap < 60 * 60) {
      return Math.floor(timeGap / 60) + ' minutes ago'
    } else if (timeGap < 24 * 60 * 60) {
      return Math.floor(timeGap / (60 * 60)) + ' hours ago'
    } else if (timeGap < 15 * 24 * 60 * 60) {
      return Math.floor(timeGap / (60 * 60 * 24)) + ' days ago'
    } else {
      return this.format(date, defaultFormat)
    }
  }
}

/**
 * @summary 浏览器常用方法
 */
export const ExWeb = {
  /**
   * @summary 浏览器类型
   */
  browser: function () {
    const userAgent = navigator.userAgent
    try {
      const isFF = userAgent.indexOf('Firefox') > -1 // Firefox
      const isEdge = userAgent.indexOf('Edge') > -1 || userAgent.indexOf('Edg') > -1 // IE的Edge
      const isOpera = userAgent.indexOf('Opera') > -1 // Opera
      const isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 // Chrome
      const isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1 // Safari
      let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera
      if (!isIE) isIE = userAgent.indexOf('Trident') > -1 // IE
      //
      if (isIE) {
        let reIE = new RegExp('MSIE (\\d+\\.\\d+);')
        if (reIE.test(userAgent)) {
          const fIEVersion = parseFloat(RegExp['$1'])
          if (fIEVersion == 7) {
            return 'IE7'
          } else if (fIEVersion == 8) {
            return 'IE8'
          } else if (fIEVersion == 9) {
            return 'IE9'
          } else if (fIEVersion == 10) {
            return 'IE10'
          } else if (fIEVersion == 11) {
            return 'IE11'
          } else {
            return ''
          } //IE版本过低
        }
        reIE = new RegExp('Trident/(\\d+\\.\\d+);')
        if (reIE.test(userAgent)) {
          const fIEVersion = parseFloat(RegExp['$1'])
          if (fIEVersion == 7) {
            return 'IE11'
          } else if (fIEVersion == 6) {
            return 'IE10'
          } else if (fIEVersion == 5) {
            return 'IE9'
          } else if (fIEVersion == 4) {
            return 'IE8'
          } //IE版本过低
          return 'IE'
        }
      }
      if (isOpera) {
        return 'Opera'
      }
      if (isEdge) {
        return 'Edge'
      }
      if (isFF) {
        return 'Firefox'
      }
      if (isSafari) {
        return 'Safari'
      }
      if (isChrome) {
        return 'Chrome'
      }
      return ''
    } catch (e) {
      return 'Error'
    }
  },
  /**
   * @summary 判断是android还是ios还是web
   */
  device: function () {
    const ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('iphone os') > -1 || ua.indexOf('ipad') > -1) {
      // ios
      return 'iOS'
    }
    if (ua.indexOf('android') > -1) {
      return 'Android'
    }
    return 'Web'
  },
  /**
   * @summary url地址信息
   */
  url: function () {
    const localHost = document.location
    //
    const reg = new RegExp('^(http|https)://', 'i')
    if (reg.test(localHost.href)) {
      return {
        type: 'server', // 地址
        url: localHost.href, // 地址
        server: localHost.origin, // 服务器+端口
        protocol: localHost.protocol, // 协议
        host: localHost.hostname, // 服务器
        port: localHost.port, // 端口
        path: localHost.pathname, // 页面路径
        param: localHost.search // 参数
      }
    } else {
      return {
        type: 'file',
        path: localHost.href // 页面路径
      }
    }
  },
  /**
   * @summary 请求参数集
   */
  params: function () {
    const sHref = window.location.href
    const args = sHref.split('?')
    if (args[0] === sHref) {
      return ''
    }
    const hrefarr = args[1].split('#')[0].split('&')
    const obj: any = {}
    for (let i = 0; i < hrefarr.length; i++) {
      const temp = hrefarr[i].split('=')
      obj[temp[0]] = temp[1]
    }
    return obj
  },
  /**
   * @summary 获取单一请求参数
   */
  query: function (prop: string) {
    let result = null
    const reg = new RegExp('(^|&)' + prop + '=([^&]*)(&|$)', 'i') // 不区分大小写
    const host = window.location.search.substr(1)
    if (reg.test(host)) {
      const r = host.match(reg)
      result = r ? decodeURI(r[2]) : null
    }
    return result
  },
  /**
   * @summary 视口尺寸
   */
  viewSize: function () {
    if (window.innerWidth) {
      return {
        w: window.innerWidth,
        h: window.innerHeight
      }
    } else {
      // ie8及其以下
      if (document.compatMode === 'BackCompat') {
        // 怪异模式
        return {
          w: document.body.clientWidth,
          h: document.body.clientHeight
        }
      } else {
        // 标准模式
        return {
          w: document.documentElement.clientWidth,
          h: document.documentElement.clientHeight
        }
      }
    }
  },
  /**
   * @summary 关闭窗口
   */
  close: function () {
    window.opener = null
    window.open('', '_self')
    window.close()
  }
}

/**
 * @summary 针对Promise的优化
 */
export const ExPromise = {
  /**
   * @summary 执行Promise队列，若其中一个出错则报错
   */
  promiseFlow: function (arr: Promise<any>[], callback: Function) {
    Promise.all(arr)
      .then((res) => {
        callback({
          status: 1,
          message: ''
        })
      })
      .catch((err) => {
        callback({
          status: -1,
          message: err
        })
      })
  }
}

/**
 * @summary 优化
 */
export const Optimize = {
  /**
   * @summary 防抖，减少频繁触发的事件的执行次数
   * @param wait 在等待时间结束后，才可以重新触发一次函数，若重复触发则重置wait时间
   * @param immediate 是否立即触发
   */
  debounceFn: function (func: Function, wait: number, immediate = false) {
    let timer: any = null
    // 缓存函数的执行上下文和参数
    const _self = this,
      _args = arguments
    return function () {
      // 清除之前的计时器
      if (timer) {
        clearTimeout(timer)
      }
      //
      if (!immediate) {
        timer = setTimeout(function () {
          func.apply(_self, _args)
        }, wait)
      } else {
        const callNow = !timer
        timer = setTimeout(function () {
          timer = null
        }, wait)
        if (callNow) {
          func.apply(_self, _args)
        }
      }
    }
  },
  /**
   * @summary 节流，确保函数在指定时间间隔内只被调用一次
   * @param delay 在延迟时间内，可以执行一次函数
   */
  throttleFn: function (func: Function, delay: number) {
    let lastTime = 0
    // 缓存函数的执行上下文和参数
    const _self = this,
      _args = arguments
    return function (e: any) {
      const nowTime = new Date().getTime() // 记录本次执行时间
      if (nowTime - lastTime > delay) {
        // 在延时范围外则触发方法
        func.apply(_self, _args)
        lastTime = nowTime
      }
    }
  },
  /**
   * @summary 柯里化函数，把接受多个参数的函数，变换成 接受单一参数的，并返回接受余下的参数且返回结果的 新函数
   * @summary 使用示例：fun(a,b) > fun(a)(b)
   */
  curryFn: function (func: Function) {
    return function curried(this: any, ...args: any[]) {
      // 如果传入参数个数不少于原函数参数个数，直接调用原函数并返回结果
      if (args.length >= func.length) {
        return func.apply(this, args)
      }
      // 否则返回一个新函数，等待更多的参数传入
      else {
        return (...newArgs: any[]) => {
          return curried.apply(this, args.concat(newArgs))
        }
      }
    }
  },
  /**
   * @summary 组合函数，两个函数自动依次执行
   * @param fns 任意数量的函数
   */
  composeFns: function (...fns: any[]) {
    const fnsLen = fns.length
    // 判断参数是否都为函数
    for (let i = 0; i < fnsLen; i++) {
      if (typeof fns[i] !== 'function') {
        throw TypeError('The argument passed must be a function.')
      }
    }
    const _self = this
    function composeFn(...args: any[]) {
      // 第一个函数的执行结果，并用该结果作为下一个函数的输入
      let result = fns[0].apply(_self, args)
      // 从第二个函数开始遍历，依次将函数取出进行调用
      for (let i = 1; i < fnsLen; i++) {
        // 将上一个函数的返回值作为参数传给下一个函数，并更新结果
        result = fns[i].call(_self, result)
      }
      // 将结果返回
      return result
    }
    return composeFn
  },
  /**
   * @summary 单例模式
   */
  singletonFn: function (func: Function) {
    // 排除非函数与箭头函数
    if (!(func instanceof Function) || !func.prototype) {
      throw new Error('不是合法的构造函数')
    }
    // 用于保存单例实例的变量
    let instance: any

    return function () {
      // 公共方法，用于获取单例实例
      if (!instance) {
        instance = func()
      }
      return instance
    }
  }
}

/**
 * @summary 本地存储
 */
export const LocalStore = {
  /**
   * @summary 存储
   * @param day 过期时间，单位：天，默认30
   */
  set: function (prop: string, value: any, day = 30) {
    const time = new Date().setHours(new Date().getHours() + 30 * day)
    localStorage.setItem(
      prop,
      JSON.stringify({
        data: value,
        time: time
      })
    )
  },
  /**
   * @summary 获取
   * @return 过期为null
   */
  get: function (prop: string) {
    const data = localStorage.getItem(prop)
    if (!data) {
      return null
    }
    const obj = JSON.parse(data)
    if (new Date().getTime() > obj.time) {
      // 过期
      localStorage.removeItem(prop)
      return null
    } else {
      return obj.data
    }
  },
  /**
   * @summary 删除
   */
  delete: function (prop: string) {
    localStorage.removeItem(prop)
  },
  /**
   * @summary 清空
   */
  clear: function () {
    localStorage.clear()
  }
}

/**
 * @summary 分页功能
 */
export class ExPaginator<T> {
  constructor(datas: T[], size: number) {
    this.dataSource = datas
    this.pageInfo.size = size
    //
    this.pageInfo.index = 0
    this.refreshData()
  }

  // 数据源
  dataSource: T[] = []
  // 展示数据
  dataShow: T[] = []

  // 分页信息
  pageInfo: PageInfos = {
    total: 0,
    length: 0,
    index: 0,
    size: 0
  }

  _getIndex() {
    let result = { start: 0, end: 0 }
    // 不需要分页
    // if (this.pageInfo.total == 0) {}
    // 仅一页
    if (this.pageInfo.size < 2) {
      result.end = this.pageInfo.total
    }
    // 完全分页
    else {
      const startIndex = this.pageInfo.index * this.pageInfo.size
      let endIndex = startIndex + this.pageInfo.size
      //
      if (endIndex > this.pageInfo.total - 1) {
        endIndex = this.pageInfo.total
      }
      //
      result = {
        start: startIndex,
        end: endIndex
      }
    }
    return result
  }

  /**
   * @summary 刷新数据
   * @param datas 可替换数据
   */
  refreshData(datas = null) {
    if (datas) this.dataSource = datas
    if (!this.dataSource) this.dataSource = []
    // 刷新总条数
    this.pageInfo.total = this.dataSource.length
    // 刷新总页数
    this.pageInfo.length = Math.ceil(this.dataSource.length / this.pageInfo.size)
    // 刷新展示数据
    const index = this._getIndex()
    this.dataShow = this.dataSource.slice(index.start, index.end)
  }

  // 翻页及跳转
  _step(step: number) {
    const tempIndex = this.pageInfo.index + step
    if (tempIndex > -1 && tempIndex < this.pageInfo.length) {
      this.pageInfo.index = tempIndex
    }
    this.refreshData()
  }
  /**
   * @summary 向前翻页
   */
  prev() {
    this._step(-1)
  }
  /**
   * @summary 向后翻页
   */
  next() {
    this._step(1)
  }
  /**
   * @summary 跳转
   */
  goTo(index: number) {
    if (index >= 0 && index < this.pageInfo.total) {
      this.pageInfo.index = index * 1
      this.refreshData()
    }
  }

  /**
   * @summary 设置新页面容量
   */
  setSize(size: number) {
    this.pageInfo.size = size
    this.refreshData()
  }
}
export interface PageInfos {
  total: number // 总条数
  length: number // 总页数
  index: number // 页面索引
  size: number // 单页数量
  sizes?: number[] // 可选的单页数量
}

/**
 * @summary 定时器队列
 */
export class ExInterval {
  lastID: any = null
  list: any[] = []

  /**
   * @summary 创建定时器
   * @param name 名称
   * @param func 触发的方法
   * @param time 频次
   */
  create(name: string, func: Function, time: number) {
    const id = setInterval(function () {
      console.info('[Interal] ' + name + ': ', id, time + 'ms')
      func()
    }, time)
    //
    this.lastID = id
    this.list.push(id)
    //
    return id
  }

  /**
   * @summary 停止定时器
   * @param id 停止特定的id，如果不传则停止最近的哪一个
   */
  stop(id: any = null) {
    if (!id) id = this.lastID
    clearInterval(id)
    //
    this.list.splice(
      this.list.findIndex((a) => a == id),
      1
    )
    this.lastID = this.list[this.list.length - 1]
  }

  /**
   * @summary 停止list中所有定时器
   */
  clear() {
    if (this.list.length > 0) {
      this.list.map((id) => {
        clearInterval(id)
      })
    }
    this.list = []
    console.info('[Interval]:', 'Clear')
  }

  /**
   * @summary 停止所有定时器
   */
  clearAll() {
    const end = window.setInterval(function () { }, 100 * 1000)
    for (let loop = 0; loop <= end; loop++) {
      clearInterval(loop)
    }
    //
    this.list = []
    console.info('[Interval]:', 'Clear All')
  }
}

/**
 * @summary 深拷贝数组
 */
export const deepCopyArr = function (arr: any[]): any[] {
  const clonedArr = []
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      // 递归拷贝子数组
      clonedArr[i] = deepCopyArr(arr[i])
    } else if (typeof arr[i] === 'object' && arr[i] !== null) {
      // 拷贝子对象
      clonedArr[i] = Object.assign({}, arr[i])
    } else {
      // 拷贝基本类型值
      clonedArr[i] = arr[i]
    }
  }
  return clonedArr
}
/**
 * @summary 深拷贝对象
 */
export const deepCopyObj = function (obj: any): any {
  const objCopy: any = {}
  for (const item in obj) {
    switch (typeof obj[item]) {
      case 'object': {
        if (obj[item] instanceof Array) {
          objCopy[item] = deepCopyArr(obj[item])
        } else {
          objCopy[item] = deepCopyObj(obj[item])
        }
        break
      }
      default: {
        objCopy[item] = obj[item]
        break
      }
    }
  }
  return objCopy
}
/**
 * @summary 对比值
 */
export const compareObj = function (obj1: any, obj2: any, props: any = null): boolean {
  // 判断类型是否相等
  if (typeof obj1 !== typeof obj2) {
    return false
  }

  // 如果是基本类型，直接比较值是否相等
  if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) {
    return obj1 === obj2
  }

  // 如果是数组，比较每个元素是否相等
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) {
      return false
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!compareObj(obj1[i], obj2[i])) {
        return false
      }
    }
    return true
  }

  // 比较对象的每个属性是否相等
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  if (keys1.length !== keys2.length) {
    return false
  }
  for (const key of keys1) {
    if (!obj2.hasOwnProperty(key)) {
      return false
    }
    if (!compareObj(obj1[key], obj2[key])) {
      return false
    }
  }
  return true
}
