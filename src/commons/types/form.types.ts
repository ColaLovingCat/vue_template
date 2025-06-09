export interface FormItem {
  type: string;
  key: string;
  label: string;
  // Common
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  activeClear?: boolean;
  // Input
  isPassword?: boolean;
  isEmail?: boolean;
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
