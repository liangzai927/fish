import request from "../../axios/index";
import { PREFIX } from "../../utils/CONSTANT";

// 获取报表列表
export const getUrportList = async (params: any) => {
  return request({
    method: "GET",
    url: "/uReport/getDataSetTempList",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 【数据集模板】详情
export const getDataSetTemp = async (params: any) => {
  return request({
    method: "GET",
    url: "/uReport/getDataSetTemp",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 增强报表(报表数据查询)
export const queryReportData = async (params: any) => {
  return request({
    method: "POST",
    url: "/uReport/previewExcel",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 搜索参数列表
export const getSearchParamList = async (params: any) => {
  return request({
    method: "GET",
    url: "/uReport/getSearchParamList",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
