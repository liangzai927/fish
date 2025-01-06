import Request from "./request";

const { request } = new Request({
  timeout: 1000 * 20,
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

export default request;
