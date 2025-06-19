/**
 * @summary Date 拓展方法
 * @param format     时间格式化
 * @param formatUTC  UTC时间
 * @param formatShow 时间展示
 * @param add        增加相应时间
 * @param gap        时间差值
 * @param period     周期时间段
 */
export interface ExDate {
  /**
   * @summary 时间格式化
   * @param date 时间
   * @param format "yyyy-MM-dd HH:mm:ss"
   */
  format(date: any, format?: string): string;
  /**
   * @summary 获取UTC时间戳
   */
  formatUTC(date: any): number;
  /**
   * @summary 格式化显示日期的不同阶段
   * @returns 3 days ago
   */
  formatShow(date: any, format?: string): string;
  /**
   * @summary 时间增减
   * @param strInterval y|M|q|w|d|h|m|s
   */
  add(date: Date | string, interval: IntervalType, num: number): Date;
  /**
   * @summary 时间差值 A-B，默认返回天数
   */
  gap(
    dateA: Date | string,
    dateB: Date | string,
    interval?: IntervalType
  ): number | null;
  /**
   * @summary 获取周期的时间段
   */
  period(
    type:
      | "current_shift"
      | "24h"
      | "3d"
      | "7d"
      | "last_week"
      | "last_month"
      | "last_year"
  ): string[];
}
type IntervalType = "y" | "M" | "q" | "w" | "d" | "h" | "m" | "s";
export const ExDate: ExDate = {
  format(date: any, format: string | undefined = undefined) {
    if (date === "" || date === null) {
      return "";
    }
    //无参数
    if ((date == undefined && format === undefined) || date === "now") {
      date = new Date();
    }
    if (format === undefined) {
      format = "yyyy-MM-dd HH:mm:ss";
    }
    if (typeof date === "string") {
      date = date.replace("T", " ");
    }
    date = new Date(date);
    //
    const map: any = {
      y: date.getFullYear() + "", //年份
      M: date.getMonth() + 1 + "", //月份
      d: date.getDate() + "", //日
      H: date.getHours(), //小时 24
      m: date.getMinutes() + "", //分
      s: date.getSeconds() + "", //秒
      q: Math.floor((date.getMonth() + 3) / 3) + "", //季度
      f: date.getMilliseconds() + "", //毫秒
    };
    //小时 12
    if (map["H"] > 12) {
      map["h"] = map["H"] - 12 + "";
    } else {
      map["h"] = map["H"] + "";
    }
    map["H"] += "";

    const reg = "yMdHhmsqf";
    let all = "",
      str = "";
    for (let i = 0, n = 0; i < reg.length; i++) {
      n = format.indexOf(reg[i]);
      if (n < 0) {
        continue;
      }
      all = "";
      for (; n < format.length; n++) {
        if (format[n] != reg[i]) {
          break;
        }
        all += reg[i];
      }
      if (all.length > 0) {
        if (all.length == map[reg[i]].length) {
          str = map[reg[i]];
        } else if (all.length > map[reg[i]].length) {
          if (reg[i] == "f") {
            str =
              map[reg[i]] +
              new Array(all.length - map[reg[i]].length).fill("0").join("");
          } else {
            str =
              new Array(all.length - map[reg[i]].length).fill("0").join("") +
              map[reg[i]];
          }
        } else {
          switch (reg[i]) {
            case "y":
              str = map[reg[i]].substr(map[reg[i]].length - all.length);
              break;
            case "f":
              str = map[reg[i]].substr(0, all.length);
              break;
            default:
              str = map[reg[i]];
              break;
          }
        }
        format = format.replace(all, str);
      }
    }
    return format;
  },
  formatUTC(date: any): number {
    const dt = new Date(date);
    return Date.UTC(
      dt.getUTCFullYear(),
      dt.getUTCMonth(),
      dt.getUTCDate(),
      dt.getUTCHours(),
      dt.getUTCMinutes(),
      dt.getUTCSeconds(),
      dt.getUTCMilliseconds()
    );
  },
  formatShow: function (date: any, format = "yyyy/MM/dd") {
    const now = new Date().getTime();
    const dt = new Date(date).getTime();
    const diffSec = Math.floor((now - dt) / 1000);

    if (diffSec < 60) return "just submitted";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
    if (diffSec < 15 * 86400) return `${Math.floor(diffSec / 86400)} days ago`;

    return this.format(date, format);
  },
  add: function (date: any, strInterval: IntervalType, num: number): Date {
    const dt = new Date(date);
    switch (strInterval) {
      case "s":
        dt.setSeconds(dt.getSeconds() + num);
        break;
      case "m":
        dt.setMinutes(dt.getMinutes() + num);
        break;
      case "h":
        dt.setHours(dt.getHours() + num);
        break;
      case "d":
        dt.setDate(dt.getDate() + num);
        break;
      case "w":
        dt.setDate(dt.getDate() + 7 * num);
        break;
      case "q":
        dt.setMonth(dt.getMonth() + num * 3);
        break;
      case "M":
        dt.setMonth(dt.getMonth() + num);
        break;
      case "y":
        dt.setFullYear(dt.getFullYear() + num);
        break;
    }
    return dt;
  },
  gap: function (dateA: any, dateB: any, strInterval: IntervalType = "d") {
    try {
      const a = new Date(dateA).getTime();
      const b = new Date(dateB).getTime();
      const diffMs = a - b;

      switch (strInterval) {
        case "s":
          return Math.floor(diffMs / 1000);
        case "m":
          return Math.floor(diffMs / (60 * 1000));
        case "h":
          return Math.floor(diffMs / (60 * 60 * 1000));
        case "d":
        default:
          return Math.floor(diffMs / (24 * 60 * 60 * 1000));
      }
    } catch (e) {
      return null;
    }
  },
  period: function (type: string) {
    const result: any = [null, null];
    //
    const dateNow = new Date();
    let year = dateNow.getFullYear();
    let month = dateNow.getMonth() + 1;
    switch (type) {
      case "current_shift": {
        result[1] = this.format(dateNow, "yyyy/MM/dd HH:mm:ss");
        //
        const hour = dateNow.getHours();
        if (hour < 7) {
          result[0] =
            this.format(this.add(dateNow, "d", -1), "yyyy/MM/dd") + " 19:00:00";
        } else if (hour < 19) {
          result[0] = this.format(dateNow, "yyyy/MM/dd") + " 07:00:00";
        } else {
          result[0] = this.format(dateNow, "yyyy/MM/dd") + " 19:00:00";
        }
        break;
      }
      case "24h": {
        result[0] = this.format(
          this.add(dateNow, "h", -24),
          "yyyy-MM-dd HH:mm:ss"
        );
        result[1] = this.format(dateNow, "yyyy-MM-dd HH:mm:ss");
        break;
      }
      case "3d": {
        result[0] = this.format(
          this.add(dateNow, "d", -3),
          "yyyy-MM-dd HH:mm:ss"
        );
        result[1] = this.format(dateNow, "yyyy-MM-dd HH:mm:ss");
        break;
      }
      case "7d": {
        result[0] = this.format(
          this.add(dateNow, "d", -7),
          "yyyy-MM-dd HH:mm:ss"
        );
        result[1] = this.format(dateNow, "yyyy-MM-dd HH:mm:ss");
        break;
      }
      case "last_week": {
        const dayNum = dateNow.getDay();
        result[0] = this.format(this.add(dateNow, "d", -(dayNum + 6)));
        result[1] = this.format(this.add(dateNow, "d", -dayNum));
        break;
      }
      case "last_month": {
        if (month == 1) {
          year = year - 1;
          month = 12;
        } else {
          month = month - 1;
        }
        result[0] = this.format(year + "-" + month + "-1");
        result[1] = this.format(
          year + "-" + month + "-" + new Date(year, month, 0).getDate()
        );
        break;
      }
      case "last_year": {
        result[0] = this.format(year - 1 + "-1-1");
        result[1] = this.format(year - 1 + "-12-31");
        break;
      }
    }
    return result;
  },
};
