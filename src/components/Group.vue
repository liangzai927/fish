<template>
  <div class="es-group" style="color: #fff">
    <!-- {{ elements }} -->
    <component
      :id="item.id"
      v-for="item in props.elements"
      :is="dropMap[item.component]"
      :name="item.name"
      :styleData="item.groupStyle"
      :type="item.type"
      :text="item.text"
      v-bind="item.props"
    >
      {{ item.text }}
    </component>
  </div>
</template>

<script setup lang="ts">
import Shape from "@/views/seeChart/components/Shape.vue";

const dropMap = {
  Shape,
};

interface Props {
  elements: any[];
}

const props = withDefaults(defineProps<Props>(), {
  elements: () => [],
});
</script>
