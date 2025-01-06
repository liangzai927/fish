import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  AxiosInstance,
  CancelTokenStatic,
} from "axios";
import qs from "qs";
import router from "../router/index";
import { useLoginStore } from "../store";

// import { errorCodeHandler } from "./errorHandler";
import { showFailToast } from "vant";
import { ERROR } from "../utils/CONSTANT";

// request 配置项
interface AxiosRequestOption extends AxiosRequestConfig {
  // 服务名前缀
  prefix: string;
}

class Request {
  // axios 实例
  instance: AxiosInstance;

  pending: Array<{
    url: string;
    cancel: void;
  }> = [];
  CancelToken: CancelTokenStatic = axios.CancelToken;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem("h5-token");
        if (
          !(config.url.includes("login") || config.url.includes("signLogin"))
        ) {
          config.headers["Authorization"] = `bearer ${token}`;
        }
        this.removePending(config, {
          isCancel: true,
        });
        config.cancelToken = new this.CancelToken((c: any) => {
          this.pending.push({
            url: `${config.url}/${JSON.stringify(config.data)}&request_type=${config.method
              }`,
            cancel: c,
          });
        });
        return config;
      },
      (err: any) => err,
    );
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        this.removePending(res.config);
        if (res.status === 200) {
          if (res.request.responseType == "blob") return res;
          else return res.data;
        }
        return Promise.reject(ERROR.SERVICE);
      },
      (error: any) => {
        if (error?.response) {
          const response = error.response;
          const { data, status } = response;
          showFailToast(data.message);
          if (status == 401) {
            localStorage.clear();
            useLoginStore().logout();
            // 前往登录页
            router.push("/login");
          }
        }
      },
    );
    this.request = this.request.bind(this);
  }

  request(options: AxiosRequestOption) {
    // 统一request封装
    const { method = "get", prefix, url } = options;
    if (prefix) options.url = prefix + url;
    if (method.toLowerCase() === "get" || method.toLowerCase() === "delete") {
      options.params = options.data;
    }

    if (method.toLowerCase() === "post" || method.toLowerCase() === "put") {
      if (!options.headers) {
        options.headers = {};
      }
      // const { headers } = options;

      // if (!headers["Content-Type"]) {
      //   // method为post/put时 默认contentType设置为application/json
      //   headers["Content-Type"] = "application/json";
      // }
      // const contentType = headers?.["Content-Type"] as string;

      // if (contentType.indexOf("application/json") > -1) {
      //   options.data = JSON.stringify(options.data);
      // } else {
      //   options.data = qs.stringify(options.data);
      // }
    }
    return this.instance(options);
  }

  removePending(config: any, { isCancel = false } = {}): void {
    // 取消重复网络请求
    for (const p in this.pending) {
      const item: any = p;
      const list: any = this.pending[p];

      if (
        list.url ===
        `${config.url}/${JSON.stringify(config.data)}&request_type=${config.method
        }`
      ) {
        if (isCancel) {
          console.warn(config.url + " is canceled");
          list.cancel(config.url);
        }
        this.pending.splice(item, 1);
      }
    }
  }
}

export default Request;
