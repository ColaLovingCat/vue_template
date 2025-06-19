/**
 * @summary 针对Promise的优化
 */
export const ExPromise = {
  /**
   * @summary 执行Promise队列，若其中一个出错则报错
   */
  promiseFlow: function (arr: Promise<any>[], callback: Function) {
    Promise.all(arr)
      .then((res) => {
        callback({
          status: 1,
          message: "",
        });
      })
      .catch((err) => {
        callback({
          status: -1,
          message: err,
        });
      });
  },
};
