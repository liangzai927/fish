<!-- 巡检任务 -->
<template>
  <div class="inspectionTasks">
    <div class="inspectionTasks-content">
      <!-- 列表内容 -->
      <div class="inspectionTasks-content-task">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            @load="onLoad"
            style="background-color: #fff"
            :offset="15"
          >
            <van-cell
              v-for="(item, idx) in taskList"
              :key="idx"
              :style="{
                background: item.pointStatus == '2' ? '#d1ecc6' : '',
                'border-radius': '8px',
                'margin-bottom': '4px',
              }"
            >
              <!-- 测试 -->
              <template #title>
                <div class="item">
                  <span>{{ item.pointName }}</span>
                  <van-icon
                    v-if="item.pointStatus == '2'"
                    name="checked"
                    color="#52c41a"
                    size="1.5rem"
                  />
                  <van-icon
                    v-else
                    name="todo-list"
                    color="#999999"
                    size="1.5rem"
                  />
                </div>
              </template>
            </van-cell>
            <!-- <div>Has NFC: {{ hasNFC() }}</div>
            <div>Latest Read: {{ latest }}</div>
            <div>Error: {{ nfc.error || `No error` }}</div>
            <div>Status: {{ nfc.status }}</div> -->
            <p @click="showDialog('NM-GC-A-001');">"测试":{{results }}</p>
          </van-list>
        </van-pull-refresh>
      </div>
      <div class="inspectionTasks-content-button">
        <van-button
          class="m18"
          round
          native-type="submit"
          @click="router.back()"
        >
          返回
        </van-button>
        <van-button
          class="m18"
          round
          type="primary"
          native-type="submit"
          @click="commitShow = true"
        >
          提交
        </van-button>
      </div>
    </div>
    <van-dialog
      v-model:show="dialogShow"
      :title="dialogTitle"
      show-cancel-button
      @confirm="addInspection"
      cancel-button-text="取消"
    >
      <div
        class="dialog"
        ref="inspectForm"
        style="height: 500px; overflow: auto"
      >
        <van-form label-align="top">
          <!-- 巡检任务：3布尔、2数值、1文本 -->
          <!-- :rules="[{ required: true, message: '请填写用户名' }]" -->
          <template v-for="(widget, index) in formContent" :key="index">
            <div class="widget">
              <van-field
                v-model="widget.checkResult"
                :name="widget.title"
                :label="widget.checkStandard"
                placeholder="请输入"
                v-if="widget.checkType == '3'"
              >
                <template #right-icon>
                  <UploadIcon
                    :index="index"
                    @finishUpload="finishUpload"
                    v-if="!widget.fileUrl"
                  />
                  <van-icon
                    class="photo"
                    name="photograph"
                    color="#f00"
                    v-else
                    @click.stop="showPic(widget.fileUrl, index)"
                  />
                </template>
              </van-field>
              <van-field
                name="数值"
                :label="widget.checkStandard"
                v-if="widget.checkType == '2'"
              >
                <template #input>
                  <van-stepper
                    v-model="widget.checkResult"
                    :decimal-length="4"
                  />
                </template>
                <template #right-icon>
                  <UploadIcon
                    :index="index"
                    @finishUpload="finishUpload"
                    v-if="!widget.fileUrl"
                  />
                  <van-icon
                    class="photo"
                    name="photograph"
                    color="#f00"
                    v-else
                    @click.stop="showPic(widget.fileUrl, index)"
                  />
                </template>
              </van-field>
              <van-field
                name="radio"
                :label="widget.checkStandard"
                v-if="widget.checkType == '1'"
              >
                <template #input>
                  <van-radio-group
                    v-model="widget.checkResult"
                    direction="horizontal"
                  >
                    <van-radio name="1">是</van-radio>
                    <van-radio name="2">否</van-radio>
                  </van-radio-group>
                </template>
                <template #right-icon>
                  <UploadIcon
                    :index="index"
                    @finishUpload="finishUpload"
                    v-if="!widget.fileUrl"
                  />
                  <van-icon
                    class="photo"
                    name="photograph"
                    color="#f00"
                    v-else
                    @click.stop="showPic(widget.fileUrl, index)"
                  />
                </template>
              </van-field>
            </div>
            <!-- <div class="widget" v-if="widget.checkType == '2'">
              <van-field name="数值" :label="widget.checkStandard">
                <template #input>
                  <van-stepper
                    v-model="widget.checkResult"
                    :decimal-length="4"
                  />
                </template>
              </van-field>
              <van-icon class="photo" name="photograph" @click="openCamera" />
            </div>
            <div class="widget" v-if="widget.checkType == '1'">
              <van-field name="radio" :label="widget.checkStandard">
                <template #input>
                  <van-radio-group
                    v-model="widget.checkResult"
                    direction="horizontal"
                  >
                    <van-radio name="1">是</van-radio>
                    <van-radio name="2">否</van-radio>
                  </van-radio-group>
                </template>
              </van-field>
              <van-icon class="photo" name="photograph" @click="openCamera" />
            </div> -->
          </template>
        </van-form>
      </div>
    </van-dialog>
    <!-- 确认操作 -->
    <van-popup v-model:show="commitShow" round>
      <div class="confirm-content">
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <span style="font-size: large; color: #da3231">是否确认提交?</span>
        </div>
        <div class="button-group">
          <van-button
            round
            block
            @click="commitShow = false"
            size="normal"
            style="width: 45%"
          >
            取消
          </van-button>
          <van-button
            :loading="sureOperationLoading"
            type="primary"
            round
            block
            @click="inspectionsSubmit()"
            size="normal"
            style="width: 45%"
          >
            确定
          </van-button>
        </div>
      </div>
    </van-popup>
    <InspectionSubmit
      ref="inspectionSubmitRef"
      v-if="modalShow"
      v-model="modalShow"
      :taskContent="taskContent"
      :confirmList="confirmList"
      @getData="getData"
      @inspectionsSubmits="inspectionsSubmit"
    />
    <div v-if="picShow">
      <h3 class="resetPic" @click="resetPic">重新拍照</h3>
      <van-image-preview
        v-model:show="picShow"
        :images="picUrl"
        :showIndex="false"
      >
        <template #cover>
          <h1>sdfadsfasd</h1>
        </template>
      </van-image-preview>
    </div>
  </div>
