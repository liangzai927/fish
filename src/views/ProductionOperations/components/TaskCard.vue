<template>
  <div
    class="task-card"
    @click="$router.push(`/home/production/${item.mfgId}`)"
  >
    <div class="head">
      <div class="title">
        <IconFont iconName="jikegongdan" style="font-size: 24px" />
        <p>
          {{ item.maName }}
        </p>
      </div>
      <p class="data">
        {{ item.statusStr }}
      </p>
    </div>
    <div class="body">
      <div class="dsc">
        <p>
          {{
            $t("productionOperation.taskCard.equName") +
            ":" +
            (item.beginTime && item.equipNames ? item.equipNames : "无")
          }}
        </p>
        <p>
          {{ $t("productionOperation.taskCard.mfgCode") + ":" + item.mfgCode }}
        </p>
        <div>
          <p v-if="item.beginTime !== null && item.endTime !== null">
            {{
              $t("productionOperation.taskCard.planTime") +
              ":" +
              item.beginTime +
              "~" +
              item.endTime
            }}
          </p>
          <p v-else>
            {{
              $t("productionOperation.taskCard.planTime") + ":" + "工单未排产"
            }}
          </p>
        </div>
        <p v-if="item.inStockTime !== null">
          {{ "入库时间:" + item.inStockTime }}
        </p>
        <p v-if="item.duration !== null">
          {{ "生产用时:" + item.duration }}
        </p>
        <p>
          {{
            $t("productionOperation.taskCard.unit") +
            ":" +
            item.extQty +
            item.stu
          }}
        </p>
        <p>
          {{
          
            "生产批次:" +
            item.lot 
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon/index.vue";

defineProps<{
  item: any;
}>();

// 查看配置
const goDetails = (item) => {
  modelValue.value = true;
  detailsData.value = item;
  tableId.value = item.tableId;
  detailsRef.value.getComList(item.tableId);
};
</script>

<style lang="scss" scoped>
.task-card {
  padding: 10px;
  margin: 0 10px 10px;
  background-color: #fff;
  border-radius: 5px;

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 15px;
    border-bottom: 1px solid #f3f3f3;

    .title {
      display: flex;
      align-items: center;

      p {
        padding-left: 5px;
        font-size: initial;
        font-style: bold;
      }
    }

    .data {
      font-size: initial;
      color: #999;
    }
  }

  .body {
    display: flex;
    justify-content: space-between;

    .dsc {
      padding-top: 15px;

      p {
        padding-bottom: 5px;
        color: #999;
      }
    }
  }
}
</style>
