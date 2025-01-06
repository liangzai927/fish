<template>
  <div class="detailsProcess">
    <div class="details">
      <!-- 主页tab -->
      <div class="details-head">
        <h3>{{ details?.defName }}</h3>
        <p class="small-content">{{ details?.notes }}</p>
      </div>
      <div class="details-basic">
        <span>基础信息</span>
        <div class="content">
          <BaseForm
            :flowWidgets="flowWidgets"
            :contentJSON="contentJSON"
            :flowForm="flowForm"
            :nodeKey="nodeKey"
            :nodeChoose="nodeChoose"
            @submit="clickButtonFun"
            ref="baseFormRef"
          />
        </div>
      </div>
      <div class="details-process">
        <p class="title">
          {{ $t("approvalCenter.creatProcess.processTitle") }}
        </p>
        <div class="process-flow">
          <van-steps
            direction="vertical"
            :active="historyProcNodeList.length - 1"
          >
            <van-step v-for="(item, key, idx) in stepList" :key="key">
              <h4>{{ item[0].activityName || "审批节点" + (idx + 1) }}</h4>
              <!-- 流程节点审批人 -->
              <div v-for="(obj, i) in item" :key="i.toString()">
                <van-tag
                  style="margin-top: 8px; padding: 3px 9px"
                  round
                  color="#7fcaff"
                  v-if="obj.assigneeName && obj.approvalInformation"
                >
                  {{ obj.assigneeName }}
                </van-tag>
                <div
                  style="margin-top: 4px"
                  v-if="(key as any) != nodeKey && obj.approvalInformation"
                >
                  <span>审批意见：</span>
                  <span>{{ obj.approvalInformation || "无" }}</span>
                </div>
              </div>

              <!-- 审批意见 -->
              <!-- <p class="comment" v-if="item.approvalInformation">
                {{ item.approvalInformation }}
              </p> -->
              <div
                class="right"
                v-if="
                  item.dataType == 'contactsWithinTheForm' &&
                  item.nodeId ===
                    processFromXml[historyProcNodeList.length - 1].activityId
                "
              >
                <van-button @click="addNodeMan(item, 'node')">+</van-button>
                <span
                  class="choose-user"
                  v-for="user in filterUsersByNodeChoose(
                    nodeChoose[item.activityId]
                  )"
                  :key="user.userId"
                >
                  {{ user.userName }}
                </span>
              </div>
            </van-step>
          </van-steps>
        </div>
      </div>
      <div
        class="details-button"
        style="z-index: 10"
        v-if="route.query.power == '2'"
      >
        <!-- <span class="icon"
          ><van-icon name="guide-o" size="2rem" />
          <p>转交</p></span
        >
        <span class="icon"
          ><van-icon name="todo-list-o" size="2rem" />加签</span
        >
        <van-popover
          v-model:show="show.showPopover"
          placement="top-start"
          :actions="actions"
          @select="onSelect"
        >
          <template #reference>
            <span class="icon"
              ><van-icon name="weapp-nav" size="2rem" />更多</span
            >
          </template>
        </van-popover> -->
        <van-button
          class="m18"
          round
          type="default"
          native-type="submit"
          @click="clickButton(false)"
        >
          拒绝
        </van-button>
        <van-button
          class="m18"
          round
          type="primary"
          native-type="submit"
          @click="clickButton(true)"
        >
          通过
        </van-button>
      </div>
    </div>
    <van-dialog
      v-model:show="show.dialogShow"
      title="审批意见"
      show-cancel-button
      @confirm="processPass"
    >
      <van-field
        autosize
        v-model="comment"
        name="comment"
        placeholder="请输入审批意见"
      />
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { showNotify, closeNotify } from "vant";
import BaseForm from "./BaseForm.vue";

const route = useRoute();
const router = useRouter();
const details = ref<any>(null);
const { proxy } = getCurrentInstance();
const flowWidgets = ref<any>([]); //表单格式
let flowForm = ref<any[]>([]); // 流程的表单
let contentJSON = ref<any[]>([]); // 流程的表单
const historyProcNodeList = ref<any>([]); //流程进度
// const actions = [{ text: "评论" }, { text: "撤回" }];
const actions = [];
const userData = ref<any>({
  orgList: [],
  userList: [],
});
const show = reactive({
  dialogShow: false,
  showUserPicker: false,
  showDePicker: false,
  showPopover: false,
  showDataPicker: false,
});
const comment = ref<string>("");
const userInfo = JSON.parse(localStorage.getItem("h5-user") as string);
const baseFormRef: Ref = ref(null);
const nodeChoose = ref<any>({});
const userChoose = ref<boolean>(false);
const curActivityId = ref<any>();
const curDataType = ref<any>();
const nodeUserIds = ref([]);
const openType = ref<string>("");
const nodeKey = ref<string>("");
const submitType = ref<boolean>(false);
const stepList = ref<any>();

