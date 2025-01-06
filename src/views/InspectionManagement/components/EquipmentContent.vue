<template>
  <div class="detailsProcess">
    <HeadeBar
      title="详情"
      :leftArrow="true"
      @onClickLeft="emit('update:modelValue', false)"
    ></HeadeBar>
    <div class="details">
      <div class="details-basic">
        <div class="task-info">
          <h3>{{ props.item.equipName }}</h3>
          <p>{{}}</p>
        </div>
      </div>
      <div class="details-basic">
        <div class="task-info">
          <div>
            <p
              class="task-info-title"
              style="margin-bottom: 24px; font-weight: bold"
            >
              设备基础信息
            </p>
            <p class="task-info-title">设备名称</p>
            <p class="task-info-content" style="margin-bottom: 24px">
              {{ props.item.equipName }}
            </p>
            <p class="task-info-title">设备编码</p>
            <p class="task-info-content">{{ props.item.equipCode }}</p>
          </div>
        </div>
      </div>
      <div class="details-basic">
        <div class="task-info">
          <p class="task-info-title" style="font-weight: bold">设备档案</p>
          <div
            style="margin-top: 8px"
            v-for="item in detailList"
            :key="item.id"
          >
            <div class="ruleItem">
              <span>&nbsp;&nbsp;{{ item.name }}</span>
              <p style="cursor: pointer" @click="showComponents(item, true)">
                {{ item.num }}<van-icon name="arrow" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- v-model="detailList[item.]" -->
    <component
      v-if="currentCom.show"
      v-model="currentCom.show"
      :is="currentCom.component"
      :equipId="props.item?.equipId"
    />
  </div>
</template>

<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { showFailToast, showToast } from "vant";
import DefendTask from "./DefendTask.vue";

const route = useRoute();
const router = useRouter();
const details = ref<any>(null);
const { proxy } = getCurrentInstance();

interface Props {
  item: any;
}

const props = withDefaults(defineProps<Props>(), {
  item: null,
});

interface Emit {
  (e: "update:modelValue", bool: boolean): void;
  (e: "getData"): void;
}
const emit = defineEmits<Emit>();

const detailList = ref([
  {
    id: 1,
    name: "备品备件",
    show: false,
    component: null,
    num: "5项",
  },
  {
    id: 2,
    name: "维保记录",
    show: false,
    component: DefendTask,
    num: "13次",
  },
  {
    id: 3,
    name: "故障记录",
    show: false,
    component: null,
    num: "25次",
  },
  {
    id: 4,
    name: "设备文档",
    show: false,
    component: null,
    num: "3份",
  },
  {
    id: 5,
    name: "运行记录",
    show: false,
    component: null,
    num: "3份",
  },
]);

const currentTab = ref(2);
const currentCom = ref<any>({});

const showComponents = (item: any, isShow: boolean) => {
  currentCom.value = detailList.value.find((com: any) => com.id === item.id);
  if (currentCom.value) {
    currentCom.value.show = isShow;
    currentTab.value = item.id;
  }
};

// const getDetailData = async (id) => {
//   const res = await proxy.$api.inspectionManagement.getDefendTask({ id });
//   console.log(res);
//   if (res?.code === 200) {
//     detailsData.value = res.data;
//     detailsData.plan.planRule.map((item: any) => ({
//       ...item,
//       itemChecked: false,
//     }));
//   }
// };

onMounted(() => {
  //   if (props.item) {
  //     for (let k in commentForm) {
  //       commentForm[k] = props.item[k];
  //     }
  //   }
});

// defineExpose({ getDetailData });
</script>

<style scoped lang="scss">
.detailsProcess {
  background-color: $default-bgc;
  height: 100%;
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 99;

  .details {
    // background-color: #fff;
    overflow: auto;
    height: calc(100% - 30px);
    margin-top: 43px;

    .details-button {
      padding: 8px;
      background-color: #fff;
      position: fixed;
      bottom: 0px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-head {
      padding: 8px;
    }

    &-basic {
      background-color: $default-bgc;

      .task-info {
        padding: 8px 12px;
        background-color: #fff;
        margin-bottom: 8px;

        &-title {
          color: #000;
        }
        &-content {
          color: #a1a9bc;
          font-size: 12px;
        }
      }

      .title {
        padding: 8px 18px;
        display: block;
      }

      p {
        margin: 8px;
        color: #a1a9bc;
      }

      .content {
        background-color: #fff;
        width: 100%;
      }
    }

    &-process {
      background-color: $default-bgc;
      padding-top: 24px;

      p {
        margin: 8px;
        color: #a1a9bc;
      }

      .process-flow {
        p {
          background-color: #d7d7d7;
          color: black;
          padding: 4px;
          border-radius: 4px;
        }
      }
    }

    &-button {
      padding: 8px;
      background-color: #fff;
      position: fixed;
      bottom: 0px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .icon {
        display: flex;
        flex-direction: column;
      }

      .m18 {
        width: 7rem;
      }
    }
  }
  .ruleItem {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 24px 8px 0;
    border-bottom: 1px solid #eceef1;
  }
  .ruleItem:last-child {
    border-bottom: null;
  }
}

:root:root {
  --van-dropdown-menu-shadow: 0;
}
</style>
