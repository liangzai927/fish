import { useUserStore } from "@/store";

// 根据Type类型获取不同装置列表
/**
 *
 * @params defaultId 所选租户id
 */
export default function useTenant() {
    const { proxy } = getCurrentInstance() as any;
    const userStore = useUserStore();

    const tenantList = ref<any[]>([]);
    // >1:获取租户列表
    const getTenantUserList = async () => {
        const res = await proxy.$api.login.getTenantList();
        if (res.code == 200) {
            tenantList.value = res.data;
        }
    };
    const getTenantData = async () => {
        const res = await proxy.$api.login.getTenantData();
        if (res.code == 200) {
            userStore.setTenantData(res.data);
        }
    };
    // 登录后存储用户、租户信息
    async function setUserData(userData: any) {
        const { id, name, orgList } = userData;
        let userInfo = { id, name, orgList };
        userStore.setUser(userInfo);
        await getTenantData();
    }

    // >1:切换绑定租户/登录
    const bindTenantUser = async (defaultId: number) => {
        const res = await proxy.$api.login.bindTenant({ tenantId: defaultId });
        if (res.code == 200) {
            await setUserData(res.data);
        }
    };
    return {
        tenantList,
        getTenantUserList,
        setUserData,
        bindTenantUser
    };
};

