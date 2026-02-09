import { http } from "@/utils/http";

type DictionaryResponse = {
  code: number;
  dictionary: {
    code: string;
    name: string;
    item_values: string;
  };
};

type DataBaseListResponse = {
  msg: string;
  code: number;
  data: string[];
};

// 根据code查询字典
export const getDictionaryByCode = (params: string) => {
  return http.request<DictionaryResponse>(
    "get",
    `/system/dictionary/info/code/${params}`
  );
};

// 查询所有数据库名称
export const getDataBaseList = () => {
  return http.request<DataBaseListResponse>("get", "/common/data-base-list");
};
