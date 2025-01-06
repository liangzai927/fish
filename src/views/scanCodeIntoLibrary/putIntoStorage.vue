<template>
  <van-tabs v-model:active="active" class="scan-code">
    <van-tab>
      <template #title>
        <span>物料条码</span>
        <van-badge :content="materielList.length" />
      </template>
      <div style="padding: 16px" v-if="materielList.length">
        <div
          v-for="(item, index) in materielList"
          :key="item.warehousEntryOnlyCode"
          class="meteriel-item"
        >
          <h4>{{ item.warehousEntryOnlyCode }}</h4>
          <div>
            <span>规格：</span>
            <span>{{ item.pcuName }}</span>
          </div>
          <div>
            <span>入库单：</span>
            <span>{{ item.warehousEntryNumber }}</span>
          </div>
          <div
            style="
              display: flex;
              flex-direction: row-reverse;
              margin-bottom: 8px;
            "
          >
            <van-button
              round
              color="#ee0a24"
              size="mini"
              @click="handleCancel(index)"
              >取消选择</van-button
            >
          </div>
        </div>
      </div>
      <van-divider>扫码添加物料 </van-divider>
    </van-tab>
    <van-tab title="库位">
      <div v-if="stashData?.inventoryUnitName" class="stashData">
        <h3>{{ stashData.inventoryUnitName }}</h3>
        <span style="color: #aeaeae; font-size: 10px">{{
          `${stashData.wareHouseName}/${stashData.inventoryUnitName}`
        }}</span>
      </div>
      <van-divider v-else>扫码添加库位</van-divider>
      <div class="storage-location">
        <div
          v-for="(item, index) in stashData.wareEntryDetailsAndUnitVOS"
          :key="index.toString()"
          class="storage-location-item"
        >
          <div>
            <p style="color: #323233; margin-bottom: 8px">
              {{ item.containCode }}
            </p>
            <p style="font-size: 10px; color: #aeaeae">
              {{ item.warehousEntryNumber }}
            </p>
          </div>
          <div>{{ item.pcuName }}</div>
        </div>
      </div>
    </van-tab>
  </van-tabs>
  <div class="bottom-button">
    <van-button
      type="primary"
      round
      style="padding: 0 50px"
      @click="scanCodeIntoStash"
      :disabled="!materielList.length || !stashData?.inventoryUnitCode"
      :loading="sureLoading"
      >入库</van-button
    >
  </div>
</template>

<script setup lang="ts">
import { showSuccessToast, showFailToast } from "vant";
const active = ref<number>(0);
const materielList = ref<any[]>([]);
const stashData = ref<any>({});
const sureLoading = ref<boolean>(false);

const api = inject("$api");

// 判断是否是JSON
function isJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

// 读取二维码信息
function readCARD(item: string) {
  if (isJSON(item)) {
    if (JSON.parse(item)?.warehousEntryOnlyCode.startsWith("wed")) {
      const qrData = materielList.value.find(
        (obj) =>
          obj.warehousEntryOnlyCode === JSON.parse(item).warehousEntryOnlyCode,
      );
      if (!qrData) {
        materielList.value.push(JSON.parse(item));
        showSuccessToast("物料添加成功");
      } else showFailToast("当前物料已添加");
    }
  } else {
    if (stashData.value?.inventoryUnitCode === item)
      showFailToast("当前库位已被添加");
    else getStashDetails(item);
  }
}

// 获取库位详情
const getStashDetails = async (loc: string) => {
  const res = await api.putIntoStorage.selectOne({ loc });
  if (res?.code === 200) {
    if (stashData.value.inventoryUnitCode) showSuccessToast("新库位已覆盖");
    else showSuccessToast("库位添加成功");
    stashData.value = res.data;
  }
};

const handleCancel = (index: number) => {
  materielList.value.splice(index, 1);
};

// 入库
const scanCodeIntoStash = async () => {
  sureLoading.value = true;
  const sendData: any[] = [];
  materielList.value.map((item) => {
    sendData.push({
      warehousEntryNumber: item.warehousEntryNumber,
      warehousEntryOnlyCode: item.warehousEntryOnlyCode,
      pcuCode: item.pcuCode,
      materialCode: item.materialCode,
      loc: stashData.value.inventoryUnitCode,
    });
  });

  const res = await api.putIntoStorage.warehousingOperationByScanCode(sendData);
  if (res?.code === 200) {
    showSuccessToast(res.message);
    materielList.value = [];
    stashData.value = {};
  }
  sureLoading.value = false;
};

onMounted(() => {
  // 将要给原生调用的方法挂载到 window 上面
  (window as any).readCARD = (item) => {
    return readCARD(item);
  };
});
</script>

<style scoped lang="scss">
:deep(.van-tab__text--ellipsis) {
  overflow: inherit;
}

.scan-code {
  height: 100%;
  :deep(.van-tabs__content) {
    height: calc(100% - 44px);
    overflow-y: auto;
    padding-bottom: 70px;
  }
  .meteriel-item {
    background-color: #fff;
    padding: 8px 16px;
    margin-bottom: 8px;
  }
  .stashData {
    background-color: #fff;
    margin: 8px 0;
    padding: 16px 8px;
  }
  .storage-location {
    background-color: #fff;
    padding: 0 16px;
    &-item {
      padding: 16px 0;
      border-bottom: 1px solid #ebedf0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:last-of-type {
        border: none;
      }
    }
  }
}
.bottom-button {
  width: 100vw;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row-reverse;
  background-color: #fff;
  padding: 8px 16px;
}
</style>
