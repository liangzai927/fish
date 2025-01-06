import request from "../../axios/index";
import { PREFIX } from "../../utils/CONSTANT";

// 获取消息列表
export const messageListHttp = async (data: any) => {
    return request({
        method: "get",
        url: "/Messaging/selectMessageLogList",
        data,
        prefix: PREFIX.businessPrefix,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

// 获取消息详情
export const messageDetailHttp = async (data: any) => {
    return request({
        method: "get",
        url: "/Messaging/selectByMessageLogId",
        data,
        prefix: PREFIX.businessPrefix,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

// 修改消息状态
export const changeMessageState = async (data: any) => {
    return request({
        method: "post",
        url: "/Messaging/updateMessageLogStatus",
        data,
        prefix: PREFIX.businessPrefix,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
