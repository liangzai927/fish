<template>
  <div class="production">
    <div class="production-content" ref="containerRef">
      <!-- 列表内容 -->
      <van-tabs
        v-model:active="active"
        @click-tab="changeTab"
        sticky
        offset-top="46px"
      >
        <van-sticky :container="containerRef" offset-top="190px">
          <div class="production-content-search">
            <!-- <van-dropdown-menu>
              <van-dropdown-item
                v-model="searchData.selected"
                :options="equipListOptions"
                :field-names="{
                  text: 'equipName',
                  value: 'equipId',
                }"
              />
            </van-dropdown-menu> -->
            <!-- <van-search
              v-model="searchData.search"
              shape="round"
              placeholder="搜索"
            /> -->
          </div>
        </van-sticky>
        <van-tab
          v-for="(item, idx) in tabList"
          :key="idx + 1"
          :name="item.key"
          :title="item.value"
        >
          <div class="production-content-task">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <van-list
                v-model:loading="loading"
                :finished="finished"
                :finished-text="$t('loadEndTip')"
                @load="onLoad"
                :offset="90"
                style="margin-top: 12px"
              >
                <task-card
                  v-for="item in taskList"
                  :key="item.mfgId"
                  :item="item"
                />
              </van-list>
            </van-pull-refresh>
            <van-back-top />
          </div>
        </van-tab>
      </van-tabs>
      <!-- 浮动组件 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import TaskCard from "./components/TaskCard.vue";
import { TaskListItem } from "../../types/production";
import { type Ref, reactive, onMounted, watch, computed, ref } from "vue";

const active = ref<number>(10);
// 搜索选择框数据初始化
const searchData = ref<any>({
  selected: 0,
  search: "",
});
const tabList = ref<any>([
  {
    key: 10,
    value: "待开工",
  },
  {
    key: 1,
    value: "生产中",
  },
  {
    key: 11,
    value: "已完工",
  },
  {
    key: 2,
    value: "已报工",
  },
  {
    key: 3,
    value: "已入库",
  },
  {
    key: 0,
    value: "全部",
  },
]);
const containerRef: Ref = ref(null);
const loading = ref<boolean>(false);
const finished = ref<boolean>(false);
const refreshing = ref<boolean>(false);
const page = reactive({
  pageNo: 1,
  pageSize: 10,
});
const total = ref<number>(0);
const taskList = ref<TaskListItem[]>([]);
const { proxy } = getCurrentInstance();
const equipListOptions = ref<any>([]);

const changeTab = () => {
  // console.log("changeTab", val, active.value);
  total.value = 0;
  taskList.value = [];
  page.pageNo = 1;
  finished.value = false;
  loading.value = true;
  onLoad();
};

const onLoad = async () => {
  if (refreshing.value) {
    taskList.value = [];
    refreshing.value = false;
    page.pageNo = 1;
  }

  await getData();
  page.pageNo++;
  loading.value = false;
  if (taskList.value.length >= total.value) {
    finished.value = true;
  }
};

const getData = async () => {
  let sendData = {};
  if (active.value == 0) {
    sendData = {
      pageNo: page.pageNo,
      pageSize: 10,
      queryChild: true,
    };
  } else {
    sendData = {
      pageNo: page.pageNo,
      pageSize: 10,
      queryChild: true,
      status: active.value,
    };
  }
  const res = await proxy.$api.productionOperations.productionOrderList(
    sendData
  );
  if (res.code == 200) {
    if (page.pageNo < 2) {
      for (let i = 0; i < res.data.list.length; i++) {
        res.data.list[i].img = "qf_logo";
      }
      taskList.value = res.data.list || [];
    } else {
      for (let i = 0; i < res.data.list.length; i++) {
        res.data.list[i].img = "qf_logo";
      }
      taskList.value.push(...res.data.list);
    }
    total.value = res.data.total;
  }
};

const getEquipmentList = async () => {
  const res = await proxy.$api.productionOperations.equipRecordList({
    pageNo: 1,
    pageSize: 9999,
  });
  if (res.code == 200) {
    equipListOptions.value = res.data.rows;
  }
};

const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoad();
};

onMounted(() => {
  onRefresh();
  getEquipmentList();
});
</script>

<style scoped lang="scss">
.production {
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
      height: calc(100vh - 106px);
      overflow: auto;
    }
  }
}

:root:root {
  --van-dropdown-menu-shadow: 0;
}
</style>
