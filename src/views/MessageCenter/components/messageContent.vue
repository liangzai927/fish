<template>
  <div class="detailsProcess">
    <HeadeBar
      title="收件箱"
      :leftArrow="true"
      @onClickLeft="emit('update:modelValue', false)"
    ></HeadeBar>
    <div class="details">
      <div class="details-basic">
        <div class="title">
          <span class="data">{{formatTime(messageDetail?.updateTime||'')}}</span>
          <h3>{{messageDetail?.messageTitle}}</h3>
        </div>
        <div class="content">
          <p>
            {{messageDetail?.messageContent}}  
          </p>
        </div>
      </div>

      <div class="details-button">
        <van-button
          class="m18"
          round
          type="primary"
          native-type="submit"
          @click="show.dialogShow = true"
        >
          主要操作
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
import {formatTime} from '@/utils/common.ts';

const route = useRoute();
const router = useRouter();
const details = ref<any>(null);
const { proxy } = getCurrentInstance();

interface Props {
  item: any;
  logId: any;
}

const props = withDefaults(defineProps<Props>(), {
  item: null,
  logId: 0,
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
const messageDetail=ref<any>();

const getDetail = async () => {
  const res = await proxy.$api.messageManagement.messageDetailHttp({
logId:props.logId
  });
  if (res.code == 200) {
    messageDetail.value=res.data
  }
};
const changeState = async () => {
  const res = await proxy.$api.messageManagement.changeMessageState({
logId:props.logId
  });
  if (res.code == 200) {
  }
};

onMounted(() => {
  console.log(props);
    if (props.logId) {
      getDetail()
    }
});
</script>

<style scoped lang="scss">
.detailsProcess {
  background-color: #fff;
  height: 100%;
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 99;
  .details{
    margin-top: 43px;
    height: calc(100% - 46px);
    &-head {
      padding: 8px;
    }
    &-basic {
      background-color: #fff;
      height: calc(100% - 60px);
      .title {
        padding: 8px 18px;
        display: block;
        .data {
          color: #9da2a9;
        }
        h3 {
          margin-top: 8px;
        }
      }
      .content {
        margin: 0 12px;
        border-top: 1px solid #eeeeee;
        padding: 8px;
        color: #9ea0a0;
        width: calc(100% - 24px);
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
