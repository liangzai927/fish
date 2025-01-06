<template>
  <van-uploader
    v-model="fileList"
    :before-read="beforeRead"
    :after-read="afterRead"
    :max-count="1"
    :disabled="props.disabled"
    @delete="removeFile"
  >
    <van-button
      size="small"
      v-if="props.type === 'button'"
      type="primary"
      :disabled="props.disabled"
    >
      上传文件
    </van-button>
    <div class="upload-pic" v-if="props.type === 'picture'">
      <div v-if="imageUrl" class="image-container">
        <img :src="imageUrl" alt="avatar" class="fixed-width-image" />
      </div>
      <div v-else style="text-align: center">
        <van-icon name="plus" />
        <div class="ant-upload-text">上传文件</div>
      </div>
    </div>
  </van-uploader>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { showToast } from "vant";

interface Props {
  buttonText?: string;
  type?: string;
  imageUrl?: string;
  id?: any;
  upFile?: string;
  fileData?: any;
  disabled?: boolean;
  size?: number;
  fileType?: string;
  acceptedFileTypes?: string;
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: "baseButton.uploadFile",
  type: "button",
  disabled: false,
  size: -1,
  fileType: "",
});
const acceptedFileTypes = ref(
  props.acceptedFileTypes || props.fileType == "picture" ? "image" : ""
);

interface Emit {
  (e: "getUrl", url: any, id?: any): void;
  (e: "uploadChildFile", formData: any, data: any): void;
}
const emit = defineEmits<Emit>();
const fileList = ref<any[]>([]);
const imageUrl = ref<any>(props.imageUrl);
const { proxy } = getCurrentInstance();

const beforeRead = async (file: File) => {
  if (props.size > -1 && file.size > props.size) {
    showToast("文件超出限制范围");
    return false;
  }
  console.log("文件信息:", file);

  const formData = new FormData();
  formData.append("file", file);
  try {
    // 直接上传文件
    const res = await proxy.$api.workFlow.uploadFiles(formData);
    if (res?.code === 200) {
      // 上传成功后更新 imageUrl，并触发 getUrl 事件
      imageUrl.value = res.data;
      emit("getUrl", res.data, props.id);
    } else {
      // 处理非 200 状态码的响应
      console.error("上传失败:", res?.message || "未知错误");
      showToast(res?.message || "上传失败");
    }
  } catch (error) {
    // 捕获请求中的任何错误
    console.error("上传出错:", error);
    showToast("上传出错，请稍后重试");
  }
};

// const afterRead = async (data: any) => {
//   const { file } = data;
//   console.log('文件信息:', file);

//   const formData = new FormData();
//   formData.append('file', file);

//   if (props.upFile && props.fileData) {
//     // 如果有自定义的上传逻辑，则触发 uploadChildFile 事件
//     nextTick(() => {
//       emit('uploadChildFile', formData, data);
//     });
//   } else {
//     try {
//       // 直接上传文件
//       const res = await proxy.$api.common.uploadFiles(formData);
//       if (res?.code === 200) {
//         // 上传成功后更新 imageUrl，并触发 getUrl 事件
//         imageUrl.value = res.data;
//         emit('getUrl', res.data, props.id);
//       } else {
//         // 处理非 200 状态码的响应
//         console.error('上传失败:', res?.message || '未知错误');
//         showToast(res?.message || '上传失败');
//       }
//     } catch (error) {
//       // 捕获请求中的任何错误
//       console.error('上传出错:', error);
//       showToast('上传出错，请稍后重试');
//     }
//   }
// };

const removeFile = (_file: any) => {
  emit("getUrl", "", props.id);
  imageUrl.value = "";
};

function clearFileList() {
  fileList.value = [];
}

defineExpose({
  clearFileList,
});
</script>

<style scoped lang="scss">
.upload-pic {
  width: 80px;
  height: 80px;
  border: 1px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .fixed-width-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .upload-placeholder {
    text-align: center;
  }
}
</style>
