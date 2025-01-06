<template>
  <div class="confirmInspection">
    <HeadeBar
      title="确认隐患"
      :leftArrow="true"
      @onClickLeft="emit('update:modelValue', false)"
    ></HeadeBar>
    <div class="details">
      <div class="details-info">
        <p class="details-info-title">{{ props.taskContent?.taskName }}</p>
        <div class="details-info-content">
          <p>
            {{
              $t("inspectionManagement.subDep") +
              ":" +
              props.taskContent?.orgName
            }}
          </p>
          <p>
            {{
              $t("inspectionManagement.subArea") +
              ":" +
              props.taskContent?.areaName
            }}
          </p>
          <p>
            {{
              $t("inspectionManagement.subGrade") +
              ":" +
              props.taskContent?.gradeName
            }}
          </p>
        </div>
      </div>

      <div class="details-basic">
        <div
          class="inspection"
          v-for="(item, idx) in props.confirmList"
          :key="idx"
        >
          <div class="inspection-title">
            <van-icon name="map-marked" color="#ee0a24" size="1.5rem" />

            <h3>{{ item.pointName }}</h3>
          </div>
          <van-list style="background-color: #fff">
            <van-cell v-for="(widget, idx) in item.itemList" :key="idx">
              <template #title>
                <div
                  class="inspection-widget"
                  @click="widget.itemChecked = !widget.itemChecked"
                >
                  <!-- <p>{{ widget.checked }}</p> -->
                  <van-icon
                    v-if="widget.itemChecked"
                    name="checked"
                    color="#ee0a24"
                    size="1.5rem"
                  />
                  <van-icon v-else color="#ee0a24" size="1.5rem" name="add-o" />

                  <div class="widget-photo"></div>
                  <div class="widget-content">
                    <span>{{ widget.checkStandard }}</span>
                    <p v-if="widget.checkType == 1">
                      {{ widget.checkResult == 1 ? "是" : "否" }}
                    </p>
                    <p v-else>{{ widget.checkResult }}</p>
                  </div>
                </div>
              </template>
            </van-cell>
          </van-list>
        </div>
      </div>
    </div>
    <div class="details-button">
      <span>合计:</span>
      <span
        style="
          color: #ee0a30;
          font-weight: 800;
          font-size: larger;
          margin: 0 8px;
        "
        >{{ curSubTotal }}</span
      >
      <span>项</span>
      <van-button
        class="m18"
        round
        type="primary"
        native-type="submit"
        @click="passOperation()"
      >
        提交隐患
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { showToast } from "vant";
import { onMounted, reactive, ref, computed } from "vue";
import { useRoute } from "vue-router";

const { proxy } = getCurrentInstance() as any;
const route = useRoute();
const router = useRouter();

interface Prop {
  taskContent: any;
  confirmList: any;
}
const props = defineProps<Prop>();
interface Emit {
  (e: "update:modelValue", bool: boolean): void;
  (e: "getData"): void;
  (e: "inspectionsSubmits"): void;
}
const emit = defineEmits<Emit>();
const show = reactive({
  dialogShow: false,
  showUserPicker: false,
  showDePicker: false,
  showPopover: false,
  showDataPicker: false,
});

const curSubTotal = computed(() => {
  return props.confirmList.reduce((total: number, obj: any) => {
    const count = obj.itemList?.filter((item: any) => item.itemChecked == true)
      .length;
    return total + count;
  }, 0);
});

// 点击提交隐患
const passOperation = async () => {
  let arr = props.confirmList.reduce((result: any[], point: any) => {
    point.itemList.forEach((item: any) => {
      if (item.itemChecked) {
        result.push(item.itemId);
      }
    });
    return result;
  }, []);
  const res = await proxy.$api.inspectionManagement.inspectHidDangerSub(arr);
  if (res.code == 200) {
    router.push("/home/inspection");
  }
};

// onMounted(() => {
//   getinspectHidDangerList();
// });
</script>

<style scoped lang="scss">
.confirmInspection {
  background-color: $default-bgc;
  height: 100%;
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 99;
  .details {
    background-color: $default-bgc;
    margin: 8px;
    border-radius: 8px;
    overflow: auto;
    height: calc(100% - 30px);
    &-info {
      background-color: #fff;
      padding: 12px;
      margin-bottom: 8px;
      &-title {
        font-size: large;
        margin-bottom: 8px;
      }
      &-content {
        p {
          color: #a1a9bc;
        }
      }
    }
    &-basic {
      .inspection {
        background-color: #fff;
        margin-bottom: 8px;
        padding: 8px 8px;
        &-title {
          display: flex;
        }
        &-widget {
          margin: 0px -16px;
          display: flex;
          justify-content: start;
          align-items: center;
          .widget-photo {
            margin: 0 8px;
            height: 100%;
            width: 20px;
          }
          .widget-content {
            span {
              font-size: 15px;
            }
            p {
              color: #a1a9bc;
            }
          }
        }
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
        margin: 0 8px;
        width: 7rem;
      }
    }
  }
}

:root:root {
  --van-dropdown-menu-shadow: 0;
}
</style>
