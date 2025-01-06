<!-- 设备详情维保记录 -->
<template>
  <div class="detailsProcess">
    <HeadeBar
      title="详情"
      :leftArrow="true"
      @onClickLeft="emit('update:modelValue', false)"
    ></HeadeBar>
    <div class="details">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('loadEndTip')"
          @load="onLoad"
          :offset="15"
        >
          <div
            class="maintenance"
            v-for="item in taskList"
            :key="item.taskId"
            :item="item"
          >
            <h3>计划名称</h3>
            <p>执行人：{{ item.commitUserName }}</p>
            <p>执行时间：{{ item.commitTime }}</p>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
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
  equipId: any;
}

const props = withDefaults(defineProps<Props>(), {
  equipId: 0,
});

interface Emit {
  (e: "update:modelValue", bool: boolean): void;
  (e: "getData"): void;
}
const emit = defineEmits<Emit>();

const loading = ref<boolean>(false); // 加载中状态
const finished = ref<boolean>(false); // 是否完全加载完毕数据
const refreshing = ref<boolean>(false); // 是否刷新
const page = reactive({
  pageNo: 1,
  pageSize: 10,
});
const total = ref<number>(0);
const taskList = ref<any[]>([]);

const getData = async () => {
  const res = await proxy.$api.equipManagement.getDefendTaskHttp({
    pageNo: page.pageNo,
    pageSize: page.pageSize,
    equipId: props.equipId,
  });
  if (res.code == 200) {
    if (page.pageNo < 2) {
      taskList.value = res.rows || [];
    } else {
      taskList.value.push(...res.data.rows);
    }
    total.value = res.data.total;
  }
};

// 获取列表
const onLoad = async () => {
  // 异步更新数据
  if (refreshing.value) {
    taskList.value = [];
    refreshing.value = false;
    page.pageNo = 1;
  }
  page.pageNo++;
  await getData();
  // 加载状态结束
  loading.value = false;
  if (taskList.value.length >= total.value) {
    // 数据全部加载完成
    finished.value = true;
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

onMounted(() => {
  //   if (props.item) {
  //     for (let k in commentForm) {
  //       commentForm[k] = props.item[k];
  //     }
  //   }
});

// defineExpose({ getDetailData });
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
    .maintenance {
      border-bottom: 1px solid #f6f7f8;
    }

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
        &-content {
          color: #a1a9bc;
          font-size: 12px;
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
