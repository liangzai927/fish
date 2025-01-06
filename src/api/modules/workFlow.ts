import request from "../../axios/index";
import { PREFIX } from "../../utils/CONSTANT";
import type { FlowOrderPage } from "../../types/workFlow";

// 获取审批中心流程列表
export const workFlowList = async (data: FlowOrderPage) => {
  return request({
    method: "GET",
    url: "/workflow/process/selectList",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取可发起列表
export const processList = async (data?: any) => {
  return request({
    method: "GET",
    url: "/workflow/process/list",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 发起流程
export const creatProcessExample = async (data: any) => {
  return request({
    method: "GET",
    url: "/workflow/process/getProcessInfromation",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取可发起列表
export const processInstanteDetail = async (data?: any) => {
  return request({
    method: "GET",
    url: "/workflow/instance/instanceDetail",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 更新节点审批人
export const updateVariables = async (data: any) => {
  return request({
    method: "post",
    url: "/workflow/instance/updateVariables",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 发起流程
export const startProcess = async (data: any) => {
  return request({
    method: "POST",
    url: "/workflow/process/startHasForm",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 通过审批
export const completeInstanceState = async (data: any) => {
  return request({
    method: "POST",
    url: "/workflow/task/complete",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 拒绝审批
export const rejectInstanceState = async (data: any) => {
  return request({
    method: "POST",
    url: "/workflow/task/reject",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 部门列表
export const orgListHttp = async (data?: any) => {
  return request({
    method: "POST",
    url: "/Organization/findOrganizationList",
    data,
    prefix: PREFIX.permissionsPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 按照部门查询人员
export const userByOrgHttp = async (data?: any) => {
  return request({
    method: "POST",
    url: "/user/findUserListByOrg",
    data,
    prefix: PREFIX.permissionsPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 用户列表
export const managerListHttp = async (data: any) => {
  return request({
    method: "POST",
    url: "/user/findUserList",
    data: {
      tenantId: 1,
    },
    prefix: PREFIX.permissionsPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 上传文件
export const uploadFiles = async (data: any) => {
  return request({
    method: "POST",
    url: "/file/upload",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
