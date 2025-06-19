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

export interface UserInfos {
  id?: string;
  userno: string;
  ntAccount?: string;
  username: string;
  password?: string;
  email?: string;
  avatar?: string;
  deptID?: string;
  deptName?: string;
  status?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  roles?: string | Array<string> | null;
}
