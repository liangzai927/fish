<template>
  <div class="createProcess">
    <div class="create">
      <!-- 主页tab -->
      <div class="create-head">
        <h3>{{ details?.defName }}</h3>
        <p class="small-content">发起流程</p>
      </div>
      <div class="create-basic">
        <p class="title">{{ $t("approvalCenter.creatProcess.formTitle") }}</p>
        <div class="content">
          <BaseForm
            :flowWidgets="flowWidgets"
            :contentJSON="contentJSON"
            :flowForm="flowForm"
            :nodeChoose="nodeChoose"
            @submit="productStart"
            nodeKey="StartEvent_1"
            ref="baseFormRef"
          />
        </div>
      </div>
      <div class="create-process">
        <p class="title">
          {{ $t("approvalCenter.creatProcess.processTitle") }}
        </p>
        <div class="process-flow">
          <van-steps direction="vertical" :active="0">
            <van-step v-for="step in processFromXml" :key="step.activityId">
              <div class="process-flow-item">
                <div class="left">
                  <h4>{{ step.activityName }}</h4>
                  <p>{{ step?.creatBy }}</p>
                </div>
                <div
                  class="right"
                  v-if="
                    (step.dataType == 'contactsWithinTheForm' &&
                      step.nodeId === processFromXml[0].activityId) ||
                    step.dataType == 'INITIATOR'
                  "
                >
                  <van-button
                    style="height: 30px; width: 24px"
                    @click="addNodeMan(step, 'node')"
                    >+</van-button
                  >
                  <div
                    class="choose-user"
                    v-for="user in filterUsersByNodeChoose(
                      nodeChoose[step.activityId]
                    )"
                    :key="user.userId"
                  >
                    <van-image
                      round
                      width="50px"
                      height="50px"
                      src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                    />
                    <span>{{ user.userName }}</span>
                  </div>
                </div>
              </div>
            </van-step>
          </van-steps>
        </div>
      </div>
    </div>
    <div class="create-button">
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        @click="confirm()"
      >
        提交
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store";
import BaseForm from "./BaseForm.vue";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

// 流程组件
const WIDGET = {
  SINGLELINE_TEXT: 0, //"单行文本"
  MULTILINE_TEXT: 1, //"多行文本"
  DESCRIBE: 2, //"提示文字"
  NUMBER: 3, //"数字"
  MONEY: 4, //"金额"
  SINGLE_CHOICE: 5, //"单选"
  MULTI_CHOICE: 6, //"多选"
  DATE: 7, //"日期"
  DATE_RANGE: 8, //"日期区间"
  DETAIL: 9, //"明细"
  PICTURE: 10, //"图片"
  ATTACHMENT: 11, //"附件"
  DEPARTMENT: 12, //"部门"
  EMPLOYEE: 13, //"员工"
  ADDRESS: 14, //"地址"
  SWITCH: 15, //"开关"
};
const flowForm: any = ref({}); // 流程的表单
const baseFormRef: Ref = ref(null);

// 搜索选择框数据初始化
const { proxy } = getCurrentInstance();
const details = ref<any>(null);
const flowWidgets = ref<any>([]);
const contentJSON = ref<any>([]);
const curWidgets = ref<any>();
const userData: any = reactive({
  orgList: [],
  userList: [],
});
const pop: any = reactive({});
const show = reactive({
  dialogShow: false,
  showUserPicker: false,
  showDePicker: false,
  showDataPicker: false,
  showDataLineOne: false,
  showDataLineTwo: false,
});

const userChoose = ref<boolean>(false);
const nodeChoose = ref<any>({});
const curActivityId = ref<any>();
const curDataType = ref<any>();
const nodeUserIds = ref([]);
const openType = ref<string>("");

// 生成 tasksArray
const xmlData = ref<string>("");
const userTasks = ref([]);
const processFromXml = computed(() => {
  return transformXml(userTasks.value);
});

