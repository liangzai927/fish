<template>
  <div class="button-group">
    <van-button
      round
      block
      @click="isShow = false"
      size="normal"
      style="width: 40%"
    >
      取消
    </van-button>
    <van-button
      type="primary"
      round
      block
      @click="handleClick"
      size="normal"
      :disabled="!confirmOver"
      :loading="isLoading"
      loading-text="操作中"
      style="width: 40%"
    >
      <span>确定</span>
      <van-count-down
        v-show="!confirmOver"
        :time="countdown"
        format="ss 秒"
        style="font-size: 10px; color: #fff"
        @finish="confirmOver = true"
      />
    </van-button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

interface Emit {
  (e: "update:modelValue", bool: boolean): void;
  (e: "clickSureButton"): void;
}
const emit = defineEmits<Emit>();

const isShow = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const confirmOver = ref<boolean>(false);
const countdown = ref<number>(4000);
const isLoading = ref<boolean>(false);

const handleClick = async () => {
  isLoading.value = true;
  emit("clickSureButton");
};

function changeShow() {
  isLoading.value = false;
}

defineExpose({
  changeShow,
});
</script>

<style scoped>
.button-group {
  display: flex;
  justify-content: space-between;
}
</style>
