<template>
  <div class="process-card" @click="checkProcess()">
    <div class="head">
      <div class="head-bar">
        <IconFont :iconName="item.processLog" style="font-size: 24px" />
        <p class="title">
          {{ item.todoName }}
        </p>
      </div>
      <van-button size="small" type="primary" plain> 去处理 </van-button>

      <!-- <p class="data">
        {{ item.createTime }}
      </p> -->
    </div>
    <div class="body">
      <div class="dsc">
        <p>{{ "所属部门:" + item.todoDes }}</p>
      </div>
      <div class="user">
        <div class="avator">
          <van-image
            width="2rem"
            height="2rem"
            fit="contain"
            src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
          />
          <span style="padding-left: 8px">xxx</span>
        </div>
        <span>创建于2023-06-25</span>
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
        display: flex;
        align-items: center;
        margin-left: 4px;

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
    .dsc {
      padding-top: 15px;

      p {
        padding-bottom: 5px;
        color: #999;
      }
    }
    .user {
      .avator {
        display: flex;
        align-items: center;
      }
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
