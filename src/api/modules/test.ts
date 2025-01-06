import request from "../../axios/index";
import { PREFIX } from "../../utils/CONSTANT";

export const test1 = async (params: any) => {
  return request({
    method: "POST",
    url: "/nft/chain",
    data: params,
    prefix: PREFIX.businessPrefix,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
