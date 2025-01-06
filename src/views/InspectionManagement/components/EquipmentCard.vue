<!-- 设备card -->
<template>
  <div class="task-card" @click="$emit('editItem')">
    <div class="head">
      <div class="title">
        <p>
          {{ item.equipName }}
        </p>
      </div>
      <p class="data">
        {{ item.equipCode }}
      </p>
    </div>
    <div class="body">
      <div class="dsc">
        <p class="content">
          {{ $t("enquipmentOperation.colDep") + ":" + item.orgName }}
        </p>
        <div class="footer">
          <span>{{ item.location }}</span>
        </div>
      </div>
      <div class="right">
        <!-- <p style="margin-bottom: 36px; font-size: small; color: #999">
          宽放剩余{{ item.leftTime }}
        </p>
        <div class="tip">
          <span>{{ item.gradeName }}</span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

defineProps<{
  item: any;
}>();

interface Emit {
  (e: "editItem"): void;
}
const emit = defineEmits<Emit>();
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
        padding-top: 8px;
        padding-bottom: 24px;
        font-size: 12px;
        color: #999;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: end;
      .tip {
        span {
          color: #ef1c34;
          background-color: #fde6e9;
          padding: 4px;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
