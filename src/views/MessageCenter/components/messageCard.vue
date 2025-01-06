<template>
  <div class="task-card" @click="$emit('editItem')">
    <div class="icon">
      <van-badge dot v-if="item.status==0">
        <van-image
          width="4rem"
          fit="contain"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
        />
      </van-badge>
      <van-image
      v-else
        width="4rem"
        fit="contain"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      />
    </div>
    <div class="content">
      <div class="head">
        <h4 class="title-ellipsis">{{item.messageTitle}}</h4>
        <p style="color: #999999">{{formatTime(item.updateTime)}}</p>
      </div>
      <van-text-ellipsis style="color: #999999" :row="3" :content="item.messageContent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon/index.vue";
import {formatTime} from '@/utils/common.ts';
defineProps<{
  item: any;
}>();

interface Emit {
  (e: "editItem"): void;
}
const emit = defineEmits<Emit>();

// 查看配置
const goDetails = (item) => {
  modelValue.value = true;
  detailsData.value = item;
  tableId.value = item.tableId;
  detailsRef.value.getComList(item.tableId);
};
</script>

<style lang="scss" scoped>
  .title-ellipsis{
    width: 150px;
    text-overflow: ellipsis;
    text-wrap: nowrap;
    overflow: hidden; 
  }
.task-card {
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  border-bottom: 1px solid #f3f3f3;
  display: flex;
  align-items: center;
  .content {
    width: 100%;
    padding-left: 8px;
    .head {
      display: flex;
      justify-content: space-between;
      padding-bottom: 8px;
      width: 100%;
    }
  }
}
</style>
