import { http } from "@/utils/http";

type createRoleMenuData = {
  id?: string;
  s_rid: string;
  s_mid: string;
  data_permit_type: number;
};

type getRoleMenuData = {
  msg: string;
  code: number;
  data: createRoleMenuData[];
};

// 根据职位id查询菜单
export const getRoleMenu = (s_rid: string) => {
  return http.request<getRoleMenuData>(
    "get",
    `/system/role-menu/role/${s_rid}`
  );
};

// 更新职位菜单
export const updateRoleMenu = (data: createRoleMenuData) => {
  return http.request("put", `/system/role-menu/modify`, { data });
};

// 删除职位菜单
export const deleteRoleMenu = (id: string) => {
  return http.request("delete", `/system/role-menu/${id}`);
};

// 创建职位菜单关系
export const createRoleMenu = (data: createRoleMenuData) => {
  return http.request("post", `/system/role-menu`, { data });
};
