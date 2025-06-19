/**
 * @summary 定时器队列类型
 */
export class ExInterval {
  lastID: any = null;
  list: any[] = [];

  /**
   * @summary 创建定时器
   * @param func 触发的方法
   * @param time 频次
   * @param name 名称
   */
  create(func: Function, time: number, name: string) {
    const id = setInterval(function () {
      console.info("[Interal]", { name, time, id });
      func();
    }, time);
    //
    this.lastID = id;
    this.list.push(id);
    //
    return id;
  }

  /**
   * @summary 停止定时器
   * @param id 停止特定的id，如果不传则停止最近的那一个
   */
  stop(id: any = null) {
    if (!id) id = this.lastID;
    clearInterval(id);
    //
    this.list.splice(
      this.list.findIndex((a) => a == id),
      1
    );
    this.lastID = this.list[this.list.length - 1];
  }

  /**
   * @summary 停止list中所有定时器
   */
  clear() {
    if (this.list.length > 0) {
      this.list.map((id) => {
        clearInterval(id);
      });
    }
    this.list = [];
    console.info("[Interval]:", "Clear");
  }

  /**
   * @summary 停止所有定时器
   */
  clearAll() {
    const end = window.setInterval(function () {}, 100 * 1000);
    for (let loop = 0; loop <= end; loop++) {
      clearInterval(loop);
    }
    //
    this.list = [];
    console.info("[Interval]:", "Clear All");
  }
}

/**
 * @summary 每天定时run任务
 * @description 例如：每天 03:30 自动执行某个回调函数
 *
 * @param {() => void} callback - 需要定时执行的任务函数
 * @param {{ hour: number, minute: number }} triggerTime - 触发时间（24小时制）
 *
 * @example
 * // 每天凌晨 03:30 执行 myTask
 * scheduleNextUpdate(myTask, { hour: 3, minute: 30 });
 */
export const scheduleTask = (
  callback: () => void,
  triggerTime: { hour: number; minute: number }
): void => {
  const now = new Date();

  // 生成今天的目标时间
  const target = new Date();
  target.setHours(triggerTime.hour, triggerTime.minute, 0, 0);

  // 如果当前时间已经过了今天的目标时间，则调度到明天
  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  // 计算时间差（毫秒）
  const delay = target.getTime() - now.getTime();

  console.log(
    `[Timer] next: ${target.toLocaleString()}, left: ${(
      delay /
      1000 /
      60
    ).toFixed(1)} mins`
  );

  // 使用 setTimeout 调度
  setTimeout(() => {
    callback();
    // 递归调用，保证每天都调度一次
    scheduleTask(callback, triggerTime);
  }, delay);
};
