import { ref, reactive } from "vue";

export default function usePage(getListFun: Function) {
  const pages = reactive<{
    pageSize: number;
    pageNo: number;
    total: number;
  }>({
    pageSize: 20,
    pageNo: 1,
    total: 0,
  });
  const list = ref<any[]>([]);

  const getList = async (data: any) => {
    const res = await getListFun({
      pageSize: pages.pageSize,
      pageNo: pages.pageNo,
      ...data,
    });
    if (res?.code === 200) {
      // pages.total = res.data.total
      pages.total = res.data.total;
      if (res.data.hasOwnProperty("rows"))
        pages.pageSize === 1
          ? (list.value = res.data.rows)
          : (list.value = list.value.concat(res.data.rows));
      if (res.data.hasOwnProperty("list"))
        pages.pageSize === 1
          ? (list.value = res.data.list)
          : (list.value = list.value.concat(res.data.list));
      return true;
    } else false;
  };

  return {
    list,
    pages,
    getList,
  };
}
