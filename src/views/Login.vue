<template>
  <div class="login">
    <h1 style="padding-bottom: 10vh">{{ $t("login.login") }}</h1>
    <p style="padding-bottom: 15vh">{{ $t("login.inputContent") }}</p>
    <van-field v-model="account" :label="$t('login.account')" />
    <van-field
      v-model="password"
      type="password"
      :label="$t('login.password')"
    />
    <van-button
      type="primary"
      round
      block
      style="margin-top: 3vh"
      @click="login"
      >{{ $t("login.login") }}</van-button
    >
    <van-button
      type="default"
      size="small"
      round
      class="language-button"
      @click="showLanguage = true"
    >
      {{ languageObj[languageStore.getLanguage] }}
      <template #icon>
        <SvgIcon name="language" :wsize="16" :hsize="16" />
      </template>
    </van-button>

    <LangChange v-model="showLanguage" />
  </div>
</template>

<script setup lang="ts">
import LangChange from "@/components/LangChange.vue";
import { useLanguageStore, useLoginStore, useUserStore } from "@/store";
import { showFailToast } from "vant";
import useTenant from "@/hooks/useTenant.ts";

const { proxy } = getCurrentInstance() as any;
const { tenantList, getTenantUserList, setUserData, bindTenantUser } =
  useTenant();
const router = useRouter();

const languageStore = useLanguageStore();
const loginStore = useLoginStore();
const account = ref<string>("");
const password = ref<string>("");
const showLanguage = ref<boolean>(false);
const languageObj: any = {
  zh: "简体中文",
  en: "English",
};

const setTenantData = async (count: number, userData: any) => {
  switch (count) {
    case 0:
      showFailToast("此登录账号无租户，请先前往web进行创建！");
      break;
    case 1:
      loginStore.setToken(userData.accessToken);
      localStorage.setItem("iframToken", userData.accessToken);
      setUserData(userData);
      router.push("/");
      break;
    default:
      loginStore.setToken(userData.accessToken);
      localStorage.setItem("iframToken", userData.accessToken);
      await getTenantUserList();
      await bindTenantUser(tenantList.value[0].tenantId);
      router.push("/");
      break;
  }
};

// 1:登录
const login = async () => {
  const res = await proxy.$api.login.login({
    account: account.value,
    password: password.value,
    tenantId: 1,
    type: "3",
  });
  if (res.code == 200) {
    // 根据res.data.tenantCount选择不同登录方式：0:需要创建租户；1：直接登录；>1:获取tenantList默认登录[0]
    setTenantData(res.data.tenantCount, res.data);
  }
};
</script>

<style scoped lang="scss">
.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 5vw;
  .language-button {
    position: absolute;
    top: 3vw;
    right: 3vw;
    :deep(.van-button__icon) {
      width: 16px;
      height: 16px;
    }
    :deep(.van-button__text) {
      line-height: 16px;
    }
  }
}
</style>