</template>

<script setup lang="ts">
/// <reference path="web-nfc.d.ts" />
import type { Ref } from "vue";
import { ref, reactive, computed, nextTick } from "vue";
import { TaskListItem } from "../../types/inspectionTasks";
import InspectionSubmit from "./components/InspectionSubmit.vue";
import { useRoute, useRouter } from "vue-router";
import useNFC, { NFCStatus } from "@/composition/useNFC";
import { showNotify, showToast } from "vant";
import { getType } from "@/utils";
import UploadIcon from "./components/UploadIcon.vue";
import { InspectionTaskItem } from "@/types/inspection";

// NFC相关参数定义
const hasNFC = () => {
  return "NDEFReader" in window;
};

const inspectionSubmitRef: Ref = ref(null);
const inspectForm: Ref = ref(null);
const sureOperationLoading = ref<boolean>(false); //节流加载状态
const commitShow = ref<boolean>(false); //二次确认框

const { startReading, stopReading, is } = useNFC();
const latest = ref<string>("");
const router = useRouter();
const route = useRoute();
// 弹框
const dialogShow = ref<boolean>(false);
const dialogTitle = ref<string>("");
const formContent = ref<any[]>([]);
// 子组件
const modalShow = ref<boolean>(false);
const taskContent = ref<any>(null);

//审批项列表
const loading = ref<boolean>(false); // 加载中状态
const finished = ref<boolean>(false); // 是否完全加载完毕数据
const refreshing = ref<boolean>(false); // 是否刷新

// 数据列表
const taskList = ref<TaskListItem[]>([]);
const curTaskId = ref<number | string>("");
const curPointId = ref<any>(null);
const results = ref<any>("");
const confirmList = ref<any[]>([]);
const picShow = ref<boolean>(false); // 预览图片弹框状态
const picUrl = ref<string[]>([]); // 预览图片
const picIndex = ref<number>(-1); // 预览index

const { proxy } = getCurrentInstance();

// 点击打开手机摄像头
const openCamera = () => {
  console.log("打开摄像头");
};

function numberToChinese(num: number): string {
  const chineseNumbers: string[] = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
  ];
  const unit: string[] = ["", "十", "百", "千"];

  const numStr: string = num.toString();
  const numArray: number[] = numStr.split("").map(Number);

  let result: string = "";

  for (let i = 0; i < numArray.length; i++) {
    const digit: number = numArray[i];
    const digitChinese: string = chineseNumbers[digit];
    const unitChinese: string = unit[numArray.length - 1 - i];

    if (digit === 0) {
      // 如果当前数字是零，并且不是最后一位，则不输出零
      if (i !== numArray.length - 1) {
        continue;
      }
    }

    result += digitChinese + unitChinese;
  }

  return result;
}
function readNFC(item: string) {
  showDialog(item);
  showToast("当前设备巡检ID:" + item);
}
function readCARD(item: string) {
  showToast("当前设备巡检ID:" + item);
  showDialog(item);
}
// 点击列表巡检点
const showDialog = (data: any) => {
  console.log("id", data, taskList.value);
  results.value = data;
  // 1.拿到读取id遍历list对比
  let obj = taskList.value.find((item) => item.pointCode === data);
  if (obj) {
    if (obj.pointStatus === 2) {
      return showNotify({ type: "warning", message: "该点位已巡检" });
    }
    dialogTitle.value = obj.pointName;
    dialogShow.value = true;
    curTaskId.value = obj.equipId;
    curPointId.value = obj.pointId;
    formContent.value = obj.itemList;
    nextTick(() => {
      inspectForm.value.scrollTop = 0;
    });
  } else {
    // 提示设备编号校验错误
    showNotify({ type: "danger", message: "设备匹配失败" });
  }
};

