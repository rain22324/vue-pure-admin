import { http } from "@/utils/http";

interface ResultTableListItem {
  sys_post_type_id: string;
  name: string;
  create_time: string;
  update_time: string;
}

interface createPostTypeParams {
  name: string; // 类别名称
  type_code: string; // 类别编码
  order_index: number; // 排序
  description: string; // 描述
}

type getSinglePostTypeResult = {
  msg: string;
  code: number;
  data: ResultTableListItem;
};

// 查询单个岗位类别
export const getSinglePostType = (sys_post_type_id: string) => {
  return http.request<getSinglePostTypeResult>(
    "get",
    `/system/postType/${sys_post_type_id}`
  );
};

type getAllPostTypeListResult = {
  msg: string;
  code: number;
  data: ResultTableListItem[];
};

// 查询全部岗位类别
export const getAllPostTypeList = () => {
  return http.request<getAllPostTypeListResult>(
    "post",
    "/system/post-type/all"
  );
};

// 创建岗位类别
export const createPostType = (data: createPostTypeParams) => {
  return http.request("post", "/system/post-type", { data });
};

// 更新岗位类别
export const updatePostType = (
  sys_post_type_id: string,
  data: createPostTypeParams
) => {
  return http.request("put", `/system/post-type/${sys_post_type_id}`, { data });
};

// 删除岗位类别
export const deletePostType = (sys_post_type_id: string) => {
  return http.request("delete", `/system/post-type/${sys_post_type_id}`);
};
