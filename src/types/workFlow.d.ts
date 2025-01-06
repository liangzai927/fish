// 接口数据类型
// 工作流流程列表带分页
export type FlowOrderPage = {
  pageNum: number;
  pageSize: number;
  type: boolean; //列表类型
};
// 工单ID
export type ProductionOrderID = {
  mfgId: number;
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