// 点击巡检任务弹框确认按钮
const addInspection = async () => {
  const sendData: InspectionTaskItem[] = [];
  formContent.value.map((obj: InspectionTaskItem) =>
    sendData.push({
      itemId: obj.itemId,
      taskPointId: obj.taskPointId,
      fileUrl: obj.fileUrl,
      checkResult: obj.checkResult,
      checkType: obj.checkType,
    })
  );
  // showToast(sendData);
  // 调用确定任务接口
  const res = await proxy.$api.inspectionManagement.inspectItemConfirm(
    sendData
  );
  if (res.code == 200) {
    dialogShow.value = false;
    const idx = taskList.value.findIndex(
      (item) => item.equipId == curTaskId.value
    );
    taskList.value[idx].pointStatus = 2;
    taskList.value[idx].formContent = formContent.value;
    taskList.value[idx].formContent.map((item) => (item.itemChecked = true));
    showNotify({ type: "success", message: res.message });
  }
};

// 点击巡检任务提交按钮
const inspectionsSubmit = async () => {
  sureOperationLoading.value = true;
  const res = await proxy.$api.inspectionManagement.inspectTaskSub({
    taskId: taskContent.value.taskId,
  });
  if (res.code == 200) {
    sureOperationLoading.value = false;
    commitShow.value = false;
    confirmList.value = res.data.map((point: any) => ({
      ...point,
      itemList: point.itemList.map((item: any) => ({
        ...item,
        itemChecked: true,
      })),
    }));
    if (res.data.length > 0) {
      modalShow.value = true;
    } else {
      showToast("提交成功");
      router.push("/home/inspection");
    }
  }
};

// 获取列表
const onLoad = async () => {
  // 异步更新数据
  if (refreshing.value) {
    taskList.value = [];
    refreshing.value = false;
  }
  await getData();
  // 加载状态结束
  loading.value = false;
  finished.value = true;
};

const getData = async () => {
  const res = await proxy.$api.inspectionManagement.inspectTaskitem({
    id: route.query.id,
  });
  if (res.code == 200) {
    taskList.value.push(...res.data.taskPointList);
    taskContent.value = res.data.task;
  }
};

const onRefresh = () => {
  // 清空列表数据
  finished.value = false;
  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
};

// 完成图片上传
function finishUpload(url: string, index: number) {
  formContent.value[index].fileUrl = url;
}

// 预览图片
function showPic(url: string, index: number) {
  picIndex.value = index;
  picUrl.value = [url];
  picShow.value = true;
}

// 重新拍照
function resetPic() {
  formContent.value[picIndex.value].fileUrl = "";
  picShow.value = false;
}

onMounted(() => {
  startReading();
  //将要给原生调用的方法挂载到 window 上面
  window.readNFC = (item) => {
    return readNFC(item);
  };
  window.readCARD = (item) => {
    return readCARD(item);
  };
});
</script>

<style scoped lang="scss">
.m18 {
  width: 48%;
}

.inspectionTasks {
  background-color: $default-bgc;
  position: relative;
  height: calc(100% - 20px);

  .widget {
    // position: relative;
    display: flex;
    gap: 8px;
    justify-content: space-between;
    align-items: center;

    :deep(.van-stepper__input) {
      width: 200px;
    }

    // .photo {
    //   position: absolute;
    //   top: 63%;
    //   right: 8px;
    // }
  }

  &-content {
    :deep(.van-tabs__wrap) {
      margin-bottom: 20px;
    }

    height: 100%;

    background-color: $default-bgc;

    &-search {
      .drop {
        display: flex;
        box-shadow: 2px 6px 10px 0px #e6e7e8;
        margin-bottom: 18px;
      }

      .van-dropdown-menu {
        flex: 1;
        margin-top: 5px;

        :deep(.van-dropdown-menu__bar) {
          --van-dropdown-menu-shadow: 0;
        }
      }

      .van-search {
        flex: 4;
      }
    }

    &-task {
      margin-top: 8px;
      height: calc(100vh - 105px);
      overflow: auto;

      .item {
        display: flex;
        height: 3rem;
        justify-content: space-between;
        align-items: center;

        span {
          color: #969799;
          font-size: medium;
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
    }
  }
}

.confirm-content {
  padding: 24px;
  background-color: rgba(255, 255, 255, 0.7);
  width: 240px;
  height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .button-group {
    display: flex;
    justify-content: space-between;
  }
}

:root:root {
  --van-dropdown-menu-shadow: 0;
}

.resetPic {
  position: absolute;
  left: 50%;
  bottom: 15%;
  transform: translateX(-50%);
  z-index: 3000;
  color: #fff;
}
</style>
