<template>
  <div
    class="table-container"
    :style="{ 'max-height': props.height /* 固定容器的最大高度 */ }"
  >
    <table class="el-table">
      <!-- 表头 -->
      <thead>
        <tr>
          <th
            v-for="(column, index) in props.columns"
            :key="index"
            @click="column.sortable ? sortBy(column.prop) : null"
            :class="{ sortable: column.sortable }"
            :style="{ width: column.width || 'auto', height: '40px' }"
          >
            {{ column.label }}
            <span v-if="column.sortable" class="sort-icon">
              <i :class="getSortIconClass(column.prop)"></i>
            </span>
          </th>
        </tr>
      </thead>

      <!-- 表体 -->
      <tbody>
        <tr v-for="(item, rowIndex) in displayedData" :key="rowIndex">
          <td
            v-for="(column, colIndex) in props.columns"
            :key="colIndex"
            :style="{ width: column.width || 'auto', height: '36px' }"
          >
            <slot
              name="bodyCell"
              :column="column"
              :text="item[column.prop]"
              :record="item"
            >
              {{ item[column.prop] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";

interface Column {
  label: string;
  prop: string;
  sortable?: boolean;
  width?: number;
}

interface DataItem {
  [key: string]: any;
}

interface Props {
  data: DataItem[];
  columns: Column[];
  pageSize: number;
  pagination: boolean;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  data: [],
  columns: [],
  pageSize: 10,
  pagination: false,
});

const state = reactive({
  currentPage: 1,
  sortKey: "",
  sortOrder: "asc" as "asc" | "desc",
});

// 分页计算
const totalPages = computed(() =>
  Math.ceil(props.data.length / props.pageSize)
);

// 当前页显示的数据
const displayedData = computed(() => {
  let sortedData = [...props.data];
  if (state.sortKey) {
    sortedData.sort((a, b) => {
      if (a[state.sortKey] < b[state.sortKey])
        return state.sortOrder === "asc" ? -1 : 1;
      if (a[state.sortKey] > b[state.sortKey])
        return state.sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }
  const start = (state.currentPage - 1) * props.pageSize;
  return sortedData.slice(start, start + props.pageSize);
});

// 排序
const sortBy = (prop: string) => {
  if (state.sortKey === prop) {
    state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
  } else {
    state.sortKey = prop;
    state.sortOrder = "asc";
  }
};

const getSortIconClass = (prop: string) => {
  if (state.sortKey === prop) {
    return state.sortOrder === "asc"
      ? "el-icon-arrow-up"
      : "el-icon-arrow-down";
  }
  return "";
};
</script>

<style scoped lang="scss">
.table-container {
  width: 100%;
  overflow: auto; /* 启用滚动 */
}

.el-table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  position: sticky;
  top: 0;
  background-color: #f9fafa;
  z-index: 1;
}

th,
td {
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
  text-align: left;
  white-space: nowrap;
}

.sortable {
  cursor: pointer;
}

/* 排序图标样式 */
.sort-icon {
  margin-left: 5px;
}

.el-icon-arrow-up:before {
  content: "↑";
}

.el-icon-arrow-down:before {
  content: "↓";
}
</style>
