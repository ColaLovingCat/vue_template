export interface TableInfos {
  pagination: Pagination
  columns: ColumInfos[]
  rows: any[]
}

export interface Pagination {
  index: number // 当前页数
  total: number // 总行数
  size: number // 每页行数
  options?: number[] // 可选择的行数
}
export interface ColumInfos {
  key: string | number
  dataIndex?: string | number
  title: string
  isVisible?: boolean
  isFilter?: boolean
  sort?: string
}
