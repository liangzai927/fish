<template>
  <!-- 圆形 -->
  <div
    class="flex-center"
    :id="props.id"
    style="width: 100%; height: 100%; border-radius: 50%"
    :style="{
      ...props.styleData,
      fontSize: props.styleData.fontSize + 'px',
    }"
    v-if="props.type === 'Circle'"
  >
    {{ props.text }}
  </div>
  <!-- 矩形 -->
  <div
    class="flex-center"
    :id="props.id"
    style="width: 100%; height: 100%"
    :style="{
      ...props.styleData,
      fontSize: props.styleData.fontSize + 'px',
    }"
    v-if="props.type === 'Rectangle' || props.type === 'Liquid'"
  >
    {{ props.text }}
  </div>
  <!-- 文字输入 -->
  <div
    :id="props.id"
    class="text-canvas flex-center"
    @dblclick.stop="handleDblClick"
    :contenteditable="isEditing"
    :style="{
      ...props.styleData,
      fontSize: props.styleData.fontSize + 'px',
    }"
    v-if="props.type === 'Text'"
  >
    {{ props.text }}
  </div>
  <!-- 线条 -->
  <div
    :id="props.id"
    class="canvas-line flex-center"
    :style="{
      ...props.styleData,
      // backgroundColor: props.styleData.backgroundColor,
    }"
    v-if="props.type === 'Line'"
  ></div>
  <!-- svg图片 -->
  <div
    :id="props.id"
    class="svg-icon"
    v-if="props.type === 'svgIcon'"
    :style="{ backgroundColor: props.styleData.backgroundColor }"
  >
    <span
      :style="{
        ...props.styleData,
        fontSize: props.styleData.fontSize + 'px',
        // backgroundColor: 'transparent',
        background: 'transparent',
      }"
      class="flex-center"
      >{{ props.text }}</span
    >
    <svgIcon :name="props.name" :color="props.styleData.fill" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
interface Props {
  styleData?: any;
  type: string;
  name?: string;
  text: string;
  id: any;
}
const props = withDefaults(defineProps<Props>(), {
  styleData: {},
  type: "rectangle",
  name: "",
  id: "",
});

const isEditing = ref<boolean>(false);

const handleDblClick = () => {
  console.log("handleDblClick");
};

// interface Emit {
//   (e: "dragStart", event: any): void;
// }
// const emit = defineEmits<Emit>();
</script>

<style scoped lang="scss">
.text-canvas {
  color: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: center;
}
.canvas-line {
  width: 100%;
  height: 100%;
  color: #fff;
}

.svg-icon {
  width: 100%;
  height: 100%;
  position: relative;
  span {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 99;
    // top: 50%;
    // height: 50%;
    // transform: translate(-50%, -50%);
  }
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  word-break: break-all;
  word-wrap: break-word;
}
</style>
