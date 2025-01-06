import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
// 引入path
import { resolve } from "path";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import legacy from "@vitejs/plugin-legacy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    AutoImport({
      imports: ["vue", "vue-router"],
    }),
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      // Specify symbolId format
      symbolId: "icon-[dir]-[name]",
    }),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  /* 路径配置 */
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "./src"),
      },
    ],
  },

  css: {
    // css预处理器
    preprocessorOptions: {
      scss: {
        // 引入 mixin.scss 这样就可以在全局中使用 mixin.scss中预定义的变量了
        // 给导入的路径最后加上 ;
        additionalData: '@import "@/style/vars.scss";',
      },
    },
  },

  /* 打包配置 */
  base: "./",
  build: {
    outDir: "mobileWeb",
    target: "es2015",
  },

  /* 配置前端服务地址和端口 */
  server: {
    host: "0.0.0.0",
    port: 8081,
    // 是否开启 https
    https: false,
  },
});
