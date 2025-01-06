<template>
  <div class="approval">
    <div class="approval-content">
      <!-- 主页tab -->
      <van-search
        v-model="searchData.search"
        shape="round"
        placeholder="搜索"
      />
      <div class="changeTab">
        <van-tabs v-model:active="curTab" @change="changeTab()">
          <van-tab v-for="item in tabList" :key="item.key" :title="item.value">
          </van-tab>
        </van-tabs>
        <van-dropdown-menu>
          <van-dropdown-item
            v-model="searchData.selected"
            :options="searchDropList"
          />
        </van-dropdown-menu>
      </div>
      <div class="production-content-task">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            :finished-text="$t('loadEndTip')"
            @load="onLoad"
          >
            <todo-card
              v-for="item in taskList"
              :key="item.id"
              :item="item"
              :active="active"
            />
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TodoCard from "./components/TodoCard.vue";

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
const pageNo = ref<number>(1);
const total = ref<number>(30);
const { proxy } = getCurrentInstance();
const columns = ref<any>([]);
// tab组件
const curTab = ref(0);
const tabList = ref<any>([
  {
    key: 0,
    value: "我负责的",
  },
  {
    key: 1,
    value: "我创建的",
  },
  {
    key: 2,
    value: "我参与的",
  },
]);

//审批项列表
const loading = ref(false); // 加载中状态
// 是否完全加载完毕数据
const finished = ref(false);
const refreshing = ref<boolean>(false); // 是否刷新
// 数据列表
const taskList = ref<any>([]);
const active = ref<number>(0);
const opearationType = ref<number>(0);
const showPicker = ref(false);
const creatProcessId = ref<string[]>([]);

const onLoad = async () => {
  // 异步更新数据
  if (refreshing.value) {
    taskList.value = [];
    refreshing.value = false;
    pageNo.value = 1;
  }
  await getData();
  // 加载状态结束
  loading.value = false;
  if (taskList.value.length >= total.value) {
    // 数据全部加载完成
    finished.value = true;
  } else {
    pageNo.value++;
    await getData();
  }
};

const changeTab = () => {
  taskList.value = [];
  pageNo.value = 1;
  nextTick(() => {
    getData();
  });
};

// 获取待办列表
const getData = async () => {
  //   const res = await proxy.$api.workFlow.workFlowList({
  //     pageNum: pageNo.value,
  //     pageSize: 30,
  //     type: active.value + 1,
  //   });
  taskList.value.push({
    todoName: "某某",
    todoDes: "描述",
    todoMan: "xx",
    creatTime: "2023-03-23",
  });
  total.value = 1;
  //   if (res.code == 200) {
  //     total.value = res.total;
  //   }
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
.approval {
  background-color: $default-bgc;

  &-content {
    background-color: $default-bgc;
    .changeTab {
      display: flex;
      background-color: #fff;
      margin-bottom: 5px;
      .van-tabs {
        height: 100%;
        flex: 80%;
      }
      .van-dropdown-menu {
        flex: 20%;

        :deep(.van-dropdown-menu__bar) {
          --van-dropdown-menu-shadow: 0;
        }
      }
    }

    &-search {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      background-color: #fff;

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
  }
}

:root:root {
  --van-dropdown-menu-shadow: 0;
}
</style>
