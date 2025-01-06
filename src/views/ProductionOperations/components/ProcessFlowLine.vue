<template>
  <div class="process">
    <van-tabs
      v-if="props.operateList.length > 0"
      v-model:active="activeTab"
      shrink
      @change="handelChangeTab"
    >
      <van-tab
        :title="item.operateName"
        :name="item.operateId"
        v-for="item in props.operateList"
        :key="item.operateId"
      >
        <van-steps
          direction="vertical"
          :active="activeStep"
          v-if="processList.length > 0"
        >
          <van-step v-for="item in processList" :key="item.taskId">
            <template #active-icon v-if="chooseTabData.operateStatus !== 3">
              <van-loading type="spinner" size="12" color="#1989fa" />
            </template>
            <template #active-icon v-else>
              <van-icon name="checked" size="12" color="#1989fa" />
            </template>
            <template #finish-icon>
              <van-icon name="checked" size="12" color="#1989fa" />
            </template>

            <h3>{{ item.taskName }}</h3>
            <p v-if="item.assigneeName" style="padding-top: 1vw">
              <span
                >{{ $t("productionOperation.taskCard.assigneeName") }}：</span
              >
              <span>{{ item.assigneeName }}</span>
            </p>
            <p v-if="item.finishTime" style="padding-top: 1vw">
              <span
                >{{ $t("productionOperation.taskCard.complateTime") }}：</span
              >
              <span>{{ item.finishTime }}</span>
            </p>
          </van-step>
        </van-steps>
        <van-empty v-else description="工序未开始" />
      </van-tab>
    </van-tabs>
    <van-empty v-else description="工单非生产状态" />
  </div>
</template>

<script setup lang="ts">
import { FlowLineItem } from "../../../types/production";
const { proxy } = getCurrentInstance();
const props = defineProps<{
  operateList: any[];
  operateId: any;
}>();

interface Emits {
  (event: "changeStatues", arr: any): void;
}
const emit = defineEmits<Emits>();

const processList = ref<FlowLineItem[]>([]); //工作流详情
const activeTab = ref<number>(props.operateId || 0); // 操作记录选择tab(operateId)
const mfgId = ref(); // 工单id
const chooseTabData = ref<any>(null);
let currentTask = reactive<any>({}); // 时间轴最后一项

// 当前步骤
const activeStep = ref(0);
// 是否所有的工序都完成
const isFinished = props.operateList.find(
  (item: any) => item.operateStatus !== 3,
);
const handelChangeTab = (operateId: number) => {
  chooseTabData.value = props.operateList.find(
    (item) => item.operateId === operateId,
  );
  if (chooseTabData.value.procInsId) {
    getTaskDetail(chooseTabData.value.procInsId);
  }
};

// 获取工单详情
const getTaskDetail = async (procInsId: string) => {
  const res = await proxy.$api.productionOperations.processDetail({
    procInsId,
  });
  if (res.code == 200) {
    mfgId.value = res.data.mfgId;
    processList.value = res.data;
    currentTask = res.data.find((item: any) => item.isCurrent === true);
    activeStep.value = res.data.findIndex(
      (item: any) => item.isCurrent === true,
    );
    if (currentTask.processStatus === "1") {
      emit("changeStatues", currentTask);
    }
  }
};

// 审批工作流
const taskComplete = async (item: FlowLineItem) => {
  const res = await proxy.$api.productionOperations.processCompletes({
    procInsId: item.procInsId,
    taskId: item.taskId,
    comment: "通过",
  });
  if (res.code == 200) {
    console.log(res);
  }
};

defineExpose({
  getTaskDetail,
  taskComplete,
});
</script>

<style lang="scss" scoped>
.tracking {
  background-color: $default-bgc;

  .task-detail {
    padding: 20px;
    background-color: #fff;

    .title {
      padding-bottom: 10px;
      font-size: large;
    }

    .body {
      p {
        padding-bottom: 5px;
        color: #999;
      }
    }
  }

  .process {
    padding: 25px;
    margin-top: 10px;
    background-color: #fff;

    p {
      padding-top: 5px;
      color: #999;
    }
  }
}
</style>
