<template>
  <van-popup v-model:show="visible" position="bottom">
    <van-picker
      :columns="columns"
      @confirm="onConfirm"
      @cancel="emits('update:modelValue', false)"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { vantLocales } from "@/lang";
import { useI18n } from "vue-i18n";
import { useLanguageStore } from "@/store";

const store = useLanguageStore();

interface Prop {
  modelValue: boolean;
}
interface Emit {
  (e: "update:modelValue", bool: boolean): void;
}
const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
});
const emits = defineEmits<Emit>();
const visible = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emits("update:modelValue", val);
  },
});
const { locale } = useI18n();
const columns = [
  { text: "简体中文", value: "zh" },
  { text: "English", value: "en" },
];
const onConfirm = ({ selectedOptions }: any) => {
  let lang = selectedOptions[0]?.value;
  //切换vant组件语言
  vantLocales(lang);
  //切换页面中的语言
  locale.value = lang;
  localStorage.setItem("h5-language", lang);
  store.setLanguage(lang);
  emits("update:modelValue", false);
};
</script>

<style scoped lang="scss"></style>
