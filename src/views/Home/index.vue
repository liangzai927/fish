<template>
  <van-sticky offset-top="46px">
    <van-search v-model="searchValue" placeholder="请输入搜索关键词" />
  </van-sticky>
  <div class="home">
    <div v-for="(item, index) in contentList" :key="index">
      <p style="margin-bottom: 8px">
        {{ item.pageName }}
      </p>
      <div class="home-content">
        <div
          v-for="obj in item.childMenus"
          :key="obj.pageId"
          class="item"
          @click="goPage(obj.pageUrl)"
        >
          <IconFont :iconName="obj.pageIcon" style="font-size: 40px" />
          <!-- <SvgIcon :name="obj.img" width="40px" height="40px" /> -->
          <p>{{ $t(`${obj.pageName}`) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store";

const userStore = useUserStore();
const { proxy } = getCurrentInstance() as any;
const router = useRouter();
const searchValue = ref<string>("");

const contentList = ref<any[]>([
  {
    title: "智能生产",
    list: [
      {
        id: 1,
        title: "报表查询",
        img: "qf_logo",
        url: "/",
      },
      {
        id: 2,
        title: "流程图查询",
        img: "qf_logo",
      },
      {
        id: 3,
        title: "排产跟踪",
        img: "vue",
      },
      {
        id: 4,
        title: "生产操作",
        img: "vue",
        url: "/home/production",
      },
      {
        id: 5,
        title: "巡检排查管理",
        img: "vue",
        url: "/home/inspection",
      },
      {
        id: 6,
        title: "排查整改",
        img: "vue",
        url: "/home/inspection/rectification",
      },
    ],
  },
  {
    title: "通用",
    list: [
      {
        id: 1,
        title: "审批中心",
        img: "qf_logo",
        url: "/home/approval",
      },
    ],
  },
]);
const userInfo = JSON.parse(localStorage.getItem("h5-user") as string);

// 获取用户权限列表
const getPageList = async () => {
  const res = await proxy.$api.login.getPageList({
    type: 3,
    userId: userInfo.id,
  });
  if (res.code == 200) {
    contentList.value = res.data;
  }
};

// 获取公钥
const getRearKey = async () => {
  if (!localStorage.getItem("publicKey")) {
    let res = await proxy.$api.common.getPublicKey();
    if (res.code == 200) {
      localStorage.setItem("publicKey", res.data);
    }
  }
};

const goPage = (url: string) => {
  router.push(url);
};

onMounted(() => {
  // getPageList();
  // getRearKey();
});
</script>

<style scoped lang="scss">
$width03: calc((100vw - 32px) / 3);

.home {
  padding: 8px 16px;
  height: calc(100vh - 120px);
  overflow-y: auto;

  &-content {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    background-color: #fff;
    border-radius: 6px;

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      width: $width03;
      height: calc($width03 * 0.7);
      margin: 8px 0;
      border-right: 1px solid #eee;

      &:nth-of-type(3n) {
        border: none;
      }
    }
  }
}
</style>
