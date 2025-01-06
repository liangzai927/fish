import { zh as approvalCenter } from "./approvalCenter/approvalCenter";
import productionOperationCh from "./productionOperation/productionOperationZh";
import { zh as inspectionManagement } from "./inspectionOperation/inspectionManagement";
import { zh as enquipmentOperation } from "./enquipmentOperation/enquipmentOperation";

export default {
  name: "名字",
  loadEndTip: "没有更多了",
  login: {
    login: "登录",
    inputContent: "请输入你的账号和密码",
    account: "账号",
    password: "密码",
  },
  baseForm: {
    input: "请输入",
    select: "请选择",
    expand: "展开",
    close: "收起",
    expandButton: "点击折叠",
    closeButton: "点击展开",
  },
  baseLosding: {
    loadingData: '数据加载中...'
  },

  approvalCenter: { ...approvalCenter },
  productionOperation: { ...productionOperationCh },
  inspectionManagement: { ...inspectionManagement },
  enquipmentOperation: { ...enquipmentOperation },
};
