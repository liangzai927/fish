// 引入仓库定义函数
import { defineStore } from "pinia";

// 配置 state getters actions
const useWebsocketStore = defineStore("websocket", {
  // state 类似组件的data选项，函数形式返回对象
  state: () => {
    return {
      websocket: null,
    };
  },
  getters: {
    getWebScoket(): any {
      return this.websocket;
    },
  },
  actions: {
    setWebScoket(websocket: any) {
      this.websocket = websocket;
    },
  },
});

export default useWebsocketStore;
