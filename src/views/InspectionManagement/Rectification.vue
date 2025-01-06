<template>
  <div class="rectification">
    <div class="rectification-content" v-if="!modalShow">
      <van-sticky offset-top="46px">
        <div class="rectification-content-search">
          <van-search
            input-align="center"
            style="margin-bottom: -5px"
            v-model="searchData.search"
            shape="round"
            placeholder="搜索"
          />
        </div>
      </van-sticky>
      <!-- 列表内容 -->
      <van-tabs
        v-model:active="active"
        @click-tab="changeTab"
        sticky
        offset-top="90px"
      >
        <van-tab
          v-for="(item, idx) in tabList"
          :key="idx + 1"
          :title="item.value"
        >
          <div class="rectification-content-task" ref="taskListRef">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <van-list
                v-model:loading="loading"
                :finished="finished"
                :finished-text="$t('loadEndTip')"
                @load="onLoad"
                :offset="15"
              >
                <rectification-card
                  v-for="item in taskList"
                  :key="item.mfgId"
                  :item="item"
                  @editItem="editItem(item)"
                />
              </van-list>
            </van-pull-refresh>
          </div>
          <van-back-top v-if="!modalShow" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
  <rectification-content
    v-if="modalShow"
    v-model="modalShow"
    :item="curItem"
    @getData="getData"
  />
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted, nextTick } from "vue";
import { TaskListItem } from "../../types/rectification";
import RectificationCard from "./components/RectificationCard.vue";
import RectificationContent from "./components/RectificationContent.vue";

// 搜索选择框数据初始化
const searchData = ref<any>({
  taskType: 0,
  taskState: 0,
  sort: 0,
  search: "",
});

const searchTypeList = ref<any[]>([
  { text: "隐患", value: 0 },
  { text: "巡检", value: 1 },
]);

const searchDropList = ref<any[]>([
  { text: "全部", value: 0 },
  { text: "进行中", value: 1 },
  { text: "我发起的", value: 1 },
  { text: "我参与的", value: 1 },
  { text: "已完成", value: 1 },
]);

const searchSortList = ref<any[]>([
  { text: "排序", value: 0 },
  { text: "已创建的应用", value: 1 },
]);

// tab组件
const active = ref<number>(0);
const tabList = ref<any[]>([
  {
    key: 1,
    value: "进行中",
  },
  {
    key: 2,
    value: "已完成",
  },
  {
    key: 3,
    value: "已逾期",
  },
]);

// 子组件
const modalShow = ref<boolean>(false);
const curItem = ref<any>();

//审批项列表
const loading = ref<boolean>(false); // 加载中状态
const finished = ref<boolean>(false); // 是否完全加载完毕数据
const refreshing = ref<boolean>(false); // 是否刷新
const page = reactive({
  pageNo: 1,
  pageSize: 10,
});

const total = ref<number>(0);

// 数据列表
const taskList = ref<TaskListItem[]>([]);
const taskListRef = ref<HTMLElement | null>(null);
const { proxy } = getCurrentInstance();

// 点击列表
const editItem = async (item: any) => {
  // 设置当前项并显示模态框
  modalShow.value = true;
  curItem.value = item;
};

const changeTab = (val: number) => {
  total.value = 0;
  taskList.value = [];
  page.pageNo = 1;
  finished.value = false;
  loading.value = true;
  onLoad();
};

// 获取列表
const onLoad = async () => {
  // 异步更新数据
  if (refreshing.value) {
    taskList.value = [];
    refreshing.value = false;
    page.pageNo = 1;
  }

  await getData();
  page.pageNo++;

  // 加载状态结束
  loading.value = false;
  if (taskList.value.length >= total.value) {
    finished.value = true;
  }
};

const getData = async () => {
  const res = await proxy.$api.inspectionManagement.inspectHidDangerList({
    pageNo: page.pageNo,
    pageSize: page.pageSize,
    reformStatus: active.value + 1,
  });
  if (res.code == 200) {
    taskList.value.push(...res.data.rows);
    total.value = res.data.total;
  }
};

const onRefresh = () => {
  // 清空列表数据
  finished.value = false;

  // 重新加载数据
  loading.value = true;
  onLoad();
};

onMounted(() => {
  onRefresh();
});
</script>

<style scoped lang="scss">
.rectification {
  background-color: $default-bgc;
  position: relative;

  &-content {
    margin-bottom: 20px;
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
      height: calc(100vh - 139px);
      overflow: auto;
    }
  }
}

:root:root {
  --van-dropdown-menu-shadow: 0;
}
</style>
