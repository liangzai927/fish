<template>
  <div class="report">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      style="height: 100%; overflow: auto"
    >
      <van-cell
        v-for="item in list"
        :key="item.flowChartId"
        :title="item.flowChartName"
        @click="getDetails(item.flowChartId)"
      >
        <template #value>
          <van-icon name="arrow" />
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script setup lang="ts">
import usePage from "@/hooks/usePage.ts";
// const list = ref<any[]>([]);
const loading = ref<boolean>(false);
const finished = ref<boolean>(false);
const { proxy } = getCurrentInstance() as any;
const router = useRouter();

const { list, getList, pages } = usePage(proxy.$api.seeChart.findFlowChartList);

const onLoad = async () => {
  await getList({ menuId: 0 });
  if (pages.pageNo >= 1) pages.pageNo++;
  loading.value = false;
  if (list.value.length >= pages.total) finished.value = true;
};

function getDetails(id: number) {
  router.push({ name: "seeChartDetails", params: { id }, query: { type: 1 } });
}
</script>

<style scoped lang="scss">
.report {
  height: 100%;
}
</style>
