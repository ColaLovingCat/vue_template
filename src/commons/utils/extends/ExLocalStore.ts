/**
 * @summary 本地存储
 */
export const ExLocalStore = {
  /**
   * @summary 存储
   * @param day 过期时间，单位：天，默认30
   */
  set: function (prop: string, value: any, day = 30) {
    const time = new Date().setHours(new Date().getHours() + 30 * day);
    localStorage.setItem(
      prop,
      JSON.stringify({
        data: value,
        time: time,
      })
    );
  },
  /**
   * @summary 获取
   * @return 过期为null
   */
  get: function (prop: string) {
    const data = localStorage.getItem(prop);
    if (!data) {
      return null;
    }
    const obj = JSON.parse(data);
    if (new Date().getTime() > obj.time) {
      // 过期
      localStorage.removeItem(prop);
      return null;
    } else {
      return obj.data;
    }
  },
  /**
   * @summary 删除
   */
  delete: function (prop: string) {
    localStorage.removeItem(prop);
  },
  /**
   * @summary 清空
   */
  clear: function () {
    localStorage.clear();
  },
};
