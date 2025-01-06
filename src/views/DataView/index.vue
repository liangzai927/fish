<template>
  <div class="report">
    <van-tabs v-model:active="active">
      <van-tab
        v-for="(item, index) in tabList"
        :title="item.label"
        :key="index.toString()"
        :name="item.type"
      >
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell
            v-for="item in cardList"
            :key="item.dashboardId"
            :title="item.dashboardName"
            @click="getDetails(item.dashboardId)"
          >
            <template #value>
              <van-icon name="arrow" />
            </template>
          </van-cell>
        </van-list>
      </van-tab>
    </van-tabs>

    <van-back-top />
  </div>
</template>

<script setup lang="ts">
import usePage from "@/hooks/usePage.ts";
// const list = ref<any[]>([]);
const loading = ref<boolean>(false);
const finished = ref<boolean>(false);
const { proxy } = getCurrentInstance() as any;
const router = useRouter();
const active = ref<string>("default");

const tabList = [
  { label: "全部", type: "default" },
  { label: "集团看板", type: "1" },
  { label: "新材料生产实时看板", type: "2" },
  { label: "组合料生产实时看板", type: "3" },
  { label: "聚醚生产实时看板", type: "4" },
  { label: "老厂储罐看板", type: "5" },
  { label: "新厂储罐看板", type: "6" },
];

const { list, getList, pages } = usePage(
  proxy.$api.dataView.findDashboardListForPaging
);
pages.pageSize = 99999;
const onLoad = async () => {
  await getList();
  if (pages.pageNo >= 1) pages.pageNo++;
  loading.value = false;
  if (list.value.length >= pages.total) finished.value = true;
};

const cardList = computed(() => {
  const allList = list.value.filter((item: any) => item.state >= 1);
  if (active.value === "default") {
    return allList;
  } else {
    return allList.filter((item: any) => item.remark == active.value);
  }
});

function getDetails(id: number) {
  router.push({ name: "dataViewDetails", params: { id } });
}
</script>

<style scoped lang="scss">
.report {
  height: 100%;
  overflow-y: auto;
}
</style>
