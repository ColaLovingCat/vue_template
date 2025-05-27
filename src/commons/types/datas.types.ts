export interface SystemInfos {
  name: string;
  loginMode: "sso-only" | "sso-iuser" | "sso-local";
  //
  azure: "request" | "configs";
  azureAuto: boolean;
  azureConfigs: {
    host: string;
    client_id: string;
    scope: string;
    response_type: string;
    redirect_uri?: string;
  };
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
