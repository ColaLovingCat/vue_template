import type { NodeInfos } from "../contents/types";
import * as extend from "@/commons/utils/extends";

// 定义节点的唯一code
export enum CategoryID {
  // 触发方式
  Trigger_Manually = "Trigger_Manually",
  Trigger_Schedule = "Trigger_Schedule",
  Trigger_WebCall = "Trigger_WebCall",
  Trigger_Chat = "Trigger_Chat",
  // 数据输入
  Data_Input_Const = "Data_Input_Const",
  Data_Input_File = "Data_Input_File",
  Data_Input_SQL = "Data_Input_SQL",
  Data_Input_HTTP_Request = "Data_Input_HTTP_Request",
  // 逻辑节点
  Logi_If = "Logi_If",
  Logi_Switch = "Logi_Switch",
  Logi_Loops = "Logi_Loops",
  Logi_Loops_Continue = "Logi_Loops_Continue",
  Logi_Loops_Break = "Logi_Loops_Break",
  Logi_Merge = "Logi_Merge",
  Logi_Error_Output = "Logi_Error_Output",
  // 数据处理
  Data_Process_Filter = "Data_Process_Filter",
  Data_Process_Sort = "Data_Process_Sort",
  Data_Process_Remove_Duplicates = "Data_Process_Remove_Duplicates",
  Data_Process_Summarize = "Data_Process_Summarize",
  Data_Process_Code = "Data_Process_Code",
  // 数据输出
  Data_Output_Data = "Data_Output_Data",
  Data_Output_File = "Data_Output_File",

  // 数据输入
  DataEx_Input_File = "DataEx_Input_File",
  DataEx_Input_SQL = "DataEx_Input_SQL",
  DataEx_Input_Position = "DataEx_Input_Position",
  DataEx_Input_DMC = "DataEx_Input_DMC",
  ParaMonitoring_param_select_szh = "ParaMonitoring_param_select_szh",
  ParaMonitoring_param_select_wuj = "ParaMonitoring_param_select_wuj",
  // 数据处理
  DataEx_Processing = "DataEx_Processing",
  // 数据展示
  DataEx_Show = "DataEx_Show",
  // 数据拼接
  DataEx_Connection_hstack = "DataEx_Connection_hstack",
  DataEx_Connection_vstack = "DataEx_Connection_vstack",
  // 数据分析
  DataExp_Describe = "DataExp_Describe",
  DataExp_Correlation = "DataExp_Correlation",
  DataExp_Failure_Analysis = "DataExp_Failure_Analysis",
  // 数据输出
  DataEx_Output_Download = "DataEx_Output_Download",
  // 智能问答
  DataExp_Chat = "DataExp_Chat",
  // 规则
  ParaMonitor_Rule_Sigma = "ParaMonitor_Rule_Sigma",
  ParaMonitor_Rule_CPK = "ParaMonitor_Rule_CPK",
  ParaMonitor_Rule_CMK = "ParaMonitor_Rule_CMK",
  ParaMonitor_Rule_Multi = "ParaMonitor_Rule_Multi",
  // 周期性任务定制
  ParaMonitor_Task_Periodic = "ParaMonitor_Task_Periodic",
}

