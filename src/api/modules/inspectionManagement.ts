import request from "../../axios/index";
import { PREFIX } from "../../utils/CONSTANT";
import type {
  InspectionTaskPage,
  InspectionTaskItem,
  InspectionTaskSubmit,
  InspectHidDangerItem,
} from "../../types/inspection";

// 获取预防性维护任务
export const preventiveTaskList = async (params: InspectionTaskPage) => {
  return request({
    method: "GET",
    url: "/equip/getDefendMyTask",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 维保任务提交
export const preventiveTaskConfirm = async (params: InspectionTaskItem[]) => {
  return request({
    method: "GET",
    url: "/equip/commitDefendTask",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取巡检任务(我的任务)
export const inspectMyTaskList = async (params: InspectionTaskPage) => {
  return request({
    method: "GET",
    url: "/equip/getInspectMyTask",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取巡检任务详情
export const inspectTaskitem = async (params: number) => {
  return request({
    method: "GET",
    url: "/equip/getInspectTask",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 任务巡检点确认
export const inspectItemConfirm = async (data: InspectionTaskItem[]) => {
  return request({
    method: "POST",
    url: "/equip/commitInspectPoint",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
// 巡检任务提交
export const inspectTaskSub = async (params: any) => {
  return request({
    method: "GET",
    url: "/equip/commitInspectTask",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
// 隐患列表
export const inspectHidDangerList = async (params: any) => {
  return request({
    method: "GET",
    url: "/equip/getInspectItemReformList",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
// 隐患整改
export const commitInspectHidDanger = async (data: InspectHidDangerItem) => {
  return request({
    method: "POST",
    url: "/equip/commitInspectItemReform",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
// 任务隐患确定
export const inspectHidDangerConfirm = async (params: InspectionTaskSubmit) => {
  return request({
    method: "GET",
    url: "/equip/getInspectItemDanger",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
// 任务隐患提交
export const inspectHidDangerSub = async (data: number | string[]) => {
  return request({
    method: "POST",
    url: "/equip/addInspectItemReform",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
// 获取维保详情
export const getDefendTask = async (params: { id: number }) => {
  return request({
    method: "GET",
    url: "/equip/getDefendTask",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
