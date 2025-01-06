// import { getCurrentInstance } from 'vue';

// 根据Type类型获取不同装置列表
/**
 *
 * @params {Object} type=> 1: 生产装置 2:能源管网 3:储罐 4:仓库
 */
export const useDeviceList = () => {
  const { proxy } = getCurrentInstance() as any;
  const deviceList = ref<any[]>([]);
  const getDeviceList = async (data: any) => {
    const res = await proxy.$api.device.getDevice(data);
    if (res?.code == 200) deviceList.value = res.data;
  };

  return {
    deviceList,
    getDeviceList,
  };
};

// 根据登录者部门获取装置权限
export const useDeviceListByOrg = () => {
  const { proxy } = getCurrentInstance() as any;
  const myDeviceList = ref<any[]>([]);
  const getDeviceListByOrg = async (data: any) => {
    const res = await proxy.$api.device.getDeviceByOrg(data);
    if (res?.code == 200) myDeviceList.value = res.data;
  };

  return {
    myDeviceList,
    getDeviceListByOrg,
  };
};
