import productionOperationEn from "./productionOperation/productionOperationEn";
import { en as approvalCenter } from "./approvalCenter/approvalCenter";
import { en as inspectionManagement } from "./inspectionOperation/inspectionManagement";
import { en as enquipmentOperation } from "./enquipmentOperation/enquipmentOperation";

export default {
  name: "name",
  loadEndTip: "no more",
  login: {
    login: "Login",
    inputContent: "Please Enter Your Account Number And Password",
    account: "Account",
    password: "Password",
  },
  baseForm: {
    input: "Please enter",
    select: "Please select",
    expand: "Expand",
    close: "Close",
    expandButton: "Click to close",
    closeButton: "Click to expand",
  },
  baseLosding: {
    loadingData: 'Data Loading...'
  },
  approvalCenter: { ...approvalCenter },
  productionOperation: { ...productionOperationEn },
  inspectionManagement: { ...inspectionManagement },
  enquipmentOperation: { ...enquipmentOperation },
};
