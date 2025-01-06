import request from "../../axios/index";
import { PREFIX } from "../../utils/CONSTANT";

// 获取库存单元详情
export const selectOne = async (params: any) => {
  return request({
    method: "GET",
    url: "/wareVendorInformation/selectWareEntryDetailsVOByLoc",
    data: params,
    prefix: PREFIX.businessPrefix,
  });
};

// 扫码入库
export const warehousingOperationByScanCode = async (params: any) => {
  return request({
    method: "POST",
    url: "/wareVendorInformation/WarehousingOperationByScanCode",
    data: params,
    prefix: PREFIX.businessPrefix,
  });
};
