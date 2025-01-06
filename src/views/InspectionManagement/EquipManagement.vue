<!-- 设备台账 -->
<template>
  <div class="equipment">
    <div class="equipment-content">
      <van-sticky offset-top="45px">
        <div class="equipment-content-search">
          <van-field
            v-model="searchData.path"
            is-link
            readonly
            label="设备类型"
            placeholder="请选择设备类型"
            @click="searchData.show = true"
          />
          <van-popup v-model:show="searchData.show" round position="bottom">
            <van-cascader
              v-model="categoryId"
              title="请选择设备类型"
              :options="searchData.treeList"
              @close="searchData.show = false"
              @change="onFinish"
              :field-names="{
                text: 'categoryName',
                value: 'categoryId',
                children: 'children',
              }"
            />
          </van-popup>
        </div>
      </van-sticky>
      <!-- 列表内容 -->
      <div class="equipment-content-task">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            :finished-text="$t('loadEndTip')"
            @load="onLoad"
            :offset="15"
          >
            <equipment-card
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
    <equipment-content
      ref="equipmentContentRef"
      v-if="modalShow"
      v-model="modalShow"
      :item="curItem"
      @getData="onLoad"
    />
  </div>
</template>

<script setup lang="ts">
import EquipmentCard from "./components/EquipmentCard.vue";
import { TaskListItem } from "../../types/equipment";
import { nextTick, ref } from "vue";
import EquipmentContent from "./components/EquipmentContent.vue";

// 搜索选择框数据初始化
const searchData = ref<any>({
  path: "全部",
  show: false,
  treeList: [],
});
const categoryId = ref<number | string>(0);

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
const { proxy } = getCurrentInstance();
// 子组件
const modalShow = ref<boolean>(false);
const curItem = ref<any>();
const equipmentContentRef: Ref = ref(null);

// 获取设备树
const getTreeList = async () => {
  const res = await proxy.$api.equipManagement.equipTreeList({});
  if (res.code == 200) {
    searchData.value.treeList = res.data.rows;
  }
};

// 点击列表
const editItem = (item: any) => {
  modalShow.value = true;
  curItem.value = item;
  //   nextTick(() => {
  //     equipmentContentRef?.value?.getDetailData(item.taskId);
  //   });
};

const getData = async () => {
  const res = await proxy.$api.equipManagement.equipFileList({
    pageNo: page.pageNo,
    pageSize: page.pageSize,
    categoryId: categoryId.value,
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

// 全部选项选择完毕后，会触发 finish 事件
const onFinish = ({ value, selectedOptions }) => {
  console.log(value, selectedOptions, searchData.value.cascaderValue);
  searchData.value.show = false;
  searchData.value.path = selectedOptions
    .map((option: any) => option.categoryName)
    .join("/");
  categoryId.value = value;
  taskList.value = [];
  page.pageNo = 1;
  nextTick(() => {
    getData();
  });
};

onMounted(() => {
  getTreeList();
});
</script>

<style scoped lang="scss">
.equipment {
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
      height: calc(100vh - 98px);
      overflow: auto;
      background-color: $default-bgc;
    }
  }
}

:root:root {
  --van-dropdown-menu-shadow: 0;
}
</style>
