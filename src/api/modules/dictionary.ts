import request from "../../axios/index";
import { PREFIX } from "../../utils/CONSTANT";

export const dictionarySearch = async (params: any): Promise<any> => {
  return request({
    method: "GET",
    url: "/sysDictData/selectSysDictDataHide",
    data: params,
    prefix: PREFIX.businessPrefix,
  });
};
