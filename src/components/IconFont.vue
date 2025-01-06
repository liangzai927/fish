// src/components/SvgIcon.vue
<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="prefix + iconClassName" :fill="color" />
  </svg>
</template>
<script setup lang="ts">
import { computed } from "vue";

interface Props {
  iconName: string | null;
  className?: string | null;
  color?: string;
  prefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  iconName: "",
  className: "",
  color: "#409eff",
  prefix: "#icon-",
});

// 图标在 iconfont 中的名字
const iconClassName = computed(() => {
  return `${props.iconName}`;
});
// 给图标添加上类名
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`;
  }
  return "svg-icon";
});
</script>
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
