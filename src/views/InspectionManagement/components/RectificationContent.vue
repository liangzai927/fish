<template>
  <div class="detailsProcess">
    <HeadeBar
      title="隐患整改"
      :leftArrow="true"
      @onClickLeft="emit('update:modelValue', false)"
    ></HeadeBar>
    <div class="details">
      <div class="details-basic">
        <span class="title">{{
          $t("inspectionManagement.inspectionInfo")
        }}</span>
        <div class="content">
          <van-form>
            <!-- 隐患问题 -->
            <!-- :rules="[{ required: true, message: '请填写用户名' }]" -->
            <van-field
              v-model="props.item.dangerProblem"
              name="dangerProblem"
              :label="$t('inspectionManagement.inspectionProblem')"
              placeholder="请输入"
              readonly
            />
            <!-- 隐患问题 -->
            <van-field
              v-model="props.item.dangerRegionName"
              name="dangerRegionName"
              :label="$t('inspectionManagement.inspectionArea')"
              placeholder="请输入"
              readonly
            />
            <van-field
              v-model="props.item.inspectContent"
              name="inspectContent"
              :label="$t('inspectionManagement.inspectionItem')"
              placeholder="请输入"
              readonly
            />
            <!-- 隐患照片 -->
            <van-field
              name="uploader"
              :label="$t('inspectionManagement.inspectionPictrue')"
            >
              <template #input>
                <van-image
                  fit="cover"
                  width="100"
                  height="100"
                  :src="props.item.dangerImage"
                />
              </template>
            </van-field>
          </van-form>
        </div>
      </div>
      <div class="details-basic">
        <span class="title">{{
          $t("inspectionManagement.inspectionPlan")
        }}</span>
        <div class="content">
          <van-form>
            <!-- 整改方案 -->
            <!-- :rules="[{ required: true, message: '请填写用户名' }]" -->
            <van-field
              v-model="commentForm.reformWay"
              name="reformWay"
              :label="$t('inspectionManagement.reformWay')"
              placeholder="请输入"
            />
            <!-- 整改资金 -->
            <van-field
              v-model="commentForm.reformFund"
              name="reformFund"
              :label="$t('inspectionManagement.reformFund')"
              placeholder="请输入"
            />
            <van-field
              v-model="commentForm.finishTime"
              is-link
              readonly
              name="datePicker"
              :label="$t('inspectionManagement.finishTime')"
              @click="show.timePicker = true"
            />
            <van-popup v-model:show="show.timePicker" position="bottom">
              <van-date-picker
                @confirm="(e) => onConfirmTimePicker(e)"
                @cancel="show.timePicker = false"
              />
            </van-popup>
            <!-- 整改照片 -->
            <van-field
              name="uploader"
              :label="$t('inspectionManagement.changePicture')"
            >
              <template #input>
                <van-uploader
                  :before-read="beforeRead"
                  v-model="commentForm.reformImage"
                />
              </template>
            </van-field>
          </van-form>
        </div>
      </div>

      <div class="details-button" v-if="props.item?.reformStatus === 1">
        <van-button
          class="m18"
          round
          type="primary"
          native-type="submit"
          @click="show.dialogShow = true"
        >
          {{ $t("inspectionManagement.insPectionChange") }}
        </van-button>
      </div>
    </div>
    <van-dialog
      v-model:show="show.dialogShow"
      :title="$t('inspectionManagement.nameConfirm')"
      show-cancel-button
      @confirm="passOperation()"
    >
      <!-- :showConfirmButton="false" -->
      <van-signature @submit="saveSign()" />
      <van-image v-if="comment" :src="comment" />
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { showFailToast, showToast } from "vant";
const route = useRoute();
const router = useRouter();
const details = ref<any>(null);
const { proxy } = getCurrentInstance();
const api: any = inject("$api");

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
const commentForm: FormState = reactive({
  reformWay: props.item?.reformWay,
  //   props.item.reformWay
  reformId: null,
  //   props.item.reformId
  reformFund: props.item?.reformFund,
  //   props.item.reformFund
  taskItemId: null,
  //   props.item.taskItemId
  reformImage: [],
  //   props.item.reformImage
  finishTime: dayjs().format("YYYY-MM-DD"),
});

// 点击通过
const passOperation = async () => {
  show.dialogShow = true;
  const { finishTime, ...others } = commentForm;
  const res = await proxy.$api.inspectionManagement.commitInspectHidDanger({
    ...others,
    taskItemId: props.item.taskItemId,
    reformId: props.item.reformId,
  });
  if (res.code == 200) {
    showToast("提交成功");
    emit("update:modelValue", false);
    emit("getData");
  }
};

// 点击时间选择器
const onConfirmTimePicker = (e: any) => {
  show.timePicker = false;
  commentForm.finishTime = e.selectedValues.join("-");
};

function beforeRead(file: any): any {
  let uploadParams = new FormData();
  uploadParams.append("file", file);
  api.common
    .upload(uploadParams)
    .then((res: any) => {
      if (res?.code === 200) {
        showToast("成功");
        commentForm.reformImage.push({ url: res.data });
      } else showToast("失败");
    })
    .catch((err) => {
      alert(err.message);
      // showToast("catch");
    });
}

onMounted(() => {
  //   if (props.item) {
  //     for (let k in commentForm) {
  //       commentForm[k] = props.item[k];
  //     }
  //   }
});
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
    // height: calc(100% - 30px);
    &-head {
      padding: 8px;
    }
    &-basic {
      background-color: $default-bgc;
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
