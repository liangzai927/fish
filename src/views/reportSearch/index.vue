<template>
  <div class="report">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item.tempId"
        :title="item.tempName"
        @click="getDetails(item.tempId)"
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

const { list, getList, pages } = usePage(proxy.$api.reportSearch.getUrportList);

const onLoad = async () => {
  await getList();
  if (pages.pageNo >= 1) pages.pageNo++;
  loading.value = false;
  if (list.value.length >= pages.total) finished.value = true;
};

function getDetails(id: number) {
  router.push({ name: "seeReport", params: { id } });
}
</script>

<style scoped lang="scss">
.report {
  height: 100%;
  overflow-y: auto;
}
</style>
