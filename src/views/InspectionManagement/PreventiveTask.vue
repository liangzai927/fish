<!-- 预防性维护 -->
<template>
  <div class="inspection">
    <div class="inspection-content">
      <van-sticky offset-top="45px">
        <div class="inspection-content-search">
          <van-search
            input-align="center"
            v-model="searchData.search"
            shape="round"
            placeholder="搜索"
          />
          <!-- <div class="drop">
                    <van-dropdown-menu>
                      <van-dropdown-item
                        v-model="searchData.taskType"
                        :options="searchTypeList"
                      />
                    </van-dropdown-menu>
                    <van-dropdown-menu>
                      <van-dropdown-item
                        v-model="searchData.taskState"
                        :options="searchDropList"
                      />
                    </van-dropdown-menu>
                    <van-dropdown-menu>
                      <van-dropdown-item
                        v-model="searchData.sort"
                        :options="searchSortList"
                      />
                    </van-dropdown-menu>
                  </div> -->
        </div>
      </van-sticky>
      <!-- 列表内容 -->
      <div class="inspection-content-task">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            :finished-text="$t('loadEndTip')"
            @load="onLoad"
            :offset="15"
          >
            <preventive-card
              v-for="item in taskList"
              :key="item.taskId"
              :item="item"
              @editItem="editItem(item)"
            />
          </van-list>
        </van-pull-refresh>
      </div>
      <!-- <van-tabs v-model:active="active" @click-tab="onLoad">
        <van-tab v-for="item in tabList" :key="item.key" :title="item.value">
            
        </van-tab>
      </van-tabs> -->
    </div>
    <preventive-content
      ref="preventiveContentRef"
      v-if="modalShow"
      v-model="modalShow"
      :item="curItem"
      @getData="onLoad"
    />
  </div>
</template>

<script setup lang="ts">
import PreventiveCard from "./components/PreventiveCard.vue";
import { TaskListItem } from "../../types/inspection";
import { nextTick, ref } from "vue";
import PreventiveContent from "./components/PreventiveContent.vue";

// 搜索选择框数据初始化
const searchData = ref<any>({
  taskType: 0,
  taskState: 0,
  sort: 0,
  search: "",
});

//审批项列表
const loading = ref<boolean>(false); // 加载中状态
const finished = ref<boolean>(false); // 是否完全加载完毕数据
const refreshing = ref<boolean>(false); // 是否刷新
const pageNo = ref<number>(1);
const total = ref<number>(0);
// 数据列表
const taskList = ref<TaskListItem[]>([]);
const { proxy } = getCurrentInstance();
// 子组件
const modalShow = ref<boolean>(false);
const curItem = ref<any>();
const preventiveContentRef: Ref = ref(null);
// 点击列表
const editItem = (item: any) => {
  //   alarmId.value = id;
  modalShow.value = true;
  curItem.value = item;
  nextTick(() => {
    // console.log(preventiveContentRef.value);
    preventiveContentRef?.value?.getDetailData(item.taskId);
  });
};

const getData = async () => {
  const res = await proxy.$api.inspectionManagement.preventiveTaskList({
    pageNo: pageNo.value,
    pageSize: 10,
    // queryChild: true,
    // status: active.value == 4 ? null : active.value,
  });
  if (res.code == 200) {
    if (pageNo.value < 2) {
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
    pageNo.value = 1;
  }
  pageNo.value++;
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
</script>

<style scoped lang="scss">
.inspection {
  background-color: $default-bgc;
  height: 100%;
  padding-bottom: 26px;

  &-content {
    margin-bottom: 20px;
    height: 100%;
    background-color: $default-bgc;

    &-search {
      margin-bottom: 24px;
      box-shadow: 2px 6px 10px 0px #e6e7e8;

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
      background-color: $default-bgc;
    }
  }
}

:root:root {
  --van-dropdown-menu-shadow: 0;
}
</style>
