<template>
  <div class="approval">
    <div class="approval-content" ref="containerRef">
      <!-- 主页tab -->
      <van-tabs
        v-model:active="active"
        @change="changeTab()"
        sticky
        offset-top="46px"
      >
        <van-sticky :container="containerRef" offset-top="90px">
          <div class="approval-content-search">
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="searchData.selected"
                :options="searchDropList"
              />
            </van-dropdown-menu>
            <van-search
              v-model="searchData.search"
              shape="round"
              placeholder="搜索"
            />
          </div>
        </van-sticky>
        <van-tab v-for="(item, idx) in tabList" :key="idx + 1">
          <template #title>
            <div v-if="idx == 1 && tabList.length > 0">
              <van-badge dot>
                <span>{{ item.value }}</span>
              </van-badge>
            </div>
            <span v-else>{{ item.value }}</span>
          </template>
          <div class="approval-content-task">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                :offset="15"
              >
                <process-card
                  v-for="item in taskList"
                  :key="item.id"
                  :item="item"
                  :active="active"
                />
              </van-list>
            </van-pull-refresh>
          </div>
        </van-tab>
      </van-tabs>
      <van-back-top />
      <!-- 浮动组件 -->
      <van-floating-bubble
        axis="xy"
        icon="plus"
        magnetic="x"
        style="height: 40px; width: 40px"
        @click="showPicker = true"
      />
      <!-- 发起流程弹框 -->
      <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker
          v-model="creatProcessId"
          :columns="columns"
          @cancel="showPicker = false"
          @confirm="onConfirm()"
          :columns-field-names="{ text: 'processName', value: 'definitionId' }"
        />
      </van-popup>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProcessCard from "./components/ProcessCard.vue";

const router = useRouter();
// 搜索选择框数据初始化
const searchData = ref<any>({
  selected: 0,
  search: "",
});
const searchDropList = ref<any[]>([
  { text: "全部", value: 0 },
  { text: "已创建的应用", value: 1 },
]);
const page = reactive({
  pageNo: 0,
  pageSize: 10,
});
const total = ref<number>(0);
const { proxy } = getCurrentInstance();
const columns = ref<any>([]);

//审批项列表
const loading = ref(false); // 加载中状态
// 是否完全加载完毕数据
const finished = ref(false);
const refreshing = ref<boolean>(false); // 是否刷新
// 数据列表
const taskList = ref<any>([]);
const active = ref<number>(0);
const showPicker = ref(false);
const creatProcessId = ref<string[]>([]);
const containerRef = ref(null);
const tabList = ref<any>([
  {
    key: 0,
    value: "我发起的",
  },
  {
    key: 1,
    value: "待处理",
  },
  {
    key: 2,
    value: "已处理",
  },
  {
    key: 3,
    value: "我收到的",
  },
]);

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

const changeTab = () => {
  taskList.value = [];
  page.pageNo = 1;
  nextTick(() => {
    getData();
  });
};

// 获取待办列表
const getData = async () => {
  const res = await proxy.$api.workFlow.workFlowList({
    pageNum: page.pageNo,
    pageSize: 10,
    type: active.value + 1,
  });
  if (res.code == 200) {
    if (page.pageNo < 2) {
      taskList.value = res.rows || [];
    } else {
      taskList.value.push(...res.rows);
    }
    total.value = res.total;
  }
};

const onRefresh = () => {
  // 清空列表数据
  finished.value = false;
  loading.value = true;
  onLoad();
};

// 获取弹框流程定义列表
const creatTaskList = async () => {
  const res = await proxy.$api.workFlow.processList();
  if (res.code == 200) {
    columns.value = res.data;
  }
};

// 查看详情
const onConfirm = () => {
  router.push({
    path: "/home/approval/creatProcess",
    query: { procDefId: creatProcessId.value[0] },
  });
};

onMounted(() => {
  creatTaskList();
});
</script>

<style scoped lang="scss">
:deep(.van-tab__text--ellipsis) {
  overflow: visible !important;
}
.approval {
  background-color: $default-bgc;

  &-content {
    background-color: $default-bgc;

    &-search {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      background-color: #fff;
      width: 100%;

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
      height: calc(100vh - 144px);
      overflow: auto;
    }
  }
}

:root:root {
  --van-dropdown-menu-shadow: 0;
}
</style>
