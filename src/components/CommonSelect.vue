<template>
  <van-field
    v-model="props.modalValue"
    is-link
    readonly
    :label="props.label"
    :placeholder="$t(props.placeholder)"
    @click="showPicker = true"
  />
  <van-popup v-model:show="showPicker" round position="bottom">
    <van-picker
      :columns="props.columns"
      @cancel="showPicker = false"
      @confirm="onConfirm"
    />
  </van-popup>
</template>

<script setup lang="ts">
interface Props {
  columns: any;
  modalValue: any;
  label?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  columns: [],
  modalValue: "",
  label: "选择标题",
  placeholder: "baseForm.select",
});

const showPicker = ref<boolean>(false);

const onConfirm = ({ selectedOptions }: any) => {
  console.log(selectedOptions);
};
</script>

<style scoped lang="scss"></style>
