// 接口数据类型
// 生产工单列表带分页
export type ProductionOrderPage = {
  pageNo: number;
  pageSize: number;
  queryChild: boolean;
  status: number;
};
// 工单ID
export type ProductionOrderID = {
  orderId: number;
};
// 工作流ID
export type ProductionTaskID = {
  procInsId: string;
};
//审批工作流
export type ProductionTaskComplete = {
  assignee: string;
  candidateGroups: [];
  candidateUsers: [];
  comment: string;
  nextUserIds: string;
  procInsId: string;
  targetKey: string;
  taskId: string;
  taskName: string;
  userId: string;
  variables: any;
};

// 页面数据类型
// 工单列表
export interface TaskListItem {
  actualBeginTime: string;
  beginTime: string;
  actualEndTime?: string;
  childOrderList?: [];
  createBy: string;
  createTime: string;
  demandDate?: string;
  endTime?: string;
  equId: number;
  equName: string;
  extQty: number;
  isDelete: number;
  maCode: string;
  maId: number;
  maName: string;
  mfgCode: string;
  mfgId: number;
  mfgName: string;
  parentId: number;
  procInsId: string;
  processTime: number;
  remark: string;
  status: number;
  statusStr: string;
  tenantId: string;
  unit: number;
  unitStr: string;
  updateBy: string;
  updateTime: string;
}
// 生产工单详情
export interface ProductDetail {
  actualBeginTime: null;
  actualEndTime: null;
  beginTime: string | Dayjs;
  childOrderList: [];
  createBy: string;
  createTime: string | Dayjs;
  demandDate: string | Dayjs;
  endTime: string | Dayjs;
  equId: number | string;
  equName: string;
  extQty: number;
  maCode: string;
  maId: number;
  maName: string;
  mfgCode: string;
  mfgId: number;
  mfgName: string;
  parentId: number;
  processTime: 24;
  remark: string;
  status: number;
  statusStr: string;
  tenantId: string;
  unit: number;
  unitStr: string;
  updateBy: string;
  updateTime: string | Dayjs;
}
// 工作流
export interface FlowLineItem {
  taskName: string;
  assigneeId: number;
  assigneeName: string;
  duration: string;
  createTime: string | Dayjs;
  finishTime: string | Dayjs;
  procDefVersion: number;
  procDefId: string;
  procInsId: string;
  taskDefKey: string;
  taskId: string;
  taskLocalVars: TaskLocalVars;
}
