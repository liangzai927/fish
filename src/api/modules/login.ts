import request from "../../axios/index";
import { PREFIX } from "../../utils/CONSTANT";

export const login = async (params: any) => {
  return request({
    method: "POST",
    url: "/oauth/user/login",
    data: params,
    prefix: "",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 钉钉免登录
export const dingdingLogin = async (params: { type: any; code: string }) => {
  return request({
    method: "POST",
    url: "/oauth/user/signLogin",
    params,
    prefix: "",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getPageList = async (data: any) => {
  return request({
    method: "POST",
    url: "/page/findUserPagePermissionList",
    data,
    prefix: PREFIX.permissionsPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const loginOutHttp = async (data?: any) => {
  return request({
    method: "POST",
    url: "/user/logout",
    data,
    prefix: PREFIX.permissionsPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取租户信息
export const getTenantData = async (data?: any) => {
  return request({
    method: "POST",
    url: "/Tenant/findTenantInfo",
    data,
    prefix: PREFIX.permissionsPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 多租户获取租户列表
export const getTenantList = async (data?: any) => {
  return request({
    method: "POST",
    url: "/oauth/user/getTenantList",
    data,
    prefix: '',
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 租户绑定
export const bindTenant = async (data?: any) => {
  return request({
    method: "POST",
    url: "/oauth/user/bindTenant",
    data,
    prefix: '',
    headers: {
      "Content-Type": "application/json",
    },
  });
};
