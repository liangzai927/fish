// 引入仓库定义函数
import { defineStore } from "pinia";

// 配置 state getters actions
const useUserStore = defineStore("user", {
  // state 类似组件的data选项，函数形式返回对象
  state: () => {
    return {
      user: localStorage.getItem("h5-user")
        ? null
        : JSON.parse(localStorage.getItem("h5-user") as any),
      tenantData: JSON.parse(localStorage.getItem("h5-tenantData") || "{}"),
    };
  },
  actions: {
    // 设置登录用户信息
    setUser(user: any) {
      this.user = user;
      localStorage.setItem("h5-user", JSON.stringify(user));
    },
    // 清除用户信息（注销）
    clearUser() {
      this.user = null;
    },
    async setTenantData(tenantData: any) {
      this.tenantData = tenantData;
      localStorage.setItem("h5-tenantData", JSON.stringify(tenantData));
    },
  },
});

export default useUserStore;
