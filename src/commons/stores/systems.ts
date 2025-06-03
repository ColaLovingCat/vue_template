import { defineStore } from "pinia";
import { Modal } from "ant-design-vue";

import type { SystemInfos } from "../types/datas.types";

export const useSystemInfosStore = defineStore("systemInfos", {
  state(): { systemInfos: SystemInfos; systemStatus: any } {
    return {
      systemInfos: {
        name: "",
        loginMode: "sso-only",
        //
        azure: "configs",
        azureAuto: false,
        azureConfigs: {
          host: "",
          client_id: "",
          scope: "",
          response_type: "",
          redirect_uri: "",
        },
      },
      systemStatus: {
        theme: "default",
        headerShow: true, // 隐藏头部，全屏
        logoutShow: false, // 避免多个注销弹窗
      },
    };
  },
  actions: {
    init() {
      this.systemStatus.logoutShow = false;
    },
    initFromConfig(configs: Partial<SystemInfos>) {
      Object.assign(this.systemInfos, configs);
    },
    setAzure(values: any) {
      Object.assign(this.systemInfos.azureConfigs, values);
    },
    setHeader(status: boolean) {
      this.systemStatus.headerShow = status;
    },
    setTheme(theme: string) {
      this.systemStatus.theme = theme;
    },
    //
    showLogout(callback: Function) {
      if (!this.systemStatus.logoutShow) {
        this.systemStatus.logoutShow = true;
        //
        Modal.warning({
          title: "Authentication Required",
          content: "You will be redirected to the Login page.",
          onOk: () => {
            this.systemStatus.logoutShow = false;
            //
            callback();
          },
        });
      }
    },
  },
});
