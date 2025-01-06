
/**
 * @param keyName // 字典编码
 *
 * @returns  // 调用字典的方法 和 字典列表
 */

export default function useDictionary() {
  const { proxy } = getCurrentInstance() as any;
  const dictionaryList = ref<any[]>([]);
  const dictionaryContent = ref<any>({});

  const getDictionaryList = async (keyName: string) => {
    const res = await proxy.$api.dictionary.dictionarySearch({
      keyName,
    });
    if (res.code == 200) {
      dictionaryList.value = res.data.sysDictDataVOS;
      dictionaryContent.value = res.data;
    }
  };

  return {
    dictionaryList,
    dictionaryContent,
    getDictionaryList,
  };
}
