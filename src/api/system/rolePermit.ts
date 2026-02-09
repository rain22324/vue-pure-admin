import { http } from "@/utils/http";

interface createRolePermitParams {
  s_rid: number;
  s_mid: number;
  s_pid: number;
}

interface rolePermitItem extends createRolePermitParams {
  id: number;
}

// 根据职位id查询系统功能权限
export const getRolePermitByRoleId = (s_rid: string) => {
  return http.request<rolePermitItem[]>(
    "get",
    `/system/role-permit/role/${s_rid}/permits`
  );
};

// 更新职位系统功能权限
export const updateRolePermitByRoleId = (
  id: string,
  data: createRolePermitParams
) => {
  return http.request("put", `/system/role-permit/${id}`, { data });
};

// 删除职位系统功能权限
export const deleteRolePermitByRoleId = (id: string) => {
  return http.request("delete", `/system/role-permit/${id}`);
};

// 创建职位系统功能权限
export const createRolePermit = (data: createRolePermitParams) => {
  return http.request("post", `/system/role-permit`, { data });
};
