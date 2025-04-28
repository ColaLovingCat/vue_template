export interface SystemInfos {
  name: string;
  //
  autoSSO: boolean;
  clientID: string;
  tenant: string;
}
export interface UserInfos {
  num: string;
  ntAccount?: string;
  name: string;
  deptID?: string;
  deptName?: string;
  email?: string;
  isActive?: boolean;
  roles?: string | Array<string> | null;
}

export interface MenuInfos {
  index: number | string;
  key: string;
  icon?: string;
  title: string;
  lang: string;
  path: string;
  infos?: any;
  children?: MenuInfos[];
}
export class MenuClass {
  index?: number | string = "";
  key?: string = "";
  icon?: string = "";
  title?: string = "";
  lang?: string = "";
  path?: string = "";
  children?: MenuInfos[] = [];
}

export interface FormItem {
  type: string;
  key: string;
  label: string;
  // Common
  required?: boolean;
  disabled?: boolean;
  activeClear?: boolean;
  // Input
  isPassword?: boolean;
  // Select
  isMulti?: boolean;
  activeSearch?: boolean;
  list?: DrpItem[];
}

export interface DrpItem {
  key?: string | number;
  value?: string | number;
  label: string;
}

export interface TableInfos {
  pagination: Pagination;
  columns: ColumInfos[];
  rows: any[];
}
export interface Pagination {
  index: number; // 当前页数
  total: number; // 总行数
  size: number; // 每页行数
  options: number[];
}
export interface ColumInfos {
  key: string | number;
  label: string;
  visiable?: boolean;
}

export class LoadingInfos {
  _value: number;

  constructor() {
    this._value = 0;
  }

  get status() {
    return this._value > 0;
  }

  loading = () => {
    this._value++;
  };
  end = () => {
    this._value > 0 ? this._value-- : void 0;
  };
  clear = () => {
    this._value = 0;
  };
}
