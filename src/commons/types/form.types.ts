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
