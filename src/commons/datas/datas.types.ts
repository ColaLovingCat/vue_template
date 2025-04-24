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

export interface DrpItem {
  value: number | string;
  label: string;
}

export interface TableInfos {
  pagination: Pagination;
  columns: ColumInfos[];
  rows: any[];
}
export interface Pagination {
  total: number;
  index: number;
  size: number;
  options: number[];
}
export interface ColumInfos {
  key: string | number;
  title: string;
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
