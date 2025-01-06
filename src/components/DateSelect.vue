<template>
  <van-field
    v-model="props.modelValue"
    is-link
    readonly
    :label="props.label"
    :placeholder="$t(props.placeholder)"
    @click="showPicker = true"
  />
  <van-popup v-model:show="showPicker" round position="bottom">
    <van-date-picker
      v-model="chooseDate"
      title="选择日期"
      @confirm="showPicker = false"
    />
  </van-popup>
</template>

<script setup lang="ts">
interface Props {
  modelValue: any;
  placeholder?: string;
  label?: string;
}
interface Emit {
  (e: "update:modelValue", val: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  modalValue: "",
  placeholder: "baseForm.select",
  label: "选择日期",
});

const emits = defineEmits<Emit>();

const chooseDate = computed({
  get() {
    return props.modelValue.split("-");
  },
  set(val) {
    emits("update:modelValue", val.join("-"));
  },
});

const showPicker = ref<boolean>(false);
</script>

<style scoped lang="scss"></style>
