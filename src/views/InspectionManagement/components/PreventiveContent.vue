<template>
  <div class="detailsProcess">
    <HeadeBar
      title="预防性维护"
      :leftArrow="true"
      @onClickLeft="emit('update:modelValue', false)"
    ></HeadeBar>
    <div class="details">
      <div class="details-basic">
        <div class="task-info">
          <h3>{{ props.item.taskName }}</h3>
        </div>
      </div>
      <div class="details-basic">
        <div class="task-info">
          <div style="padding-bottom: 12px">
            <!-- <p class="task-info-title">设备名称</p> -->
            <p style="font-size: smaller">
              上次润滑时间：{{ props.item.createTime.split(" ")[0] }}
            </p>
          </div>
          <div>
            <!-- <p class="task-info-title">任务类型</p> -->
            <p v-if="props.item.taskStatus == '1'" style="font-size: smaller">
              待处理
            </p>
            <p v-if="props.item.taskStatus == '2'" style="font-size: smaller">
              跳过
            </p>
            <p v-if="props.item.taskStatus == '3'" style="font-size: smaller">
              完成
            </p>
          </div>
        </div>
      </div>
      <div class="details-basic">
        <div class="content">
          <span class="title">业务要求</span>
          <div v-for="(item, idx) in detailsData?.plan.planRule" :key="idx">
            <van-checkbox style="padding-left: 8px" v-model="item.checked">
              <div class="ruleItem">
                <span>&nbsp;&nbsp;{{ item.value }}</span>
                <p>{{ item.key }}</p>
              </div>
            </van-checkbox>
          </div>
        </div>
      </div>
      <div class="details-button">
        <van-button
          style="width: 48%"
          round
          native-type="submit"
          @click="resultSubmit('1')"
        >
          略过本次
        </van-button>
        <van-button
          style="width: 48%"
          round
          type="primary"
          native-type="submit"
          @click="resultSubmit('2')"
        >
          结果提交
        </van-button>
      </div>
    </div>
    <van-dialog
      v-model:show="show.dialogShow"
      :title="dialogTitle"
      show-cancel-button
      @confirm="passOperation()"
    >
      <div style="border: 1px solid #dfdfdf; margin: 24px">
        <van-field v-model="result" name="result" placeholder="备注" />
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { showFailToast, showToast } from "vant";
const route = useRoute();
const router = useRouter();
const details = ref<any>(null);
const { proxy } = getCurrentInstance();

interface Props {
  item: any;
}

const props = withDefaults(defineProps<Props>(), {
  item: null,
});

interface Emit {
  (e: "update:modelValue", bool: boolean): void;
  (e: "getData"): void;
}
const emit = defineEmits<Emit>();
interface FormState {
  reformWay: string;
  reformFund: string;
  reformId: number;
  taskItemId: number;
  reformImage: any;
  finishTime: Dayjs;
}
const show = reactive({
  dialogShow: false,
  timePicker: false,
});
const comment = ref("");
const dialogTitle = ref("任务结果提交");
const dialogType = ref();
const result = ref();
const detailsData = ref<any>(null);
const commentForm: FormState = reactive({
  reformWay: "",
  //   props.item.reformWay
  reformId: null,
  //   props.item.reformId
  reformFund: "",
  //   props.item.reformFund
  taskItemId: null,
  //   props.item.taskItemId
  reformImage: [],
  //   props.item.reformImage
  finishTime: dayjs().format("YYYY-MM-DD"),
});

// 点击通过
const passOperation = async () => {
  if (dialogType.value == "1") {
    // 跳过本次任务
    const res = await proxy.$api.inspectionManagement.preventiveTaskConfirm({
      taskStatus: 2,
      taskItemId: props.item.taskItemId,
      taskId: props.item.taskId,
    });
    if (res.code == 200) {
      show.dialogShow = false;
      showToast("操作成功");
      emit("getData").then(() => {
        emit("update:modelValue", false);
      });
    }
  } else {
    // 结果提交
    const res = await proxy.$api.inspectionManagement.preventiveTaskConfirm({
      taskStatus: 3,
      taskItemId: props.item.taskItemId,
      remark: result.value,
      taskId: props.item.taskId,
    });
    if (res.code == 200) {
      show.dialogShow = false;
      showToast("操作成功");
      emit("update:modelValue", false);
      emit("getData");
    }
  }
};

// 点击按钮
const resultSubmit = (type: string) => {
  show.dialogShow = true;
  dialogType.value = type;
  if (type == "1") {
    dialogTitle.value = "跳过本次任务";
  } else {
    dialogTitle.value = "任务结果提交";
  }
};

const getDetailData = async (id) => {
  const res = await proxy.$api.inspectionManagement.getDefendTask({ id });
  console.log(res);
  if (res?.code === 200) {
    detailsData.value = res.data;
    detailsData.plan.planRule.map((item: any) => ({
      ...item,
      itemChecked: false,
    }));
  }
};

// 点击时间选择器
const onConfirmTimePicker = (e: any) => {
  show.timePicker = false;
  commentForm.finishTime = e.selectedValues.join("-");
};

onMounted(() => {
  //   if (props.item) {
  //     for (let k in commentForm) {
  //       commentForm[k] = props.item[k];
  //     }
  //   }
});

defineExpose({ getDetailData });
</script>

<style scoped lang="scss">
.detailsProcess {
  background-color: $default-bgc;
  height: 100%;
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 99;

  .details {
    // background-color: #fff;
    overflow: auto;
    height: calc(100% - 30px);
    margin-top: 43px;

    .details-button {
      padding: 8px;
      background-color: #fff;
      position: fixed;
      bottom: 0px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-head {
      padding: 8px;
    }

    &-basic {
      background-color: $default-bgc;

      .ruleItem {
        width: 100%;
        padding: 8px 0;
        //  border-bottom:1px solid #dfdfdf;
      }

      .task-info {
        padding: 12px;
        background-color: #fff;
        margin-bottom: 8px;

        &-title {
          color: #000;
        }
      }

      .title {
        padding: 8px 18px;
        display: block;
      }

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
        p {
          background-color: #d7d7d7;
          color: black;
          padding: 4px;
          border-radius: 4px;
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
      justify-content: flex-end;
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
