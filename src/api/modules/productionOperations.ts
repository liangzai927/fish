import request from "../../axios/index";
import { PREFIX } from "../../utils/CONSTANT";
import type {
  ProductionOrderPage,
  ProductionOrderID,
  ProductionTaskID,
  ProductionTaskComplete,
} from "../../types/production";

// 获取设备列表
export const equipRecordList = async (data: any) => {
  return request({
    method: 'GET',
    url: '/equip/getEquipRecordList',
    data,
    prefix: PREFIX.businessPrefix,
  });
};

// 获取工单列表
export const productionOrderList = async (data: ProductionOrderPage) => {
  return request({
    method: "POST",
    url: "/mfg/findMobileMfgListByParams",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取工单详情
export const productionOrderDetail = async (params: ProductionOrderID) => {
  return request({
    method: "GET",
    url: "/mfg/findManufacturingOrderInfo",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取工作流任务步骤图
export const processDetail = async (params: ProductionTaskID) => {
  return request({
    method: "get",
    url: "/mfg/getMfgTasks",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// // 工作流审批
// export const processCompletes = async (data: ProductionTaskComplete) => {
//   return request({
//     method: "POST",
//     url: "/workflow/task/complete",
//     data,
//     prefix: PREFIX.businessPrefix,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// };

// 开始工单
export const startWorkOrder = async (data: any) => {
  return request({
    method: "POST",
    url: "/mfg/start",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 投料 / 确认操作
export const processComplete = async (data?: any) => {
  return request({
    method: "POST",
    url: "/mfg/completeOrderOperateTask",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
// 投料数量修改
export const changePickNum = async (params?: any) => {
  return request({
    method: "get",
    url: "/mfg/updateMfgTrk",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
// 临时投料
export const sudProcessComplete = async (data?: any) => {
  return request({
    method: "POST",
    url: "/mfg/materialTracking",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 报工操作
export const bomComplete = async (data?: any) => {
  return request({
    method: "POST",
    url: "/mfg/operationTracking",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取工单构成信息
export const getMfgBom = async (data?: any) => {
  return request({
    method: "POST",
    url: "/mfg/getMfgBom",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取可入库产品
export const getMfgProduct = async (data?: any) => {
  return request({
    method: "POST",
    url: "/mfg/getMfgProduct",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取仓库列表
export const wareHouseList = async (params?: any) => {
  return request({
    method: "GET",
    url: "/Factory/selectWareHouseList",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取子仓库
export const inventoryUnitList = async (params?: any) => {
  return request({
    method: "GET",
    url: "/Factory/seleteInventoryUnitList",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 工单产品(入库产品)
export const getMfgProductByTrk = async (params?: any) => {
  return request({
    method: "post",
    url: "/mfg/getMfgProductByTrk",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 入库
export const productionReporting = async (params?: any) => {
  return request({
    method: "post",
    url: "/mfg/productionReporting",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取采样点
export const selectSamplePoint = async (params?: any) => {
  return request({
    method: "GET",
    url: "/laboratoryManagement/selectSamplePoint",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 确认过程巡检
export const checkRequest = async (params?: any) => {
  return request({
    method: "POST",
    url: "/process/checkRequest",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 根据资源定义获取部门及装置
export const selectByUserIdEquipList = async (params?: any) => {
  return request({
    method: "GET",
    url: "/Factory/selectByUserIdEquipList",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取混批池列表
export const getMfgBatchList = async (): Promise<any> => {
  return request({
    method: "GET",
    url: "/mfg/getMfgBatchList",
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 添加混批单
export const addMfgBatch = async (params: any): Promise<any> => {
  return request({
    method: "POST",
    url: "/mfg/addMfgBatch",
    prefix: PREFIX.businessPrefix,
    data: params,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 编辑混批单
export const editMfgBatch = async (params: any): Promise<any> => {
  return request({
    method: "POST",
    url: "/mfg/editMfgBatch",
    prefix: PREFIX.businessPrefix,
    data: params,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 删除混批单
export const delMfgBatch = async (params: any): Promise<any> => {
  return request({
    method: "DELETE",
    url: "/mfg/delMfgBatch",
    prefix: PREFIX.businessPrefix,
    data: params,
  });
};

// 获取混批详情
export const getMfgBatch = async (params: { id: number }): Promise<any> => {
  return request({
    method: "GET",
    url: "/mfg/getMfgBatch",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 混批添加工单
export const addMfgBatchOrder = async (params: {
  batchId: number;
  orderId: number;
}): Promise<any> => {
  return request({
    method: "POST",
    url: "/mfg/addMfgBatchOrder",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 混批删除工单
export const delMfgBatchOrder = async (params: {
  batchId: number;
  orderId: number;
}): Promise<any> => {
  return request({
    method: "POST",
    url: "/mfg/delMfgBatchOrder",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取当前混批可添加的所有工单
export const getOrdersCanAddBatch = async (params: {
  batchId: number;
  orderId: number;
}): Promise<any> => {
  return request({
    method: "GET",
    url: "/mfg/getOrdersCanAddBatch",
    data: params,
    prefix: PREFIX.businessPrefix,
  });
};

// 扫码投料
export const scanFeed = async (data?: any) => {
  return request({
    method: "POST",
    url: "/mfg/getMaterialQrcodeMsg",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 扫码查库位
export const findWare = async (data?: any) => {
  return request({
    method: "POST",
    url: "/mfg/getInventoryQrcodeMsg",
    data,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// 获取所有部门
export const getAllSection = async (data: any): Promise<any> => {
  return request({
    method: 'get',
    url: '/Organization/getOrgList',
    data,
    prefix: PREFIX.permissionsPrefix
  });
};
