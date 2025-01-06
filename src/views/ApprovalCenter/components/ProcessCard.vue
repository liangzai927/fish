<template>
  <div class="process-card" @click="checkProcess()">
    <div class="head">
      <div class="head-bar">
        <IconFont :iconName="item.processLog" style="font-size: 24px" />
        <p class="title">
          {{ item.procDefName }}
        </p>
        <!-- <van-text-ellipsis :content="item.procDefName" /> -->
      </div>

      <p class="data">
        {{ item.createTime }}
      </p>
    </div>
    <div class="body">
      <div class="dsc">
        <p>{{ "所属部门:" + item.startDeptName }}</p>
        <p>应用:{{ item.category == "1" ? "全部" : "其他" }}</p>
      </div>
      <div class="time">
        <p>{{ item.time }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const props = defineProps<{
  item: any;
  active: number;
}>();

const checkProcess = () => {
  router.push({
    path: "/home/approval/processDetail",
    query: {
      procInsId: props.item.procInsId,
      taskId: props.item.taskId,
      power: props.active + 1,
    },
  });
};
</script>

<style lang="scss" scoped>
.process-card {
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
    .head-bar {
      display: flex;
      .title {
        width: 50%; /* 确保宽度有限制 */
        display: flex;
        align-items: center;
        margin-left: 4px;
        white-space: nowrap;
        // overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0; /* 关键点 */

        p {
          padding-left: 5px;
          font-size: initial;
          font-style: bold;
        }
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
      padding-top: 15px;

      p {
        padding-bottom: 5px;
        color: #999;
      }
    }
  }
}
</style>
