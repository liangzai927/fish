<template>
  <div class="batch-information">
    <div class="left">
      <div
        v-for="item in props.list"
        :key="item.mfgCode"
        class="batch-item"
        :class="chooseItem === item?.mfgCode ? 'choose-item' : ''"
        @click="chooseItem = item?.mfgCode"
      >
        <span>{{ item.mfgCode }}</span>
      </div>
      <div style="padding: 0.8vw 1vw">
        <van-button
          icon="plus"
          type="primary"
          size="small"
          block
          plain
          @click="addOrder"
          v-if="props.list?.length > 0"
        >
          {{ $t("workOrder.additionSheet") }}
        </van-button>
      </div>
    </div>
    <div class="right">
      <div v-if="props.list?.length > 0">
        <van-row class="pb24">
          <van-col span="12" style="display: flex">
            <span style="width: 80px; text-align: right; text-align: right">
              {{ `${$t("workOrder.workOrderCode")}：` }}
            </span>
            <span>{{ chooseInformastion?.mfgCode }}</span>
          </van-col>
          <van-col span="12" style="display: flex">
            <span style="width: 80px; text-align: right; text-align: right">
              {{ `${$t("workOrder.productionPlant")}：` }}
            </span>
            <span>{{ chooseInformastion.equipNames || "--" }}</span>
          </van-col>
        </van-row>
        <van-row class="pb24">
          <van-col span="12" style="display: flex">
            <span style="width: 80px; text-align: right; text-align: right">
              {{ `${$t("workOrder.product")}：` }}
            </span>
            <span>{{ chooseInformastion.maName }}</span>
          </van-col>
          <van-col span="12" style="display: flex">
            <span style="width: 80px; text-align: right; text-align: right">
              {{ `${$t("workOrder.completionTime")}：` }}
            </span>
            <span>{{ chooseInformastion?.actualEndTime || "--" }}</span>
          </van-col>
        </van-row>
        <van-row class="pb24">
          <van-col span="12" style="display: flex">
            <span style="width: 80px; text-align: right; text-align: right">
              {{ `${$t("workOrder.yield")}：` }}
            </span>
            <span>{{
              `${chooseInformastion?.extQty || 0}${
                chooseInformastion?.stu || ""
              }`
            }}</span>
          </van-col>
        </van-row>
        <div class="delete-button">
          <van-button
            type="primary"
            block
            color="#EE0A24"
            plain
            @click="delOrder"
          >
            {{ $t("workOrder.removeOrder") }}
          </van-button>
        </div>
      </div>
      <van-empty description="暂无信息" v-else />
    </div>

    <van-popup v-model:show="addShow" round style="padding: 24px; width: 500px">
      <van-form @submit="handleSubmit">
        <van-field
          v-model="chooseOrderName"
          is-link
          readonly
          name="picker"
          label="工单"
          placeholder="点击选择工单"
          @click="chooseWorkOrderShow = true"
          :rules="[{ required: true, message: '请选择工单' }]"
        />
        <div style="margin: 16px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="clickLoading"
          >
            提交
          </van-button>
        </div>
      </van-form>
    </van-popup>

    <van-popup v-model:show="chooseWorkOrderShow" position="bottom">
      <van-picker
        :columns-field-names="{ text: 'mfgCode', value: 'mfgId' }"
        :columns="workWorderList"
        @confirm="onConfirm"
        @cancel="chooseWorkOrderShow = false"
      >
        <template #option="option">
          <div>
            {{ `${option.mfgCode}（${option.maName}）` }}
          </div>
        </template>
      </van-picker>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { showConfirmDialog } from "vant";
import { showToast } from "vant";

interface Props {
  list: any;
  batchId: number;
}
const props = withDefaults(defineProps<Props>(), {
  list: [],
  batchId: 0,
});

interface Emit {
  (e: "refresh"): void;
}
const emit = defineEmits<Emit>();
const { proxy } = getCurrentInstance() as any;

const chooseItem = ref<string>("");
const chooseInformastion = ref<any>({});
const addShow = ref<boolean>(false);
const chooseOrderName = ref<string>("");
const chooseOrderId = ref<number>(0);
const chooseWorkOrderShow = ref<boolean>(false);
const workWorderList = ref<any>([]);
const clickLoading = ref<boolean>(false);
// 删除工单
const delOrder = () => {
  showConfirmDialog({
    message: `确定删除这个工单吗?`,
  }).then(async () => {
    const res = await proxy.$api.productionOperations.delMfgBatchOrder({
      orderId: chooseInformastion.value.mfgId,
      batchId: chooseInformastion.value.batchId,
    });
    if (res?.code == 200) {
      showToast(res.message);
      emit("refresh");
    }
  });
};

// 店家添加工单按钮 获取列表
const addOrder = async () => {
  addShow.value = true;
  const res = await proxy.$api.productionOperations.getOrdersCanAddBatch({
    batchId: props.batchId,
  });
  if (res?.code === 200) workWorderList.value = res.data;
  else workWorderList.value = [];
};

// 确认添加工单
const handleSubmit = async () => {
  clickLoading.value = true;
  const res = await proxy.$api.productionOperations.addMfgBatchOrder({
    batchId: props.batchId,
    orderId: chooseOrderId.value,
  });
  if (res?.code === 200) {
    showToast(res.message);
    clickLoading.value = false;
    addShow.value = false;
    emit("refresh");
  } else clickLoading.value = false;
};

const onConfirm = ({ selectedOptions }) => {
  chooseOrderId.value = selectedOptions[0].mfgId;
  chooseOrderName.value = selectedOptions[0].mfgCode;
  chooseWorkOrderShow.value = false;
};

watch(
  () => props.list,
  (val) => {
    if (val?.length) chooseItem.value = val[0].mfgCode;
  },
);

watch(
  () => chooseItem.value,
  (val) => {
    chooseInformastion.value = props.list.find(
      (item: any) => item.mfgCode === val,
    );
  },
);
</script>

<style scoped lang="scss">
.batch-information {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    width: 200px;
    background-color: rgba(204, 204, 204, 0.2);
    height: 100%;
    overflow-y: auto;
    .batch-item {
      padding: 0.8vw 1vw;
      border-left: 3px solid transparent;
    }
    .choose-item {
      background-color: #fff;
      border-left: 3px solid #1989fa;
    }
  }
  .right {
    width: calc(100% - 200px);
    padding: 0 1vw;
    font-size: 14px;
    color: #646566;
    position: relative;
    .delete-button {
      width: calc(100% - 1vw);
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
