<template>
  <div class="flowChart">
    <div class="flowChart-content">
      <!-- <van-overlay
        :show="spinning"
        style="display: flex; align-items: center; justify-content: center"
      >
        <van-loading size="24px" vertical>{{
          $t("baseLosding.loadingData")
        }}</van-loading>
      </van-overlay> -->
      <!-- <a-spin :spinning="spinning" :tip="$t('baseLosding.loadingData')">
      </a-spin> -->
      <div class="box">
        <div class="mask" v-if="spinning" @click.stop>
          <van-loading size="24px" vertical>{{
            $t("baseLosding.loadingData")
          }}</van-loading>
        </div>
        <div class="box-right es-grid-box">
          <div
            class="box-right-content"
            ref="dragBoxRef"
            @mousedown="startDrag"
          >
            <div
              ref="canvasRef"
              class="canvas-content"
              :style="{
                transform: `scale(${scaleRatio}) translate(${translateX}px, ${translateY}px)`,
                'transform-origin': '0 0 ',
              }"
              @wheel.stop="handleWheel"
            >
              <Drager
                v-for="item in dropList.elements"
                :selected="item.selected"
                :key="item.id"
                :width="item.width"
                :height="item.height"
                :left="item.left"
                :top="item.top"
                :angle="item.angle"
                :scaleRatio="scaleRatio"
                style="border: none"
                :resizeList="resizeList[item.type] || resizeList.default"
                :resizable="false"
                :id="item.id"
                disabled
                boundary
                class="dragBox"
              >
                <component
                  v-if="item.group"
                  :id="item.id"
                  :is="dropMap[item.component]"
                  :name="item.name"
                  :styleData="item.style"
                  :type="item.type"
                  :text="item.text"
                  :elements="item.props.elements"
                />
                <component
                  v-else
                  :id="item.id"
                  :is="dropMap[item.component]"
                  :name="item.name"
                  :styleData="item.style"
                  :type="item.type"
                  :text="item.text"
                />
              </Drager>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Shape from "./Shape.vue";
import Drager from "es-drager";
import Group from "@/components/Group.vue";
import {
  type Ref,
  ref,
  onMounted,
  watch,
  nextTick,
  onBeforeUnmount,
} from "vue";
import calculateAndApplyScale, { getScale } from "../utils";

const { proxy } = getCurrentInstance() as any;

interface Props {
  modelValue: boolean;
  flowChartId: string | number;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  flowChartId: 0,
});

interface Emit {
  (e: "update:modelValue", bool: boolean): void;
}
const emit = defineEmits<Emit>();

const dropList = ref<any>({
  elements: [],
});
const dragBoxRef: Ref = ref(null);
const canvasRef: Ref = ref(null);
const webSocket = ref<any>(null);

// 画板属性
const scaleRatio = ref<number>(1); // 缩放值
const translateX = ref<number>(0);
const translateY = ref<number>(0);
const startDragX = ref<number>(0);
const startDragY = ref<number>(0);
const dragging = ref<boolean>(false);
const canvasMove = ref<boolean>(false); // 控制canvas内的div移动 防止与画布同时滚动

// 属性抽屉
const optionShow = ref<boolean>(false);
const spinning = ref<boolean>(false);

// 最右下角的div位置
const mostBottomRightCorner = ref<{ left: number; top: number }>({
  left: 0,
  top: 0,
});

const dropMap = {
  Shape,
  "es-group": Group,
};

const resizeList = {
  Line: ["left", "right"],
  default: [
    "left",
    "right",
    "top",
    "bottom",
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
  ],
};

const getDetailsData = async () => {
  spinning.value = true;
  dropList.value.elements = [];
  const res = await proxy.$api.seeChart.findFlowChartInfo({
    id: props.flowChartId,
  });

  if (res?.code === 200) {
    scaleRatio.value = 1;
    dropList.value.elements = JSON.parse(res.data.flowChartData);
    nextTick(() => {
      const { left, top, scale } = calculateAndApplyScale(
        canvasRef,
        dragBoxRef
      );
      mostBottomRightCorner.value = { left, top };
      scaleRatio.value = scale - 0.01;

      // 监听窗口大小变化以调整缩放比例
      window.addEventListener("resize", changeScale);
    });
    initWebScoket();
    webSocket.value.addEventListener("message", function (event) {
      const getData = JSON.parse(event.data);
      if (getData.type == "flowchart") websocketonmessage(getData);
    });
    getWebScoketDatabase();
  }
};

// 鼠标滚轮事件
function handleWheel(e) {
  // e.wheelDelta > 0 向上 < 0 向下
  // if (e.wheelDelta > 0) {
  //   if (scaleRatio.value < 2.5) scaleRatio.value += 0.1;
  // } else {
  //   if (scaleRatio.value > 0.4) scaleRatio.value -= 0.1;
  // }
}

// 画布 mousedown 事件
function startDrag(event) {
  if (event.button === 0 && !canvasMove.value) {
    dragging.value = true;
    startDragX.value = event.clientX - translateX.value;
    startDragY.value = event.clientY - translateY.value;
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", stopDrag);
  }
}

