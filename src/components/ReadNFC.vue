<template>
  <div style="margin: 24px">
    <van-button @click="startReading()" v-if="!is(NFCStatus.READING)">
      Start Reading
    </van-button>
    <van-button type="danger" @click="stopReading()" v-else>
      Stop Reading
    </van-button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import useNFC, { NFCStatus } from "../composition/useNFC";

export default defineComponent({
  setup() {
    const { startReading, stopReading, is } = useNFC();
    return { NFCStatus, startReading, stopReading, is };
  },
});
</script>
