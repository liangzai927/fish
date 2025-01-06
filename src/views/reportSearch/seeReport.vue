<template>
  <div class="enhancedReport">
    <div class="enhancedReport-content">
      <div id="enhancedSheet"></div>
      <div class="mask" v-show="maskShow">
        <span>渲染中...</span>
      </div>
    </div>
    <van-floating-panel
      v-if="searchConditionList.length > 0"
      style="z-index: 9999999"
    >
      <div v-for="item in searchConditionList" :key="item.paramId">
        <van-cell-group inset v-if="item.paramContent.controlsType === 'input'">
          <van-field
            v-model="item.paramContent.defaultValue"
            :label="item.paramContent.title"
            :placeholder="$t('baseForm.input')"
          />
        </van-cell-group>
        <van-cell-group inset v-if="item.paramContent.controlsType === 'date'">
          <DateSelect
            v-model="item.paramContent.defaultValue"
            :label="item.paramContent.title"
          />
        </van-cell-group>
      </div>
      <div style="padding: 8px 16px">
        <van-button type="primary" block @click="searchDataClick"
          >查询</van-button
        >
        <!-- <van-button
          type="primary"
          style="margin-top: 8px"
          block
          @click="exportData"
          >导出</van-button
        > -->
      </div>
    </van-floating-panel>
    <van-floating-bubble
      icon="down"
      @click="exportData"
      style="z-index: 1000000001"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import DateSelect from "@/components/DateSelect.vue";
import {
  setStyleAndValue,
  setMerge,
  setBorder,
  setImages,
  setColumnWidth,
  setRowHeight,
  setFrozen,
  setRowHidden,
  setColHidden,
  setFilter,
} from "@/utils/exportExcel.js";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getHashQueryParams } from "./utils";

const { proxy } = getCurrentInstance() as any;

const route = useRoute();
const maskShow = ref<boolean>(true);
const searchConditionList = ref<any[]>([]);
const paramValue = ref<any>({});
const detailData = ref<any>({});
const fileName = ref<string>("");

// excel配置项
const options: any = {
  container: "enhancedSheet", //luckysheet为容器id
  showinfobar: false, // 是否显示顶部信息栏
  lang: "zh", // 设定表格语言
  plugins: [{ name: "chart" }, { name: "exportXlsx", config: { url: "" } }],

  column: 60, // 默认60 空表格默认的列数量
  row: 10, // 默认60 空表格默认的行数据量
  showtoolbarConfig: {
    print: false,
  },
  data: [
    {
      name: "sheet1", //工作表名称
      config: {},
    },
  ],
  showtoolbar: false, // 是否显示工具栏
  showsheetbar: true, // 底部sheet bor
  showstatisticBar: true, // 是否显示底部sheet按钮
  cellRightClickConfig: {
    copy: false, // 复制
    copyAs: false, // 复制为
    paste: false, // 粘贴
    insertRow: false, // 插入行
    insertColumn: false, // 插入列
    deleteRow: false, // 删除选中行
    deleteColumn: false, // 删除选中列
    deleteCell: false, // 删除单元格
    hideRow: false, // 隐藏选中行和显示选中行
    hideColumn: false, // 隐藏选中列和显示选中列
    rowHeight: false, // 行高
    columnWidth: false, // 列宽
    clear: false, // 清除内容
    matrix: false, // 矩阵操作选区
    sort: false, // 排序选区
    filter: false, // 筛选选区
    chart: false, // 图表生成
    image: false, // 插入图片
    link: false, // 插入链接
    data: false, // 数据验证
    cellFormat: false, // 设置单元格格式,
  },
  enableAddRow: false, // 允许添加行
  enableAddBackTop: false, // 允许回顶部
  sheetFormulaBar: false, // 是否显示公式栏
  showstatisticBarConfig: {
    zoom: false,
  },
};

// excel初始化
const sheetInit = () => {
  console.log((window as any).luckysheet);
  (window as any).luckysheet.create(options);
};

// 获取数据集
const getData = async () => {
  const res = await proxy.$api.reportSearch.getDataSetTemp({
    tempId: route.params.id,
  });
  if (res.code == 200) {
    fileName.value = res.data.tempName;
    detailData.value = JSON.parse(res.data.detailContent);
    options.data[0].images = JSON.parse(res.data.tempContent).content[0].images;
    getSearchConditionList();
  }
};

// 获取条件列表
const getSearchConditionList = async () => {
  const res = await proxy.$api.reportSearch.getSearchParamList({
    tempId: route.params.id,
  });
  if (res?.code === 200) {
    searchConditionList.value = res.data;
    const paramsData: any = getHashQueryParams();
    searchConditionList.value.map((item) => {
      item.paramContent = JSON.parse(item.paramContent);
      if (paramsData[item.paramContent.name]) {
        paramValue.value[item.paramContent.name] =
          paramsData[item.paramContent.name];
        item.paramContent.defaultValue = paramsData[item.paramContent.name];
      } else
        paramValue.value[item.paramContent.name] =
          item.paramContent.defaultValue;
    });

    if (detailData.value) detailData.value.paramValue = paramValue.value;
    renderingData();
  }
};

// 改变条件触发
const searchData = (_e: any, item: any) => {
  // for (let k in paramValue.value) {
  //   if (k === item.paramContent.name)
  //     paramValue.value[k] = item.paramContent.defaultValue;
  // }
};

const searchDataClick = () => {
  (window as any).luckysheet.destoryLuckySheet();
  renderingData();
};

// 渲染数据
const renderingData = async () => {
  const res = await proxy.$api.reportSearch.queryReportData(detailData.value);
  if (res.code == 200) {
    options.column = res.colSize < 60 ? 60 : res.colSize;
    options.row = res.rowSize;

    res.data.map((item: any) => {
      if (item.style?.mc) delete item.style.mc;
    });
    getCellDataFun(res.data);
    sheetInit();

    maskShow.value = false;
  }
};

