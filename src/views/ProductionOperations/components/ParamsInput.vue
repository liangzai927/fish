<template>
  <van-popup v-model:show="showParamsInput" round>
    <div class="confirm-content">
      <div
        style="display: flex; align-items: center; gap: 8px"
        v-for="(item, index) in paramsData"
        :key="index.toString()"
      >
        <van-field name="radio" :label="item.paramName" v-if="item.type == 1">
          <template #input>
            <van-radio-group v-model="item.defaultValue" direction="horizontal">
              <van-radio name="1">开启</van-radio>
              <van-radio name="0">关闭</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field
          v-model="item.defaultValue"
          :label="item.paramName"
          :placeholder="item.tips"
          v-else
        />
      </div>
      <div class="button-group">
        <van-button
          round
          block
          size="small"
          @click="emit('update:modelValue', false)"
          style="width: 45%"
        >
          取消
        </van-button>
        <van-button
          :loading="sureOperationLoading"
          type="primary"
          round
          block
          @click="emit('confirmParams')"
          size="small"
          style="width: 45%"
        >
          确定
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  paramsData: any;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  paramsData: () => [],
});

interface Emit {
  (e: "update:modelValue", bool: boolean): void;
  (e: "confirmParams"): void;
}
const emit = defineEmits<Emit>();

console.log(props.paramsData);

const showParamsInput = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const sureOperationLoading = ref<boolean>(false);
</script>

<style scoped lang="scss">
.confirm-content {
  padding: 24px;
  background-color: rgba(255, 255, 255, 0.7);
  // width: 240px;
  // height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .radioParams {
    display: flex;
    align-items: center;
  }

  .button-group {
    display: flex;
    justify-content: space-between;
  }
}
</style>
