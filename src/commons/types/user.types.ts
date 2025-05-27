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
