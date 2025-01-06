import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: "index",
    path: "/",
    redirect: "/home",
    component: () => import("@/views/index.vue"),
    children: [
      {
        name: "home",
        path: "/home",
        meta: {
          isShow: true,
          title: "鱼塘",
        },
        component: () => import("@/views/Home/index.vue"),
      },
      {
        name: "todo",
        path: "/todo",
        meta: {
          isShow: true,
          title: "待办事项",
        },
        component: () => import("@/views/ToDoList/index.vue"),
      },
      {
        name: "message",
        path: "/message",
        meta: {
          isShow: true,
          title: "消息",
        },
        component: () => import("@/views/MessageCenter/index.vue"),
      },
      {
        name: "my",
        path: "/my",
        meta: {
          isShow: true,
          title: "我的",
        },
        component: () => import("@/views/My/index.vue"),
      },
    ],
  },
];

export default routes;
