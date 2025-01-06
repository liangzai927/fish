import request from "../../axios/index";
import { PREFIX } from "../../utils/CONSTANT";

export const getDevice = async (data: any): Promise<any> => {
  return request({
    method: "GET",
    url: "/factoryEquipTyp/selectFactoryVOList",
    data,
    prefix: PREFIX.businessPrefix,
  });
};

export const getDeviceByOrg = async (data: any): Promise<any> => {
  return request({
    method: "GET",
    url: "/Factory/selectByOrgIdEquipList",
    data,
    prefix: PREFIX.businessPrefix,
  });
};
