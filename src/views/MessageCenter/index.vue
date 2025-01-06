<template>
  <message-content
    v-if="modalShow"
    v-model="modalShow"
    :item="curItem"
    :logId="curLogId"
    @getData="getData"
  />
  <div v-else class="production">
    <div class="production-content">
      <div class="production-content-task">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            :finished-text="$t('loadEndTip')"
            @load="onLoad"
          >
            <message-card
              v-for="item in taskList"
              :key="item.logId"
              :item="item"
              @editItem="editItem(item)"
            />
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import messageCard from "./components/messageCard.vue";
import { TaskListItem } from "../../types/production";
import messageContent from "./components/messageContent.vue";

//审批项列表
const loading = ref<boolean>(false); // 加载中状态
const finished = ref<boolean>(false); // 是否完全加载完毕数据
const refreshing = ref<boolean>(false); // 是否刷新
const pageNo = ref<number>(1);
const total = ref<number>(30);
// 数据列表
const taskList = ref<TaskListItem[]>([]);
const { proxy } = getCurrentInstance();
// 子组件
const modalShow = ref<boolean>(false);
const curItem = ref<any>();
const curLogId= ref<any>();

// 点击列表
const editItem = (item: any) => {
  modalShow.value = true;
  curItem.value = item;
  curLogId.value = item.logId;
};

// 获取列表
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

const getData = async () => {
  taskList.value = [];
  const res = await proxy.$api.messageManagement.messageListHttp({
    pageNo: pageNo.value,
    pageSize: 30,
  });
  if (res.code == 200) {
    taskList.value.push(...res.data.rows);
    total.value = res.data.total;
    for (let i = 0; i < res.data.total; i++) {
      taskList.value[i].img = "qf_logo";
    }
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
</script>

<style scoped lang="scss">
.production {
  background-color: $default-bgc;
  position: relative;
  &-content {
    :deep(.van-tabs__wrap) {
      margin-bottom: 20px;
    }
    margin-bottom: 20px;
    background-color: $default-bgc;

    &-search {
      display: flex;
      justify-content: space-between;

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
