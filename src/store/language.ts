// 引入仓库定义函数
import { defineStore } from "pinia";

// 配置 state getters actions
const useLanguageStore = defineStore("language", {
  // state 类似组件的data选项，函数形式返回对象
  state: () => {
    return {
      language: localStorage.getItem("h5-language") || "zh",
    };
  },
  getters: {
    getLanguage(): string {
      return this.language;
    },
  },
  actions: {
    setLanguage(language: string) {
      this.language = language;
    },
  },
});

export default useLanguageStore;
