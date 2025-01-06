<template>
  <svg
    class="svg-icon"
    :style="{
      width: wsize ? wsize + 'px' : '100%',
      height: hsize ? hsize + 'px' : '100%',
      color: color,
    }"
  >
    <use :xlink:href="`#icon-${name}`" :fill="color" />
  </svg>
</template>
<script lang="ts" setup>
defineProps({
  name: {
    type: String,
    required: true,
    default: "car",
  },
  wsize: {
    type: Number,
    default: 0,
  },
  hsize: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: "#000",
  },
});
</script>
