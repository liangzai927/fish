import request from "../../axios/index";
import { PREFIX } from "../../utils/CONSTANT";

// 获取设备树
export const equipTreeList = async (params: any) => {
  return request({
    method: "GET",
    url: "/common/getCategoryList",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取设备
export const equipFileList = async (params: any) => {
  return request({
    method: "GET",
    url: "/equip/getEquipRecordList",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取设备详情
export const equipMeterFileDetail = async (params: any) => {
  return request({
    method: "GET",
    url: "/equip/getEquipMaterials",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取设备维保记录
export const getDefendTaskHttp = async (params: any) => {
  return request({
    method: "GET",
    url: "/equip/getEquipDefendTask",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
