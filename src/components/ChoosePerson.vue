<!-- 人员选择器 -->
<template>
  <div class="choose-person">
    <HeadeBar
      title="人员选择"
      :leftArrow="true"
      @onClickLeft="emit('update:modelValue', false)"
    ></HeadeBar>
    <van-sticky offset-top="46" style="display: block">
      <div class="choose-person-search">
        <!-- <van-search v-model="searchData" shape="round" placeholder="搜索" /> -->
        <div class="path-content">
          <span @click="jumpDep(0, null)" style="color: #b5b6b7">{{
            userStore.tenantData?.tenantName
          }}</span>
          <!-- <span
            v-for="(dep, idx) in pathList"
            :style="{
              color: curDepartmentId == dep.orgId ? '' : '#b5b6b7',
            }"
            :key="idx"
            @click="jumpDep(idx, dep)"
            >{{ dep.orgName }}/</span
          > -->
        </div>
      </div>
    </van-sticky>
    <div class="choose-person-content">
      <van-collapse v-model="expendDep">
        <van-collapse-item
          v-for="org in orgList"
          :key="org.orgId"
          :name="org.orgId"
          :title="org.orgName"
          @click.stop="getUserByOrg(org)"
        >
          <template v-if="org.childList && org.childList.length">
            <!-- 递归渲染子部门 -->
            <collapse-item
              :org="org"
              :userList="userList"
              @getUserByOrg="getUserByOrg"
            />
          </template>
          <template v-else>
            <!-- 展示部门人员 -->
            <div
              class="user-avatar"
              v-for="(user, idx) in userList[org.orgId]"
              :key="user.userId"
              :style="{
                border: idx + 1 == userList[org.orgId].length ? 'none' : '',
              }"
            >
              <div class="title-avatar">
                <van-image
                  class="img"
                  v-if="user.avatar"
                  fit="cover"
                  position="center"
                  src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                />
                <div class="red-avatar img" v-else>
                  {{ user.userName }}
                </div>
              </div>
              <div class="user-content">
                <van-checkbox
                  style="width: 100%; justify-content: space-between"
                  v-model="user.checked"
                  shape="square"
                  label-position="left"
                >
                  <p class="name">{{ user.userName }}</p>
                </van-checkbox>
              </div>
            </div>
          </template>
        </van-collapse-item>
      </van-collapse>
      <div class="button-group">
        <van-button
          round
          block
          @click="emit('update:modelValue', false)"
          size="normal"
          style="width: 45%"
        >
          取消
        </van-button>
        <van-button
          type="primary"
          round
          block
          @click="saveChoose"
          size="normal"
          style="width: 45%"
        >
          {{ "确定(" + chechedUser.length + ")" }}
        </van-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from "@/store";
import CollapseItem from "./CollapseItem.vue";

const userStore = useUserStore();

interface Prop {
  usrChooseId: any;
}
const props = defineProps<Prop>();
interface Emit {
  (e: "update:modelValue", bool: boolean): void;
  (e: "getIds", arr: any): void;
}

const emit = defineEmits<Emit>();
const { proxy } = getCurrentInstance();
const searchData = ref<string>("");
const pathList = ref<any>([]);
const orgList = ref<any>([]); //部门列表
const userList = ref<any>({}); //人员列表
const expendDep = ref<any>([]);
const curDepartmentId = ref(0);
const chechedUser = ref<any>([]);

// 获取部门
const getOrgList = async () => {
  let res = await proxy.$api.workFlow.orgListHttp();
  if (res?.code == 200) orgList.value = res.data;
  console.log(orgList.value);
};

// 按部门获取人员
const getUserByOrg = async (org: any) => {
  console.log("getUserByOrg", org);
  // pathList.value.find((item: any) => item.orgId == org.orgId)
  //   ? pathList.value
  //   : pathList.value.push(org);
  if (org.childList) {
    // 拼接路径
  } else {
    let res = await proxy.$api.workFlow.userByOrgHttp({
      orgId: org.orgId,
      pageSize: 999,
      pageNo: 1,
    });
    if (res.code == 200) {
      userList.value[org.orgId]
        ? userList.value[org.orgId]
        : (userList.value[org.orgId] = res.data.list.map((item: any) => ({
            userId: item.userId,
            userName: item.userName,
            checked: props.usrChooseId?.includes(item.userId) ? true : false,
          })));
    }
  }
};

// 点击主页路径,跳转文件夹
const jumpDep = (idx: number, dep: any) => {
  if (idx === 0) {
    expendDep.value = [];
    curDepartmentId.value = 0;
    pathList.value = [];
  } else {
    console.log(pathList.value, idx, dep);
    expendDep.value = [pathList.value[idx - 1].orgId];
    pathList.value.splice(idx);
    curDepartmentId.value = pathList.value[idx].orgId;
  }
};

// 返回并保存选择
const saveChoose = () => {
  emit("getIds", chechedUser.value);
  emit("update:modelValue", false);
};

watch(
  () => userList.value,
  (val: any) => {
    chechedUser.value = Object.values(val)
      .flat()
      .filter((user: any) => user.checked)
      .map((user: any) => user.userId);
  },
  { deep: true }
);

onMounted(() => {
  getOrgList();
});
</script>
<style scoped lang="scss">
.user-avatar {
  display: flex;
  border-bottom: 1px solid #ebedf0;
  height: 64px;
  margin: 12px 0;
  padding-bottom: 12px;
  .title-avatar {
    width: 64px;
    .img {
      width: 51px;
      height: 51px;
    }
    .red-avatar {
      line-height: 51px;
      text-align: center;
      color: #fff;
      background-color: #da3231;
      border-radius: 8px;
    }
  }
  .user-content {
    width: calc(100% - 51px);
    height: 100%;
    .name {
      height: 60%;
      line-height: 31px;
      color: #000;
      font-size: 16px;
    }
  }
}
:deep(.van-collapse-item__content) {
  padding: 0 16px;
  margin-top: -1px;
}
.choose-person {
  background-color: $default-bgc;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding-top: 46px;
  z-index: 99;
  overflow-y: auto;
  .path-content {
    background-color: #fff;
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding: 0 12px;
    margin-bottom: 8px;
  }
  &-content {
    background-color: #fff;
  }
  .button-group {
    position: fixed;
    width: 100%;
    padding: 12px;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
  }
}
</style>
