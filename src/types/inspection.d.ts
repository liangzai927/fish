// 接口数据类型
// 生产工单列表带分页
export type InspectionTaskPage = {
  pageNo: number;
  pageSize: number;
  // queryChild: boolean;
  // status: number;
};
export type InspectionTaskSubmit = {
  taskId: number | string;
};
export type InspectHidDangerItem = {
  reformId: number | string;
  reformImage: string;
  reformFund: string;
  reformWay: string;
  taskItemId: string;
};
export type InspectionTaskItem = {
  itemId: number | string;
  taskPointId: number | string;
  checkType: number | string;
  checkResult: number | string;
  fileUrl: string;
  [T]: any;
};
