import { defineStore } from "pinia";
import { ref, readonly } from "vue";
import { getDictionaryByCode } from "@/api/common";

// 定义枚举值类型
export type EnumItem = Record<string | number, any>;
export type EnumMap = Record<string, EnumItem>;

export const useEnumStore = defineStore(
  "enum",
  () => {
    // 使用 ref + readonly 控制状态变更安全
    const enumMap = ref<EnumMap>({});
    const loadingKeys = ref<Set<string>>(new Set()); // 记录正在加载的 key，防止重复请求

    /**
     * 设置单个枚举对象
     * @param key 枚举分类 key
     * @param value 枚举对象，如 { 0: '男', 1: '女' }
     */
    const setEnum = (key: string, value: EnumItem) => {
      enumMap.value = {
        ...enumMap.value,
        [key]: value
      };
    };

    /**
     * 获取某个分类下的所有枚举值
     * @param key 枚举分类 key
     */
    const getEnum = (key: string): EnumItem | undefined => {
      return enumMap.value[key];
    };

    /**
     * 如果枚举 key 不存在，则通过接口获取并保存
     * @param key 枚举类型 code
     */
    const fetchEnumIfNotExists = async (
      key: string
    ): Promise<EnumItem | undefined> => {
      if (enumMap.value[key]) {
        return enumMap.value[key];
      }

      if (loadingKeys.value.has(key)) {
        return;
      }

      loadingKeys.value.add(key);

      try {
        const res = await getDictionaryByCode(key);
        if (res.code === 0) {
          const data = JSON.parse(res.dictionary.item_values);
          enumMap.value[key] = data;
          return data;
        }
      } finally {
        loadingKeys.value.delete(key);
      }
    };

    return {
      enumMap: readonly(enumMap),
      setEnum,
      getEnum,
      fetchEnumIfNotExists
    };
  },
  {
    persist: true // 启用持久化
  }
);
