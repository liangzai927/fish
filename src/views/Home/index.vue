<template>
  <!-- <van-sticky offset-top="46px">
    <van-search v-model="searchValue" placeholder="请输入搜索关键词" />
  </van-sticky> -->
  <div class="home">
    <div class="header">
      <div class="search">
        <h3 style="text-align: center; color: #fff">附近鱼塘 & 高分鱼塘</h3>
        <van-search
          v-model="searchValue"
          placeholder="查找鱼塘"
          background="transparent"
          shape="round"
        />
      </div>
    </div>
    <div class="content">
      <div class="title">热门鱼塘</div>
      <div class="bigCard">
        <van-image :width="'100%'" :height="'60%'" :src="img" />
        <div class="introduction">
          <div class="icon-list">
            <div
              class="icon-list-item"
              v-for="item in iconList"
              :key="item.icon"
            >
              <van-icon :name="item.icon" :size="item.size" />
              1
            </div>
          </div>
          <div class="title">小刘鱼塘</div>
          <div class="text">
            这座鱼塘位于宁静的乡村，四周被青山绿水环绕，水质清澈透明。塘中养殖着各种鱼类，水面上时不时泛起涟漪，宛如一幅美丽的自然画卷。这里是休闲垂钓、亲近自然的理想场所。塘边绿树成荫，环境幽静，适合散步或观赏水中的鱼儿自由游动。
          </div>
        </div>
      </div>
      <div class="littleCard">
        <div
          class="littleCard-item"
          v-for="(item, index) in littleCardList"
          :key="index.toString()"
        >
          <div class="img">
            <van-image :width="'100%'" :height="'100%'" :src="img" />
          </div>
          <div style="color: #000">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store";
import img from "../../assets/img/yutang.jpg";

const userStore = useUserStore();
const { proxy } = getCurrentInstance() as any;
const router = useRouter();
const searchValue = ref<string>("");
// const img = require("../../assets/img/yutang.jpg");

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
const iconList = [
  {
    icon: "like-o",
    size: "18",
  },
  {
    icon: "star-o",
    size: "18",
  },
  {
    icon: "share-o",
    size: "18",
  },
];
const littleCardList = [
  { name: "小王鱼塘", url: "" },
  { name: "小王鱼塘", url: "" },
  { name: "小王鱼塘", url: "" },
];

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
  // padding: 8px 16px;
  height: 100%;
  overflow-y: auto;
  background-color: #e9f0ff;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20%;
    background-color: #4c83ff;
    border-radius: 0 0 30px 30px;
    .search {
      width: 90vw;
      :deep(.van-search__content) {
        // background-color: transparent;
        background-color: #8cb5fe;
        height: 50px;
        justify-content: center;
        align-items: center;
        .van-field__control,
        .van-cell__value,
        .van-icon,
        .van-search__field .van-field__left-icon {
          color: #fff;
        }
        input::placeholder {
          color: #fff; /* 将颜色改为灰色 */
        }
      }
    }
  }
  .content {
    height: calc(100% - 20%);
    padding: 0 3vw;
    .title {
      height: 6%;
      // line-height: 6%;
      box-sizing: border-box;
      font-size: 1rem;
      display: flex;
      align-items: center;
    }
    .bigCard {
      height: 65%;
      background-color: #fff;
      border-radius: 0.9375rem;
      overflow: hidden;
      margin-bottom: 4%;
      .introduction {
        height: 40%;
        width: 100%;
        padding: 30px 20px;
        .icon-list {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 10px;
          &-item {
            display: flex;
            align-items: center;
            gap: 2px;
          }
        }
        .title {
          padding: 10px 0;
          font-size: 16px;
          font-weight: 500;
          height: 40px;
        }
        .text {
          font-size: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 3; /* 限制为3行 */
          -webkit-box-orient: vertical; /* 必须设置为 vertical */
          overflow: hidden; /* 隐藏超出的部分 */
          text-overflow: ellipsis; /* 添加省略号 */
          // padding: 10px 0;
        }
      }
    }
    .littleCard {
      // width: 100%;
      height: 25%;
      overflow-x: auto;
      display: flex;
      scroll-snap-type: x mandatory; /* 可选：设置滚动对齐 */
      gap: 15px;
      &-item {
        // width: 300px;
        height: 100%;
        min-width: 200px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        .img {
          width: 100%;
          height: 80%;
          border-radius: 10px;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
