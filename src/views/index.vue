<template>
  <div class="home">
    <van-nav-bar
      class="fixed-nav-bar"
      :title="$t(`${title}`)"
      :left-arrow="isShowReturn"
      @click-left="onClickLeft"
    />
    <div class="content" :style="{ height: contentHeight }">
      <router-view></router-view>
    </div>
    <div class="footer" v-if="isShow">
      <van-tabbar v-model="active" @change="changePage">
        <van-tabbar-item icon="wap-home">鱼塘</van-tabbar-item>
        <!-- <van-tabbar-item icon="todo-list">待办</van-tabbar-item> -->
        <!-- <van-tabbar-item>
          <div class="scan-it">
            <IconFont iconName="saoma" style="font-size: 36px" />
          </div>
        </van-tabbar-item> -->
        <!-- <van-tabbar-item icon="comment">消息</van-tabbar-item> -->
        <van-tabbar-item icon="manager">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script setup lang="ts">


const homeList = ["/home", "/my"];
const route = useRoute();
const router = useRouter();
const active = ref();
const  contentHeight = ref(homeList.includes(route.path)
      ? "calc(100vh - 46px - 50px)"
      : "calc(100vh - 46px)")

// const contentHeight = computed({
//   get() {
//     return homeList.includes(route.path)
//       ? "calc(100vh - 46px - 50px)"
//       : "calc(100vh - 46px)";
//   },
//   set(val: string) {
//     return val;
//   },
// });

const title = computed(() => {
  return router.currentRoute.value.meta.title || "标题1";
});

const isShow = computed(() => {
  return router.currentRoute.value.meta.isShow || false;
});

const isShowReturn = computed(() => {
  if (route.path === "/home") {
    return false;
  }
  return true;
});
// 3. 回退，监听箭头的点击事件按条件进行跳转
const onClickLeft = () => {
  const currentPathLen = history.state?.current.split("/");
  const backPathLen = history.state?.back.split("/");
  if (history.state?.back && backPathLen < currentPathLen) {
    router.go(-1);
  } else {
    router.push("/home");
  }
};


const changePage = () => {
  console.log(active.value)
  switch (active.value) {
    case 0:
      return router.push("/home");
    // case 1:
    //   return router.push("/todo");
    // case 2:
    //   return router.push("/message");
    case 1:
      return router.push("/my");
  }
};

watch(
  () => route.path,
  (val: any) => {
    if (homeList.includes(val))
      contentHeight.value = "calc(100vh - 46px - 50px)";
    else contentHeight.value = "calc(100vh - 46px)";
  }
);

// 设置 active 的方法
const setActive = (path: string) => {
  const newValue = getActiveIndex(path); // 获取目标值
  console.log(newValue)
  if (active.value !== newValue) {
    active.value = newValue; // 仅在值不同的情况下更新
  }
};

// 路径与 active 索引的映射
const getActiveIndex = (path: string) => {
  switch (path) {
    case "/home":
      return 0;
    // case "/todo":
    //   return 1;
    // case "/message":
    //   return 2;
    case "/my":
      return 1;
    default:
      console.warn(`未知路径：${path}`);
      return 0; // 默认值
  }
};

onMounted(async () => {
  setActive(route.path); // 页面刷新时设置 active
  // addEventListener("message", function (event: any) {
  //   const webcocketData = JSON.parse(event.data);
  //   console.log(webcocketData);
  // });
});
</script>

<style scoped lang="scss">
.home {
  width: 100vw;
  height: 100vh;
  position: relative;
  padding-top: 46px;

  .fixed-nav-bar {
    position: fixed;
    width: 100%;
    top: 0;
  }

  .content {
    // height: calc(100vh - 46px - 50px);
    background-color: $default-bgc;
  }

  .footer {
    position: relative;

    .scan-it {
      background-color: #92befd;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      z-index: 99;
      left: calc(50% - 24px);
      top: -24px;
    }
  }
}
</style>
