export interface FormItem {
  type:
    | "input"
    | "textarea"
    | "select"
    | "switch"
    | "radios"
    | "checks"
    | "date"
    | "datetime"
    | "date-range"
    | "datetime-range";
  key: string;
  label: string;
  // Common
  /** 必填验证 */
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean | Function;
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