// 生成 tasksArray
const xmlData = ref<string>("");
const userTasks = ref<any[]>([]);
const processFromXml = computed(() => {
  return processTaskNodes(
    xmlData.value,
    userTasks.value,
    historyProcNodeList.value
  );
});

// 转换historyProcNodeList
function transformHistoryProcNodeList(historyProcNodeList: any) {
  const result = [];

  for (const key in historyProcNodeList) {
    const activities = historyProcNodeList[key];

    // 如果当前活动包含多个条目，则需要处理合并操作
    if (activities.length > 1) {
      // 创建一个基础对象
      const baseActivity = {
        activityId: activities[0].activityId,
        activityName: activities[0].activityName,
        activityType: activities[0].activityType,
        procDefId: activities[0].procDefId,
        assigneeList: activities.map((activity) => ({
          approvalInformation: activity.approvalInformation,
          assigneeId: activity.assigneeId,
          assigneeName: activity.assigneeName,
          candidate: activity.candidate,
          commentList: activity.commentList,
          createTime: activity.createTime,
          duration: activity.duration,
          endTime: activity.endTime,
          wfProcNodeVoList: activity.wfProcNodeVoList,
        })),
      };
      result.push(baseActivity);
    } else {
      // 只有一个条目的活动
      result.push(activities[0]);
    }
  }

  // 将 dataType 为 "startEvent" 的元素放在数组的第一位，将 "endEvent" 放在最后
  const startEvent = result.find((item) => item.activityType === "startEvent");
  const endEvent = result.find((item) => item.activityType === "endEvent");

  // 过滤掉已找到的 startEvent 和 endEvent
  const filteredResult = result.filter(
    (item) =>
      item.activityType !== "startEvent" && item.activityType !== "endEvent"
  );

  return [
    ...(startEvent ? [startEvent] : []),
    ...filteredResult,
    ...(endEvent ? [endEvent] : []),
  ];
}

// 点击查看某流程实例
const checkProExample = async () => {
  const res = await proxy.$api.workFlow.processInstanteDetail({
    procInsId: route.query.procInsId,
    power: route.query.power,
    taskId: route.query.power == 3 ? null : route.query.taskId,
  });
  if (res.code == 200) {
    details.value = res.data;
    nodeKey.value = res.data.taskDefinitionKey;
    flowWidgets.value = JSON.parse(res.data.processForm);
    // flowForm.value = res.data.processFormList[0].fields;
    contentJSON.value = JSON.parse(res.data.contentJson);
    xmlData.value = res.data.bpmnXml;
    stepList.value = res.data.historyProcNodeList;
    historyProcNodeList.value = transformHistoryProcNodeList(
      res.data.historyProcNodeList
    );

    // for (const key in res.data.historyProcNodeList) {
    //   if (!res.data.historyProcNodeList[key][0].endTime) {
    //     nodeKey.value = key;
    //   } else {
    //     if (
    //       res.data.historyProcNodeList[key].find(
    //         (item: any) => item.activityType === "endEvent"
    //       )
    //     ) {
    //       nodeKey.value = key;
    //     }
    //   }
    // }

    // if (historyProcNodeList.value.find((item: any) => !item.endTime)) {
    //   nodeKey.value = historyProcNodeList.value.find(
    //     (item: any) => !item.endTime
    //   )?.activityId;
    // } else {
    //   nodeKey.value = historyProcNodeList.value.find(
    //     (item: any) => item.activityType === "endEvent"
    //   )?.activityId;
    // }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData.value, "text/xml");
    userTasks.value = Array.from(xmlDoc.getElementsByTagName("bpmn:userTask"));

    // 表单内容处理
    let formDetail: any = res.data.processFormList[0].fields;
    let form: any = {};
    for (let k in formDetail) {
      console.log(formDetail[k])
      form[formDetail[k].name] = formDetail[k].value;
    }
    flowForm.value = form;
  }
};

// 点击通过
const passOperation = () => {
  if (route.query.taskId) {
    show.dialogShow = true;
  } else {
    showNotify("您没有权限进行此操作");
  }
};

