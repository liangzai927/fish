<template>
  <!-- 混批 -->
  <van-popup
    v-model:show="showBatch"
    position="right"
    :style="{ width: '30%', height: '100%' }"
  >
    <div class="batch-choose-list">
      <div class="batch-choose-list-title">混批单列表</div>
      <div class="batch-choose-list-content">
        <van-radio-group v-model="checkedBatch">
          <van-swipe-cell v-for="item in batchList" :key="item.batchId">
            <van-cell center>
              <template #title>
                <van-radio :name="item.batchId">
                  <div>{{ item.batchNo }}</div>
                  <div style="color: #969799; font-size: 11px">
                    {{ item.createTime || "2024.03.11" }}
                  </div>
                </van-radio>
              </template>
            </van-cell>
            <template #right>
              <van-button
                square
                type="danger"
                text="删除"
                @click="delBatch(item.batchId)"
              />
              <van-button
                square
                type="primary"
                text="编辑"
                @click="editBatch(item)"
              />
            </template>
          </van-swipe-cell>
        </van-radio-group>
        <van-cell title="创建混批单" class="only-title" @click="newBatch" />
      </div>
      <div class="batch-choose-list-bottom">
        <van-button
          type="primary"
          style="width: 100%"
          :disabled="checkedBatch == 0"
          @click="addBatch"
        >
          混批
        </van-button>
      </div>
    </div>
  </van-popup>

  <!-- 编辑 / 新增混批单 -->
  <van-popup
    v-model:show="newBatchShow"
    round
    style="padding: 24px; width: 500px"
  >
    <van-form @submit="handleSubmit">
      <van-field
        v-model="batchForm.batchNo"
        name="批次号"
        label="批次号"
        placeholder="批次号"
        :rules="[{ required: true, message: '请填写批次号' }]"
      />
      <van-field
        :disabled="chooseBatchId > 0"
        v-model="batchForm.name"
        is-link
        readonly
        name="picker"
        label="生产装置"
        placeholder="点击选择生产装置"
        @click="chooseWorkOrderShow = true"
        :rules="[{ required: true, message: '请选择生产装置' }]"
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
      :columns-field-names="{ text: 'name', value: 'id' }"
      :columns="deviceList"
      @confirm="onConfirm"
      @cancel="chooseWorkOrderShow = false"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { showConfirmDialog } from "vant";
import { showToast } from "vant";
import { useDeviceList } from "@/hooks/useApi.ts";

interface Props {
  modelValue: boolean;
  orderId: any;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  orderId: 0,
});

interface Emit {
  (e: "update:modelValue", bool: boolean): void;
  (e: "refesh"): void;
}

const emit = defineEmits<Emit>();
const { deviceList, getDeviceList } = useDeviceList();

const showBatch = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});
const { proxy } = getCurrentInstance() as any;
const checkedBatch = ref<number>(0);
const newBatchShow = ref<boolean>(false);
const batchForm = reactive<{
  batchNo: string;
  equipId: number;
  name: string;
}>({
  batchNo: "",
  equipId: 0,
  name: "",
});
const chooseWorkOrderShow = ref<boolean>(false);
const batchList = ref<any>([]);
const clickLoading = ref<boolean>(false);
const chooseBatchId = ref<number>(0);

// 编辑混批
const editBatch = (item: any) => {
  batchForm.batchNo = item.batchNo;
  batchForm.equipId = item.equipId;
  const obj = deviceList.value.find((data: any) => data.id === item.equipId);
  batchForm.name = obj.name;
  chooseBatchId.value = item.batchId;
  newBatchShow.value = true;
};

// 新建
const newBatch = () => {
  batchForm.batchNo = "";
  batchForm.equipId = 0;
  batchForm.name = "";
  chooseBatchId.value = 0;
  newBatchShow.value = true;
};

// 获取混批列表
const getList = async () => {
  const res = await proxy.$api.productionOperations.getMfgBatchList();
  if (res?.code === 200) batchList.value = res.data;
};

// 混批
const addBatch = () => {
  const chooseItem = batchList.value.find(
    (item: any) => item.batchId === checkedBatch.value,
  );
  showConfirmDialog({
    message: `确定添加此工单到${chooseItem.batchNo}混批单吗?`,
  }).then(async () => {
    // on confirm
    const res = await proxy.$api.productionOperations.addMfgBatchOrder({
      batchId: chooseItem.batchId,
      orderId: props.orderId,
    });
    if (res?.code == 200) {
      showBatch.value = false;
      emit("refesh");
      showToast(res.message);
    }
  });
};

// 添加 / 编辑混批单
const handleSubmit = async () => {
  clickLoading.value = true;
  if (chooseBatchId.value > 0) editFunction();
  else addFunction();
};

// 添加接口
async function addFunction() {
  const res = await proxy.$api.productionOperations.addMfgBatch(batchForm);
  if (res?.code === 200) {
    newBatchShow.value = false;
    clickLoading.value = false;
    showToast(res.message);
    getList();
  } else clickLoading.value = false;
}

// 编辑接口
async function editFunction() {
  const res = await proxy.$api.productionOperations.editMfgBatch({
    ...batchForm,
    batchId: chooseBatchId.value,
  });
  if (res?.code === 200) {
    newBatchShow.value = false;
    clickLoading.value = false;
    showToast(res.message);
    getList();
  } else clickLoading.value = false;
}

const delBatch = (id: number) => {
  showConfirmDialog({
    message: `确定删除这个混批单吗?`,
  }).then(async () => {
    // on confirm
    const res = await proxy.$api.productionOperations.delMfgBatch({ id });
    if (res?.code == 200) {
      showToast(res.message);
      getList();
    }
  });
};

// 确认选择工单
const onConfirm = ({ selectedOptions }) => {
  batchForm.equipId = selectedOptions[0].id;
  batchForm.name = selectedOptions[0].name;
  chooseWorkOrderShow.value = false;
};

watch(
  () => props.modelValue,
  (val) => {
    if (!val) checkedBatch.value = 0;
    else getDeviceList({ typId: 1 });
  },
);

defineExpose({
  getList,
});
</script>

<style scoped lang="scss">
.batch-choose-list {
  width: 100%;
  height: 100%;
  &-title {
    height: 60px;
    border-bottom: 1px solid #e4e4e4;
    text-align: center;
    line-height: 60px;
    font-weight: bold;
    font-size: 16px;
  }
  &-content {
    width: 100%;
    height: calc(100% - 60px - 80px);
    overflow-y: auto;
    .only-title {
      :deep(.van-cell__title) {
        text-align: center;
        color: #ee0a24;
      }
    }
  }
  &-bottom {
    height: 80px;
    width: 100%;
    border-top: 1px solid #e4e4e4;
    padding: 0 10px;
    display: flex;
    align-items: center;
  }
}
:deep() {
  .van-swipe-cell__right {
    display: flex;
    align-items: center;
  }
}
</style>
