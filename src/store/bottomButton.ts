// 引入仓库定义函数
import { defineStore } from "pinia";

// 配置 state getters actions
const useButtonListStore = defineStore("buttonList", {
  // state 类似组件的data选项，函数形式返回对象
  state: () => {
    return {
      buttonList: <any>[],
    };
  },
  getters: {
    getButtonList(): any[] {
      return this.buttonList;
    },
  },
  actions: {
    setButtonList(buttonList: any[]) {
      this.buttonList = buttonList;
    },
  },
});

export default useButtonListStore;
