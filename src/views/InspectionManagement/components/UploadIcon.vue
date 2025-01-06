<template>
  <van-uploader :after-read="afterRead">
    <van-icon class="photo" name="photograph" />
  </van-uploader>
</template>

<script setup lang="ts">
import { showImagePreview } from "vant";

interface Emit {
  (e: "finishUpload", url: string, index: number): void;
}
const emit = defineEmits<Emit>();
interface Props {
  index?: number;
}
const props = withDefaults(defineProps<Props>(), {
  index: -1,
});

const api: any = inject("$api");

async function afterRead(file: any) {
  let uploadParams = new FormData();
  uploadParams.append("file", file.file);
  const res = await api.common.upload(uploadParams);
  if (res?.code === 200) emit("finishUpload", res.data, props.index);
}

function seePic() {
  showImagePreview([props.url]);
}
</script>

<style scoped></style>