function getCellDataFun(list: any) {
  const cellData: any = [];
  const borderInfo: any = [];
  const columnlen: any = {};
  const rowlen: any = {};
  const customHeight: any = {};
  const customWidth: any = {};
  const customMerge: any = {};
  list.map((item) => {
    const obj = {
      c: item.col,
      r: item.row,
      v: item.style,
    };
    if (obj?.v?.m) obj.v.m = item.value;
    if (obj?.v?.v) obj.v.v = item.value;
    cellData.push(obj);

    if (item?.style?.bd) {
      if (item.style.bd.borderType !== "border-none") {
        if (item.col == 1) console.log(item);
        const borderObj = {
          ...item.style.bd,
        };
        if (item.mcStyle?.cs > 1 || item.mcStyle?.rs > 1) {
          borderObj.range = [
            {
              column: [
                item.mcStyle.c,
                item.mcStyle.cs > 1
                  ? item.mcStyle.c + item.mcStyle.cs - 1
                  : item.mcStyle.c,
              ],
              row: [
                item.mcStyle.r,
                item.mcStyle.rs > 1
                  ? item.mcStyle.r + item.mcStyle.rs - 1
                  : item.mcStyle.r,
              ],
            },
          ];
        } else if (item.mcStyle?.cs === 1 || item.mcStyle?.rs === 1) {
          borderObj.range = [
            {
              column: [item.col, item.col],
              row: [item.row, item.row],
            },
          ];
        }

        borderInfo.push(borderObj);
      }
    }

    if (item?.style?.colWidth) {
      columnlen[item.col] = item?.style.colWidth;
      customWidth[item.col] = 1;
    }

    if (item?.style?.rowHeight) {
      rowlen[item.row] = item?.style.rowHeight;
      customHeight[item.row] = 1;
    }

    if (item.mcStyle) {
      if (item.mcStyle?.cs > 1 || item.mcStyle?.rs > 1) {
        const key = `${item.mcStyle.r}_${item.mcStyle.c}`;
        customMerge[key] = item.mcStyle;
      }
    }
  });

  cellData.map((item: any) => {
    if (item?.v?.bd) delete item.v.bd;
  });

  options.data[0].celldata = cellData;
  options.data[0].config.borderInfo = borderInfo;
  options.data[0].config.merge = customMerge;
  options.data[0].config.columnlen = columnlen;
  options.data[0].config.rowlen = rowlen;
  options.data[0].config.customHeight = customHeight;
  options.data[0].config.customWidth = customWidth;
}

function exportExcelFront(luckysheet, name, excelType?: string) {
  // 1.创建工作簿，可以为工作簿添加属性
  const workbook = new ExcelJS.Workbook();
  // 2.创建表格，第二个参数可以配置创建什么样的工作表
  luckysheet.forEach(function (table) {
    // debugger
    if (table.data.length === 0) return true;
    const worksheet = workbook.addWorksheet(table.name);
    const merge = (table.config && table.config.merge) || {}; //合并单元格
    const borderInfo = (table.config && table.config.borderInfo) || {}; //边框
    const columnWidth = (table.config && table.config.columnlen) || {}; //列宽
    const rowHeight = (table.config && table.config.rowlen) || {}; //行高
    const frozen = table.frozen || {}; //冻结
    const rowhidden = (table.config && table.config.rowhidden) || {}; //行隐藏
    const colhidden = (table.config && table.config.colhidden) || {}; //列隐藏
    const filterSelect = table.filter_select || {}; //筛选
    const images = table.images || {}; //图片
    const hide = table.hide; //工作表 sheet 1隐藏
    if (hide === 1) {
      // 隐藏工作表
      worksheet.state = "hidden";
    }
    setStyleAndValue(table.data, worksheet);
    setMerge(merge, worksheet);
    setBorder(borderInfo, worksheet);
    setImages(images, worksheet, workbook);
    setColumnWidth(columnWidth, worksheet);
    //行高设置50导出后在ms-excel中打开显示25，在wps-excel中打开显示50这个bug不会修复
    setRowHeight(rowHeight, worksheet, excelType);
    setFrozen(frozen, worksheet);
    setRowHidden(rowhidden, worksheet);
    setColHidden(colhidden, worksheet);
    setFilter(filterSelect, worksheet);
    return true;
  });

  // 4.写入 buffer
  const buffer = workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });
    saveAs(blob, `${name}.xlsx`);
  });
  return buffer;
}

const exportData = () => {
  exportExcelFront((window as any).luckysheet.getAllSheets(), fileName.value);
};

watch(
  () => searchConditionList.value,
  (val) => {
    for (let k in paramValue.value) {
      const data = val.find((item) => item.paramContent.name === k);
      if (data) paramValue.value[k] = data.paramContent.defaultValue;
      // if (k === item.paramContent.name)
      //   paramValue.value[k] = item.paramContent.defaultValue;
    }

    // console.log(val);
  },
  { deep: true }
);

onMounted(() => {
  getData();
});

onUnmounted(() => {
  (window as any).luckysheet.destroy();
});
</script>

<style scoped lang="scss">
.enhancedReport {
  width: 100%;
  height: 100%;
  display: flex;
  &-content {
    flex: 1;
    position: relative;
    height: 100%;
    #enhancedSheet {
      margin: 0px;
      padding-bottom: 100px;
      width: 100%;
      height: 100%;
      left: 0px;
      top: 0px;
      position: relative;
    }
    .mask {
      position: absolute;
      z-index: 1000000002;
      margin: 0;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #409eff;
    }
  }
}
</style>
