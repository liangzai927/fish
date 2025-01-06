// 引入仓库定义函数
import { defineStore } from "pinia";

// 配置 state getters actions
const useLoginStore = defineStore("login", {
  // state 类似组件的data选项，函数形式返回对象
  state: () => {
    return {
      token: localStorage.getItem("h5-token") || "",
    };
  },
  getters: {
    getToken(): string {
      return this.token;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("h5-token", token);
    },
    logout() {
      this.token = "";
      localStorage.clear();
    },
  },
});

export default useLoginStore;