// 提取xml中的任务
function transformXml(userTasks: any) {
  if (!userTasks) {
    return [];
  }
  // 构建 tasksArray
  const tasksArray = [];
  for (let i = 0; i < userTasks.length; i++) {
    const activityId = userTasks[i].getAttribute("id");
    const activityName = userTasks[i].getAttribute("name");
    const dataType = userTasks[i].getAttribute("flowable:dataType");
    const nodeId = userTasks[i].getAttribute("flowable:formUsers"); // 节点自选审批人的节点id
    if (dataType === "contactsWithinTheForm") {
      tasksArray.push({ activityId, activityName, dataType, nodeId });
    } else {
      tasksArray.push({ activityId, activityName, dataType });
    }
  }
  return [
    {
      activityId: 0,
      activityName: "发起申请",
      dataType: "Create",
      creatBy: "我",
    },
    ...tasksArray,
  ];
}

// 点击某流程创建流程实例
const creatProExample = async () => {
  const res = await proxy.$api.workFlow.creatProcessExample({
    procDefId: route.query.procDefId,
  });
  if (res.code == 200) {
    details.value = res.data;
    flowWidgets.value = JSON.parse(res.data.content);
    contentJSON.value = JSON.parse(res.data.contentJson);
    // 解析xml
    xmlData.value = res.data.bpmnXmlString;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData.value, "text/xml");
    userTasks.value = Array.from(xmlDoc.getElementsByTagName("bpmn:userTask"));
  }
};

// 提交申请
const productStart = async () => {
  const res = await proxy.$api.workFlow.startProcess({
    processDefId: details.value.procDefId,
    variables: { ...flowForm.value, ...nodeChoose.value },
  });
  if (res.code == 200) {
    flowForm.value = {};
    router.push({
      path: "/home/approval",
    });
  }
};

// 点击提交发起流程
const confirm = () => {
  if (baseFormRef.value) {
    baseFormRef.value.confirm();
  }
};

// 点击添加节点选择人/表单选择人员
const addNodeMan = (item: any, type: string) => {
  // 判断时表格还是节点
  openType.value = type;
  userChoose.value = true;
  if (type === "node") {
    curActivityId.value = item.activityId;
    curDataType.value = item.dataType;
  } else {
    curActivityId.value = item.name;
  }
  nodeUserIds.value = nodeChoose.value[curActivityId.value];
  // console.log("addNodeMan", item, nodeChoose.value);
};

function filterUsersByNodeChoose(nodeChooseActivityId: any) {
  // 假设 userData.userList 是已定义的用户列表
  if (nodeChooseActivityId) {
    return userData.userList.filter((user: any) =>
      nodeChooseActivityId.includes(user.userId)
    );
  }
}

onMounted(() => {
  creatProExample();
  if (baseFormRef.value) {
    baseFormRef.value.getOrgList();
    baseFormRef.value.getUserList();
  }
  // getOrgList();
  // getUserList();
});
</script>

<style scoped lang="scss">
.choose-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 8px;
}
.small-content {
  font-size: 14px;
  color: #c3c4c7;
}
.createProcess {
  background-color: $default-bgc;
  height: 100%;
  position: relative;
  .create {
    background-color: #fff;
    overflow: auto;
    height: calc(100% - 60px);
    &-head {
      padding: 8px;
    }
    &-basic {
      background-color: $default-bgc;
      padding-top: 24px;
      p {
        margin: 8px;
        color: #a1a9bc;
      }
      .content {
        background-color: #fff;
        width: 100%;
      }
    }
    &-process {
      background-color: $default-bgc;
      padding-top: 24px;
      p {
        margin: 8px;
        color: #a1a9bc;
      }
    }
    &-button {
      padding: 8px;
      background-color: #fff;
      position: fixed;
      bottom: 0px;
      width: 100%;
    }
  }
}

:root:root {
  --van-dropdown-menu-shadow: 0;
}
</style>
