<template>
  <div class="navbar">
    <van-nav-bar
      :title="props.title"
      :left-arrow="props.leftArrow"
      @click-left="emit('onClickLeft')"
    />
  </div>
</template>
<script setup lang="ts">
interface Props {
  title?: string;
  leftArrow?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  leftArrow: false,
});
interface Emit {
  (e: "onClickLeft"): void;
}
const emit = defineEmits<Emit>();
</script>
<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
}
</style>