const clickButton = (bool: boolean) => {
  submitType.value = bool;
  baseFormRef.value.confirm();
};

function clickButtonFun() {
  if (submitType.value) passOperation();
  else processReject();
}

// 审批通过
const processPass = async () => {
  let sendData = {
    comment: comment.value,
    procInsId: route.query.procInsId,
    taskId: route.query.taskId,
    variables: { ...flowForm.value, ...nodeChoose.value },
  };
  const res = await proxy.$api.workFlow.completeInstanceState(sendData);
  if (res.code == 200) {
    show.dialogShow = false;
    router.back();
    showNotify({ type: "success", message: "操作成功" });
  }
};

// 审批拒绝
const processReject = async () => {
  if (route.query.taskId) {
    let sendData = {
      comment: "拒绝",
      procInsId: route.query.procInsId,
      taskId: route.query.taskId,
      variables: { ...flowForm.value, ...nodeChoose.value },
    };
    const res = await proxy.$api.workFlow.rejectInstanceState(sendData);
    if (res.code == 200) {
      // visible.value = false;
      // 跳转回上级页面
      router.back();
      showNotify({ type: "success", message: "操作成功" });
    }
  } else {
    showNotify("您没有权限进行此操作");
  }
};

// 合并数组并排序
function processTaskNodes(
  xml: string,
  userTasks: any,
  transformedDataArray: any
) {
  if (!xml) {
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

  // 合并逻辑
  let merged: any[] = [];
  if (transformedDataArray.length > 0) {
    merged = transformedDataArray.reduce((acc, obj) => {
      const existingObj = acc.find(
        (item) => item.activityId === obj.activityId
      );
      if (!existingObj) {
        acc.push({ ...obj });
      }
      return acc;
    }, []);

    const filteredTasksArray = tasksArray.filter((task) => {
      return !merged.some(
        (mergedItem) => mergedItem.activityId === task.activityId
      );
    });

    merged = merged.concat(filteredTasksArray);
  } else {
    merged = [
      {
        activityId: 0,
        activityName: "流程待发起",
      },
      ...tasksArray,
    ];
  }

  // 分离 startEvent 和 endEvent
  const startEventIndex = merged.findIndex(
    (item) => item.dataType === "startEvent"
  );
  const endEventIndex = merged.findIndex(
    (item) => item.dataType === "endEvent"
  );

  let startEvent = null;
  let endEvent = null;

  // 取出 startEvent 和 endEvent
  if (startEventIndex !== -1) {
    startEvent = merged.splice(startEventIndex, 1)[0];
  }

  if (endEventIndex !== -1) {
    endEvent = merged.splice(
      endEventIndex - (startEventIndex !== -1 ? 1 : 0),
      1
    )[0];
  }

  // 在排序后的数组前后添加 startEvent 和 endEvent
  if (startEvent) {
    merged.unshift(startEvent);
  }

  if (endEvent) {
    merged.push(endEvent);
  }

  return merged;
}

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
};

function filterUsersByNodeChoose(nodeChooseActivityId: any) {
  // 假设 userData.userList 是已定义的用户列表
  if (nodeChooseActivityId && userData.userList) {
    return userData.userList.filter((user: any) =>
      nodeChooseActivityId.includes(user.userId)
    );
  }
}

onMounted(() => {
  checkProExample();
  if (baseFormRef.value) {
    baseFormRef.value.getOrgList();
    baseFormRef.value.getUserList();
  }
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
.detailsProcess {
  background-color: $default-bgc;
  height: 100%;
  .details {
    background-color: #fff;
    overflow: auto;
    height: calc(100% - 56px);
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
      .process-flow {
        .comment {
          background-color: #d7d7d7;
          color: #878e98;
          padding: 4px;
          border-radius: 8px;
          font-size: 12px;
        }
        p {
          background-color: #d7d7d7;
          color: black;
          padding: 4px;
          border-radius: 4px;
        }
        .right {
          display: flex;
          align-items: center;
          span {
            background-color: #cb4538;
            color: #fff;
            padding: 8px;
            border-radius: 16px;
          }
        }
      }
    }
    &-button {
      padding: 8px;
      background-color: #fff;
      position: fixed;
      bottom: 0px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .icon {
        display: flex;
        flex-direction: column;
      }
      .m18 {
        width: 7rem;
      }
    }
  }
}

:root:root {
  --van-dropdown-menu-shadow: 0;
}
</style>
