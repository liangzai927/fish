// 文件路径判断拼接方法
import { ref } from "vue";

const pathPage = ref(window.location.href);

export const pathSplice = (path: string) => {
  if (path !== null && path !== undefined) {
    let pathArr = pathPage.value.split(":");
    let pathHttps = "https://minomes.twonum.com:8091/";
    // console.log(path);
    let pathList = path.split("/");
    if (pathArr[0] === "http") {
      return path;
    } else {
      return pathHttps + pathList.slice(3).join("/");
    }
  } else {
    return "";
  }
};