// 获取节点的图标
export const getIcon = (category: string) => {
  let result = "fa-database";
  switch (category) {
    case "触发方式": {
      result = "fa-bell";
      break;
    }
    case CategoryID.Trigger_Manually: {
      result = "fa-arrow-pointer";
      break;
    }
    case CategoryID.Trigger_Schedule: {
      result = "fa-clock";
      break;
    }
    case CategoryID.Trigger_WebCall: {
      result = "fa-tower-broadcast";
      break;
    }
    case CategoryID.Trigger_Chat: {
      result = "fa-comment";
      break;
    }
    //
    case "数据输入": {
      result = "fa-cloud-arrow-up";
      break;
    }
    case CategoryID.Data_Input_Const: {
      result = "fa-terminal";
      break;
    }
    case CategoryID.Data_Input_File: {
      result = "fa-file-arrow-up";
      break;
    }
    case CategoryID.Data_Input_SQL: {
      result = "fa-database";
      break;
    }
    case CategoryID.Data_Input_HTTP_Request: {
      result = "fa-cloud";
      break;
    }
    //
    case "逻辑节点": {
      result = "fa-code-fork";
      break;
    }
    case CategoryID.Logi_If: {
      result = "fa-arrows-left-right";
      break;
    }
    case CategoryID.Logi_Switch: {
      result = "fa-arrow-right-arrow-left";
      break;
    }
    case CategoryID.Logi_Loops: {
      result = "fa-arrows-rotate";
      break;
    }
    case CategoryID.Logi_Loops_Continue: {
      result = "fa-arrow-right-to-bracket";
      break;
    }
    case CategoryID.Logi_Loops_Break: {
      result = "fa-arrow-right-from-bracket";
      break;
    }
    case CategoryID.Logi_Merge: {
      result = "fa-code-pull-request";
      break;
    }
    case CategoryID.Logi_Error_Output: {
      result = "fa-triangle-exclamation";
      break;
    }
    //
    case "数据处理": {
      result = "fa-table";
      break;
    }
    case CategoryID.Data_Process_Filter: {
      result = "fa-filter";
      break;
    }
    case CategoryID.Data_Process_Sort: {
      result = "fa-sort";
      break;
    }
    case CategoryID.Data_Process_Remove_Duplicates: {
      result = "fa-clone";
      break;
    }
    case CategoryID.Data_Process_Summarize: {
      result = "fa-clipboard-list";
      break;
    }
    case CategoryID.Data_Process_Code: {
      result = "fa-code";
      break;
    }
    //
    case "数据输出": {
      result = "fa-file-export";
      break;
    }
    case CategoryID.Data_Output_Data: {
      result = "fa-file-export";
      break;
    }
    case CategoryID.Data_Output_File: {
      result = "fa-download";
      break;
    }

    //
    case CategoryID.DataEx_Input_File: {
      result = "fa-upload";
      break;
    }
    case CategoryID.DataEx_Input_SQL: {
      result = "fa-database";
      break;
    }
    case CategoryID.DataEx_Input_Position: {
      result = "fa-diagram-project";
      break;
    }
    case CategoryID.DataEx_Input_DMC: {
      result = "fa-barcode";
      break;
    }
    case "参数配置": {
      result = "fa-toggle-on";
      break;
    }
    case "数据处理":
    case CategoryID.DataEx_Processing: {
      result = "fa-table";
      break;
    }
    case "数据展示":
    case "数据拼接":
    case CategoryID.DataEx_Show: {
      result = "fa-table-list";
      break;
    }
    case CategoryID.DataEx_Connection_hstack: {
      result = "fa-diagram-next";
      break;
    }
    case CategoryID.DataEx_Connection_vstack: {
      result = "fa-diagram-successor";
      break;
    }
    case "监控规则配置": {
      result = "fa-screwdriver-wrench";
      break;
    }
    case CategoryID.ParaMonitor_Rule_Sigma: {
      result = "fa-s";
      break;
    }
    case CategoryID.ParaMonitor_Rule_CPK: {
      result = "fa-p";
      break;
    }
    case CategoryID.ParaMonitor_Rule_CMK: {
      result = "fa-m";
      break;
    }
    case CategoryID.ParaMonitor_Rule_Multi: {
      result = "fa-screwdriver-wrench";
      break;
    }
    case "监控任务部署":
    case CategoryID.ParaMonitor_Task_Periodic: {
      result = "fa-list-check";
      break;
    }
    case "数据分析": {
      result = "fa-stethoscope";
      break;
    }
    case CategoryID.DataExp_Describe: {
      result = "fa-book";
      break;
    }
    case CategoryID.DataExp_Correlation: {
      result = "fa-magnifying-glass-chart";
      break;
    }
    case CategoryID.DataExp_Failure_Analysis: {
      result = "fa-circle-exclamation";
      break;
    }
    case CategoryID.DataExp_Chat: {
      result = "fa-comments";
      break;
    }
    case CategoryID.DataEx_Output_Download: {
      result = "fa-cloud-arrow-down";
      break;
    }
    default: {
      break;
    }
  }
  return result;
};

// 基于category生成node所需的基础信息
export const getNode = (type: string, category: any): NodeInfos => {
  let params = {};
  let preCheck = "none";
  let model = "normal";
  let ports = [
    { id: "left", group: "left" },
    { id: "right", group: "right" },
  ];
  //
  switch (category.id) {
    case CategoryID.Trigger_Schedule: {
      params = {
        taskName: "",

      };
      ports = [{ id: "right", group: "right" }];
      break;
    }
  }
  //
  return {
    id: "",
    shape: "flows-node",
    label: category.name,
    width: 250,
    height: 50,
    data: {
      id: "",
      flowID: "",
      name: "",
      isStencil: true,
      type,
      category: { ...category },
      preCheck,
      preInfos: [],
      datas: {},
      params,
      model,
      status: "",
      resultID: null,
      result: {},
    },
    ports,
  };
};

//
export const getRunInfos = (data: any, params: any) => {
  let methodName: string = "startUpload";
  switch (data.category.id) {
    case CategoryID.DataEx_Input_File: {
      methodName = "startUpload";
      break;
    }
  }
  return {
    methodName,
    params,
  };
};
