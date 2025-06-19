/**
 * @summary 分页类型
 * @member {Pagination} pagination
 * @member {T[ ]} rows
 * @member {T[ ]} dataSource
 */
export class ExPaginator<T> {
  constructor(datas: T[], size: number) {
    this.dataSource = datas;
    this.pagination.size = size;
    //
    this.pagination.index = 0;
    this._refreshData();
  }

  // 数据源
  dataSource: T[] = [];
  // 展示数据
  rows: T[] = [];

  // 分页信息
  pagination: Pagination = {
    index: 0,
    total: 0,
    length: 0,
    size: 0,
  };

  /**
   * 页面索引
   * @private
   */
  _getIndex() {
    let result = { start: 0, end: 0 };
    // 不需要分页
    // if (this.pageInfo.total == 0) {}
    // 仅一页
    if (this.pagination.size < 2) {
      result.end = this.pagination.total;
    }
    // 完全分页
    else {
      const startIndex = this.pagination.index * this.pagination.size;
      let endIndex = startIndex + this.pagination.size;
      //
      if (endIndex > this.pagination.total - 1) {
        endIndex = this.pagination.total;
      }
      //
      result = {
        start: startIndex,
        end: endIndex,
      };
    }
    return result;
  }
  /**
   * 刷新数据
   * @private
   */
  _refreshData() {
    if (!this.dataSource) this.dataSource = [];
    // 刷新总条数
    this.pagination.total = this.dataSource.length;
    // 刷新总页数
    this.pagination.length = Math.ceil(
      this.dataSource.length / this.pagination.size
    );
    // 刷新展示数据
    const index = this._getIndex();
    this.rows = this.dataSource.slice(index.start, index.end);
  }
  
  /**
   * 翻页及跳转
   * @private
   */
  _step(step: number) {
    const tempIndex = this.pagination.index + step;
    if (tempIndex > -1 && tempIndex < this.pagination.length) {
      this.pagination.index = tempIndex;
    }
    this._refreshData();
  }
  /**
   * @summary 向前翻页
   */
  prev() {
    this._step(-1);
  }
  /**
   * @summary 向后翻页
   */
  next() {
    this._step(1);
  }
  /**
   * @summary 跳转
   * @param index 页面索引
   */
  goTo(index: number) {
    if (index >= 0 && index < this.pagination.total) {
      this.pagination.index = index * 1;
      this._refreshData();
    }
  }

  /**
   * @summary 设置新页面大小
   * @param size 页面大小
   */
  setSize(size: number) {
    this.pagination.size = size;
    this._refreshData();
  }

  /**
   * @summary 设置新数据源
   * @param datas 替换数据
   */
  setDatas(datas: T[]) {
    if (datas) this.dataSource = datas;
    this._refreshData();
  }
}
interface Pagination {
  index: number; // 页面索引
  total: number; // 总条数
  length: number; // 总页数
  size: number; // 单页数量
  options?: number[]; // 可选的单页数量
}
