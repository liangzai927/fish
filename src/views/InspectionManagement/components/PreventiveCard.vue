<!-- 设备台账card -->
<template>
  <div class="task-card" @click="$emit('editItem')">
    <div class="head">
      <div class="title">
        <p>
          {{ item.taskName }}
        </p>
      </div>
      <p class="data">
        {{ item.createTime }}
      </p>
    </div>
    <div class="body">
      <div class="dsc">
        <!-- <p class="content">
          {{ $t("inspectionManagement.colDep") + ":" + item.orgName }}
        </p> -->
        <div class="footer">
          <span>{{ item.gradeName }}</span>
        </div>
      </div>
      <div class="right">
        <p style="margin-bottom: 36px; font-size: small; color: #999">
          宽放剩余{{ item.delayDays }}天
        </p>
        <div class="tip" :style="styleStatus[item.taskStatus]">
          <span>{{ taskStatus[item.taskStatus] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: any;
}>();

interface Emit {
  (e: "editItem"): void;
}
const emit = defineEmits<Emit>();

const taskStatus: any = {
  1: "待维护",
  2: "已提交",
};

const styleStatus: any = {
  1: {
    color: "#ef1c34",
    "background-color": "#fde6e9",
  },
  2: {
    color: "#fff",
    "background-color": "#52c41a",
  },
};

// // 查看配置
// const goDetails = (item) => {
//   modelValue.value = true;
//   detailsData.value = item;
//   tableId.value = item.tableId;
//   detailsRef.value.getComList(item.tableId);
// };
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
    // border-bottom: 1px solid #f3f3f3;

    .title {
      display: flex;
      align-items: center;

      p {
        // padding-left: 5px;
        font-size: initial;
        font-style: bold;
      }
    }

    .data {
      font-size: small;
      color: #999;
    }
  }

  .body {
    display: flex;
    justify-content: space-between;

    .dsc {
      .content {
        padding-bottom: 36px;
        color: #999;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: end;
      .tip {
        span {
          // color: #00ff00;
          // background-color:#52c41a;;
          padding: 4px;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
