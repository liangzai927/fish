<template>
  <!-- <div>123</div> -->
  <div
    style="width: 100%; height: 100%; position: relative"
    :class="bool ? 'landscape-div' : ''"
  >
    <iframe
      ref="iframeRef"
      class="frame"
      :src="frameUrl"
      frameborder="0"
      :class="bool ? 'landscape' : ''"
    ></iframe>
    <div style="position: absolute; right: 10px" :style="bool ? bottom : top">
      <van-icon
        v-if="bool"
        name="shrink"
        @click.stop="changeOrientation"
        color="#fff"
        size="30"
      />
      <van-icon
        v-else
        name="expand-o"
        @click.stop="changeOrientation"
        color="#fff"
        size="30"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const bottom = {
  bottom: "10px",
};
const top = {
  top: "10px",
};

const iframeRef: Ref = ref(null);
const route = useRoute();

const frameUrl = ref<string>("");
const bool = ref<boolean>(false);

const changeOrientation = () => {
  bool.value = !bool.value;
};

onMounted(() => {
  let httpStr: string = "";
  if (import.meta.env.VITE_ENV === "production")
    httpStr = window.location.origin;
  else httpStr = import.meta.env.VITE_APP_BASE_URL;

  frameUrl.value = `${httpStr}/mesWeb/#/chart/preview/${
    route.params.id as string
  }`;

  // frameUrl.value = `http://10.10.10.28:8080/#/chart/preview/${
  //   route.params.id as string
  // }`;

  iframeRef.value.onload = () => {
    iframeRef.value.contentWindow.postMessage(
      {
        // isShow: "no-show",
        token: localStorage.getItem("BI-token")
          ? localStorage.getItem("BI-token")
          : localStorage.getItem("h5-token"), //需要传递的数据
        publicKey: localStorage.getItem("publicKey"),
      },
      "*"
    );
  };
});
</script>

<style scoped lang="scss">
.frame {
  width: 100%;
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
  overflow: hidden;
}
/* 横屏样式 */
.landscape {
  transform: rotate(90deg);
  width: 100vh;
  height: 100vw;
}
.landscape-div {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
