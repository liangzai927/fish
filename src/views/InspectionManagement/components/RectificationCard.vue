<!-- 排查整改的card -->
<template>
  <div class="task-card" @click="$emit('editItem')">
    <div class="left">
      <div class="title">
        <!-- <SvgIcon :name="item.dangerImage" :wsize="24" :hsize="24" /> -->
        <van-image
          fit="cover"
          width="100%"
          height="100%"
          :src="item.dangerImage"
        >
          <template #error>未拍照</template>
          <template v-slot:loading>未拍照</template>
        </van-image>
      </div>
    </div>
    <div class="right">
      <p class="nav">
        {{ item.dangerProblem }}
      </p>
      <p class="area">发现区域：{{ item.dangerRegionName }}</p>
      <div class="tab">
        <span>{{ item.reformStatus == 1 ? "待确认" : "已完成" }}</span>
        <span>{{ item.type ? item.type : "一般隐患" }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon/index.vue";

defineProps<{
  item: any;
}>();

interface Emits {
  (event: "editItem"): void;
}
const emit = defineEmits<Emits>();
</script>

<style lang="scss" scoped>
.task-card {
  display: flex;
  padding: 10px;
  margin: 0 10px 10px;
  background-color: #fff;
  border-radius: 5px;
  max-height: 8rem;
  .left {
    margin-right: 8px;
    flex: 1;
    display: flex;
    align-items: center;
    .title {
      background-color: #dfdfdf;
      height: 6rem;
      border-radius: 18%;
      aspect-ratio: 1 / 1;
      overflow: hidden;
    }
  }
  .right {
    width: 80%;
    .nav {
      width: 100%;
      font-size: initial;
      font-style: bold;
      text-overflow: ellipsis;
    }
    .area {
      font-size: 14px;
      color: #9a9b9b;
      margin-top: 18px;
    }
    .tab {
      margin: 5px 0;
      span {
        color: red;
        background-color: #fde6e9;
        font-size: small;
        padding: 2px 4px;
        border-radius: 5px;
        margin-right: 4px;
      }
    }
    .standard {
      color: #9a9b9b;
      font-size: small;
    }
  }
}
</style>
