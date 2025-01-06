<template>
  <div class="see-details">
    <SeeFlowChart
      v-model="showData.flowChartShow"
      :flowChartId="showData.id"
      ref="seeFlowChartRef"
    />
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import SeeFlowChart from "./components/SeeFlowChart.vue";

const route = useRoute();
const seeFlowChartRef: Ref = ref(null);

/**
 * @params {type:string}  1: 流程图
 *
 */
const typeMap = {
  "1": (id: number | string) => {
    return {
      flowChartShow: true,
      statement: false,
      id,
    };
  },
};

const showData = ref<any>({});

onMounted(() => {
  const type: string = route.query.type as string;
  const id = route.params.id;
  showData.value = typeMap[type](Number(id));
  nextTick(() => {
    if (type === "1") seeFlowChartRef.value.getDetailsData();
  });
});
</script>

<style scoped lang="scss">
.see-details {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
