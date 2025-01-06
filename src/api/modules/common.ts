import request from "../../axios/index";
import { PREFIX } from "../../utils/CONSTANT";

// 上传文件
export const upload = async (params: any) => {
  return request({
    method: "POST",
    url: "/file/upload",
    data: params,
    prefix: PREFIX.businessPrefix,
  });
};

// 获取公钥
export const getPublicKey = async () => {
  return request({
    method: "GET",
    url: "/datasource/getPublicKey",
    prefix: PREFIX.businessPrefix,
  });
};
