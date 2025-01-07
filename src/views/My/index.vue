<template>
  <div class="my">
    <div class="my-avatar">
      <van-image
        round
        fit="cover"
        width="8rem"
        height="8rem"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
        style="position: relative"
      >
        <van-icon class="change" name="add" style="color: #5a5a5a" />
      </van-image>
      <p class="my-name" style="margin-top: 18px">{{ userInfo?.name }}</p>
    </div>
    <div class="my-menu">
      <van-list :finished="finished">
        <van-cell
          v-for="(item, idx) in myMenuList"
          :key="idx"
          @click="goMypage(item)"
        >
          <template #title>
            <div class="menu-card">
              <div class="left">
                <IconFont
                  :iconName="item.processLog"
                  style="
                    font-size: 20px;
                    margin-right: 4px;
                    margin-top: 4px;
                    padding-top: 4px;
                  "
                />
                <span>{{ item.name }}</span>
              </div>
              <div class="right">
                <van-icon name="arrow" />
              </div>
            </div>
          </template>
        </van-cell>
      </van-list>
    </div>
    <div class="change-user my-menu">
      <van-list :finished="finished">
        <van-cell @click="showTenant = true">
          <template #title>
            <div class="menu-card">
              <div class="left flex-center">
                <!-- <img
                  :src="pathSplice(curTenant.tenantIcon)"
                  style="
                    object-fit: contain;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    margin-right: 12px;
                  "
                /> -->
                <!-- <span>{{ curTenant.tenantName }}</span> -->
                <span>我的鱼塘（黑坑老板显示）</span>
              </div>
              <div class="right">
                <van-icon name="arrow" />
              </div>
            </div>
          </template>
        </van-cell>
      </van-list>
    </div>
    <van-popup v-model:show="showOutPicker" round position="bottom">
      <div class="out-content">
        <p style="padding: 4px">确定退出该账号 @{{ userInfo?.name || '用户1' }} 吗?</p>
        <van-list style="width: 100%">
          <van-cell @click="loginout()">退出登录</van-cell>
          <!-- <van-cell>切换账号</van-cell> -->
          <!-- style="border-top: 12px solid #efefef" -->
          <van-cell @click="showOutPicker = false">取消</van-cell>
        </van-list>
      </div>
    </van-popup>
    <van-popup v-model:show="showTenant" round position="bottom">
      <van-picker
        :columns="tenantList"
        @cancel="showTenant = false"
        @confirm="changeTenant"
        :columns-field-names="{ text: 'tenantName', value: 'tenantId' }"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { useLoginStore } from "@/store";
import { ref } from "vue";
import { showToast } from "vant";
import { useUserStore } from "@/store";

const loginStore = useLoginStore();
const { proxy } = getCurrentInstance() as any;
const router = useRouter();
const userInfo = JSON.parse(localStorage.getItem("h5-user") as string);
const finished = ref<boolean>(false); // 是否完全加载完毕数据
const showOutPicker = ref<boolean>(false); // 是否完全加载完毕数据
const showTenant = ref<boolean>(false); // 显示租户列表
const myMenuList = ref<any[]>([
  {
    name: "账户余额",
    processLog: "a-Group798",
  },
  {
    name: "我的优惠券",
    processLog: "jichu",
  },
  {
    name: "我的收藏",
    processLog: "jihua",
  },
  {
    name: "登出",
    processLog: "gongyinglian",
  },
  {
    name: "成为老板",
    processLog: "gongyinglian",
  },
]);
const userStore = useUserStore();
const curTenant = ref<any>(userStore.tenantData);

// 获取用户权限列表
const loginout = async () => {
  const res = await proxy.$api.login.loginOutHttp();
  console.log(res);
  if (res.code == 200) {
    console.log("tuichu");
    loginStore.logout();
    router.push("/login");
  }
};

const goMypage = (item: any) => {
  if (item.name == "登出") {
    showOutPicker.value = true;
  }
};
// 修改租户信息
const changeTenant = async ({ selectedOptions }: any) => {
  console.log("changeTenant", selectedOptions);
  if (selectedOptions[0].tenantId !== curTenant.value.tenantId) {
    try {
      // 等待 bindTenantUser 完成所有异步逻辑
      await bindTenantUser(selectedOptions[0].tenantId);
      // 更新 UI 状态
      showTenant.value = false;
      showToast("切换成功！");
      // 所有逻辑执行完毕后刷新页面
      window.location.reload();
    } catch (error) {
      // 捕获并处理错误
      console.error("切换租户失败：", error);
      showToast("切换租户失败，请重试！");
    }
  } else {
    showToast("已经处于当前租户！");
  }
};

onMounted(() => {});
</script>

<style scoped lang="scss">
$width03: calc((100vw - 32px) / 3);
.flex-center {
  display: flex;
  justify-content: center;
}
.my {
  // color: ;
  padding: 8px 16px;
  background-color: #fff;
  height: 100%;
  &-avatar {
    position: relative;
    display: flex;
    height: 45%;
    justify-content: end;
    align-items: center;
    flex-direction: column;
    border-bottom: 1px solid #efefef;
    padding-bottom: 4rem;
    :deep(.van-image--round) {
      overflow: visible;
    }
    .change {
      position: absolute;
      font-size: 2rem;
      bottom: 0;
      right: 0;
      z-index: 99;
    }
  }
  &-menu {
    .menu-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    :deep(.van-cell:after) {
      border: 0;
    }
  }
  .change-user {
    margin-top: 24px;
  }
  .out-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    :deep(.van-cell__value) {
      text-align: center;
    }
  }
}
</style>
