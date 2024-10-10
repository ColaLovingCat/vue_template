export interface UserInfos {
  num: string
  ntAccount?: string
  name: string
  deptID?: string
  deptName?: string
  email?: string
  isActive?: boolean
  roles?: string | Array<string> | null
}

export interface SystemInfos {
  name: string
  //
  autoSSO: boolean
  clientID: string
  tenant: string
  //
  headerStatus: boolean
  theme: string
}

export interface MenuInfos {
  index: number | string
  key: string
  title: string
  lang: string
  path: string
  icon?: string
  infos?: any
  children?: MenuInfos[]
}

export class MenuClass {
  index: number | string = ''
  key: string = ''
  icon?: string = ''
  title: string = ''
  lang?: string = ''
  path: string = ''
  children?: MenuInfos[] = []
}

export class LoadingInfos {
  _value: number

  constructor() {
    this._value = 0
  }

  get status() {
    return this._value > 0
  }

  loading = () => {
    this._value++
  }
  end = () => {
    this._value > 0 ? this._value-- : void 0
  }
  clear = () => {
    this._value = 0
  }
}
