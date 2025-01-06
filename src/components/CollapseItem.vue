<!-- 人员选择器 -->
<template>
  <van-collapse-item
    v-for="childOrg in props.org.childList"
    :key="childOrg.orgId"
    :name="childOrg.orgId"
    :title="childOrg.orgName"
    @click.stop="$emit('getUserByOrg', childOrg)"
  >
    <template v-if="childOrg.childList && childOrg.childList.length">
      <collapse-item
        :org="childOrg"
        :userList="props.userList"
        @getUserByOrg="getUserByOrg"
      />
    </template>
    <template v-else>
      <div
        class="user-avatar"
        v-for="(user, idx) in props.userList[childOrg.orgId]"
        :key="user.userId"
        :style="{
          border:
            idx + 1 == props.userList[childOrg.orgId].length ? 'none' : '',
        }"
      >
        <div class="title-avatar">
          <van-image
            v-if="user.avatar"
            width="51px"
            height="51px"
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
            <!-- <p class="occupation">"职位"</p> -->
          </van-checkbox>
        </div>
      </div>
    </template>
  </van-collapse-item>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store";

const userStore = useUserStore();

interface Prop {
  //  usrChooseId: any;
  org: any;
  userList: any;
}
const props = defineProps<Prop>();
interface Emit {
  (e: "update:modelValue", bool: boolean): void;
  (e: "getUserByOrg", childOrg: any): void;
}

const emit = defineEmits<Emit>();
const { proxy } = getCurrentInstance();
const searchData = ref<string>("");
const pathList = ref<any>([]);
const orgList = ref<any>([]); //部门列表
const userList = ref<any>({}); //人员列表
const expendDep = ref<any>([]);
const curDepartmentId = ref(0);
const usrChooseId = ref(0);

// 获取部门
const getOrgList = async () => {
  let res = await proxy.$api.workFlow.orgListHttp({});
  if (res.code == 200) orgList.value = res.data;
};

// 按部门获取人员
const getUserByOrg = async (org: any) => {
  emit("getUserByOrg", org);
  // console.log(org);
  // if (org.childList) {
  //   // 拼接路径
  //   pathList.value.find((item: any) => item.orgId == org.orgId)
  //     ? pathList.value
  //     : pathList.value.push(org);
  // } else {
  //   let res = await proxy.$api.workFlow.userByOrgHttp({
  //     orgId: org.orgId,
  //     pageSize: 999,
  //     pageNo: 1,
  //   });
  //   if (res.code == 200) {
  //     userList[org.orgId] = res.data.list;
  //   }
  // }
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
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 99;
  .path-content {
    background-color: #fff;
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding: 0 12px;
    margin-bottom: 8px;
  }
}
</style>