// 小手拖拽
function handleDrag(event) {
  if (dragging.value) {
    translateX.value = event.clientX - startDragX.value;
    translateY.value = event.clientY - startDragY.value;
  }
}

// 小手拖拽结束
function stopDrag() {
  optionShow.value = false;
  dropList.value.elements.forEach((item: any) => (item.selected = false));
  dragging.value = false;
  window.removeEventListener("mousemove", handleDrag);
  window.removeEventListener("mouseup", stopDrag);
}

function initWebScoket() {
  let httpStr: string = "";
  if (import.meta.env.VITE_ENV === "production")
    httpStr = window.location.origin;
  else httpStr = import.meta.env.VITE_APP_BASE_URL;
  webSocket.value = new WebSocket(
    `ws://${httpStr.split("//")[1]}/api/websocket1/${localStorage.getItem(
      "h5-token"
    )}`
  );
}

// 数据接收
function websocketonmessage(e: any) {
  // 接收数据 改变页面
  const getData = JSON.parse(JSON.stringify(e.data));
  getData.map((item) => {
    const findElement = dropList.value.elements.find(
      (obj) =>
        obj.id === item.id &&
        obj.type !== "Line" &&
        obj.customAttribute.bitName === item.bitCode
    );

    if (findElement) {
      if (item.bitType === "1") {
        findElement.text = Number(item.value)
          .toFixed(item?.numberBit || 2)
          .toString();
      } else if (item.bitType == "2") {
        if (findElement.type === "svgIcon")
          item.value == 1
            ? (findElement.style.fill = item.startColor)
            : (findElement.style.fill = item.closeColor);
        else
          item.value == 1
            ? (findElement.style.backgroundColor = item.startColor)
            : (findElement.style.backgroundColor = item.closeColor);
        // dropList.value.elements[index].customAttribute
        // 液位类型的点位 用background: linear-gradient(to top, #ff0000 50%, transparent 50%);解决
      } else if (item.bitType == "3") {
        const percent: string = item.maxNumber
          ? (Number(item.value) / Number(item.maxNumber)).toFixed(4)
          : "1";
        findElement.style.background = `linear-gradient(to top, ${
          item.backgroundColor
        } ${Number(percent) * 100}%, transparent 0%)`;
      }
    }
  });
  spinning.value = false;
}

//  获取 webScoket
function getWebScoketDatabase() {
  if (webSocket.value.readyState === 1) {
    sendMessage();
  } else if (webSocket.value.readyState === 0) {
    setTimeout(() => {
      sendMessage();
    }, 300);
  }
}

function sendMessage() {
  webSocket.value.send(
    JSON.stringify({
      type: "flowchart",
      operation: "open", // open开启 close关闭
      data: props.flowChartId,
    })
  );
}

function changeScale() {
  // if (left > width) canvasRef.value.style.width = `${(left + 30) * 2}px`;
  // if (top > height) canvasRef.value.style.height = `${(top + 30) * 2}px`;
  const parentRect = dragBoxRef.value.getBoundingClientRect();

  scaleRatio.value = getScale(parentRect, mostBottomRightCorner.value) - 0.01;
}

// 监听id变化 清除旧id的数据请求
watch(
  () => props.flowChartId,
  (_val, oldVal) => {
    if (Number(oldVal) > 0) {
      webSocket.value.send(
        JSON.stringify({
          type: "flowchart",
          operation: "close", // open开启 close关闭
          data: oldVal,
        })
      );
    }
  }
);

// 移除事件监听器以防止内存泄漏
onBeforeUnmount(() => {
  if (webSocket.value) {
    webSocket.value.send(
      JSON.stringify({
        type: "flowchart",
        operation: "close", // open开启 close关闭
        data: props.flowChartId,
      })
    );
  }
  window.removeEventListener("resize", changeScale);
});

defineExpose({
  getDetailsData,
});
</script>

<style scoped lang="scss">
.flowChart {
  width: 100%;
  height: 100%;
  position: relative;
  // top: 0;
  // left: 0;
  // z-index: 999;
  background-color: #f0f2f5;
  user-select: none;
  :deep(.ant-spin-nested-loading) {
    height: 100%;
    overflow-y: auto;
    .ant-spin {
      max-height: 100%;
      background-color: rgba(255, 255, 255, 0.05);
    }
    .ant-spin-container {
      height: 100%;
    }
  }
  &-content {
    width: 100%;
    // height: calc(100% - 65.72px);
    height: 100%;
    // padding: 20px;
    background-color: rgb(24, 24, 28);

    .box {
      background-color: rgb(24, 24, 28);
      width: 100%;
      height: 100%;
      position: relative;
      .mask {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        background-color: rgba(0, 0, 0, 0.7);
      }
      &-right {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        &-content {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          cursor: grab;
          &:active {
            cursor: grabbing;
          }
          .canvas-content {
            flex: 1;
            width: 300%;
            height: 300%;
            background-color: rgb(24, 24, 28);
            position: relative;

            .dragBox {
              cursor: move;
              width: 50px;
              height: 50px;
              position: absolute;
            }
          }
        }
      }
    }
  }
  :deep() {
    .disabled {
      opacity: 1;
    }
  }
}
</style>
