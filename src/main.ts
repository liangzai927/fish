import { createApp } from "vue";
import App from "./App.vue";
// 导入构造函数
import { createPinia } from "pinia";
import router from "./router";
import { i18n, vantLocales } from "./lang";
import gloablComponent from "./components/index";
import request from "./axios";
import api from "./api";
import "virtual:svg-icons-register";
// Toast
import "vant/es/toast/style";
// Dialog
import "vant/es/dialog/style";
// Notify
import "vant/es/notify/style";
// ImagePreview
import "vant/es/image-preview/style";
// Icon图标
import IconFont from "./components/IconFont.vue";
import "./assets/iconFont/iconfont.js";
// 引入自定义标题组件
import HeadeBar from "./components/HeadeBar.vue";
// 引入es-drager样式
import "es-drager/lib/style.css";

// 创建Vue应用实例app
const app = createApp(App);
// 实例化 Pinia
const pinia = createPinia();
//对vant组件进行初始化语言设置
vantLocales(i18n.locale);

// 挂载全局对象
app.config.globalProperties.$request = request;
app.config.globalProperties.$api = api;

app.provide("$api", api);

// 应用以插件形式挂载Pinia实例
app.use(pinia);
// 挂在路由
app.use(router);
// 应用 国际化
app.use(i18n);
// 引用svg组件
app.use(gloablComponent);
// 引用icon图标
app.component("IconFont", IconFont);
// 引用自定义hearbar组件
app.component("HeadeBar", HeadeBar);

app.mount("#app");
