import request from "../../axios/index";
import { PREFIX } from "../../utils/CONSTANT";

// 获取流程图列表
export const findFlowChartList = async (params: any) => {
  return request({
    method: "POST",
    url: "/FlowChart/findFlowChartList",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取流程图详情
export const findFlowChartInfo = async (params: any) => {
  return request({
    method: "POST",
    url: "/FlowChart/findFlowChartInfo",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
