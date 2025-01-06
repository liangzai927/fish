import request from "../../axios/index";
import { PREFIX } from "../../utils/CONSTANT";

// 获取可视化列表
export const findDashboardListForPaging = async (params: any) => {
  return request({
    method: "POST",
    url: "/Dashboard/findDashboardListForPaging",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
