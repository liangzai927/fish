<script setup lang="ts">
defineProps<{
  options: {
    label: string;
    value: string | number;
  }[]; // 使用传入数组的方式动态展示需要显示的按钮
  modelValue?: string | number; // 默认选中 可不传也就是不选
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();
const toggleItem = (value: string | number) => {
  // 触发自定义事件把数据给父组件
  emit("update:modelValue", value);
};
</script>

<template>
  <div class="cp-radio-btn">
    <a
      class="item"
      href="javascript:;"
      v-for="item in options"
      :key="item.value"
      :class="{ active: modelValue === item.value }"
      @click="toggleItem(item.value)"
    >
      {{ item.label }}
    </a>
  </div>
</template>

<style lang="scss" scoped>
.cp-radio-btn {
  display: flex;
  flex-wrap: wrap;
  .item {
    height: 32px;
    min-width: 60px;
    line-height: 30px;
    padding: 0 14px;
    text-align: center;
    border: 1px solid #f6f7f9;
    background-color: #f6f7f9;
    margin-right: 10px;
    box-sizing: border-box;
    color: #3c3e42;
    // margin-bottom: 10px;
    border-radius: 16px;
    transition: all 0.3s;
    &.active {
      border-color: #1989fa;
      background-color: #1989fa;
      color: #fff;
    }
  }
}
</style>
