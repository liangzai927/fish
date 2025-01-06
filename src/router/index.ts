import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import routes from "./routes";
import { useLoginStore, useUserStore } from "../store";
import { dingdingLogin } from "@/api/modules/login";
import * as dd from "dingtalk-jsapi"; // 引入钉钉api

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // try {
  NProgress.start();
  //   const { CorpId: corpId } = to.query;

  //   const token = useLoginStore().getToken;
  //   const loginStore = useLoginStore();
  //   const userStore = useUserStore();

  //   if (to.path == "/login") {
  //     if (!token) next();
  //     else next(from.path);
  //   } else {
  //     if (corpId) {
  //       // alert(corpId)
  //       const code = await relevance(corpId as string);

  //       if (code) {
  //         // alert(code)
  //         const res = await dingdingLogin({ type: 1, code });
  //         // alert(JSON.stringify(res))
  //         if (res?.code === 200) {
  //           loginStore.setToken(res.data.accessToken);
  //           localStorage.setItem("BI-token", res.data.accessToken);
  //           localStorage.setItem("iframToken", res.data.accessToken);
  //           const { id, name, orgList } = res.data;
  //           let userInfo = { id, name, orgList };
  //           userStore.setUser(userInfo);
  //           // alert(JSON.stringify(res.data.webaccessToken));
  //           next("/home");
  //         } else {
  //           alert('没有res')
  //           next("/login");
  //         }
  //       } else next("/login");
  //       // next()
  //     } else {
  //       if (token) next();
  //       else next("/login");
  //     }
  //   }
  // } finally {
  next();
  // }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
