import { http } from "@/utils/http";

type ResultTableListItem = {
  s_rid: string;
  sys_post_type_id: number; // 岗位类别ID
  roleName: string; // 角色名称
  cross_role_flag: boolean; // 是否为层级交叉职位
  function_role_flag: boolean; // 是否为职能口角色
  manage_role_flag: boolean; // 是否为管理口角色
  description: string; // 描述
  punchIn_flag: number; // 0: 不需要打卡 1: 需要打卡
  canSetByUser: number; // 0: 不能自行设置 1: 是否可以自行设置
  create_time: string;
  update_time: string;
};

type RoleResponse = {
  code: number;
  data: {
    list: ResultTableListItem[];
    totalCount: number;
    pageSize: number;
    currPage: number;
    totalPage: number;
  };
};

interface createRoleParams {
  sys_post_type_id: number; // 岗位类别ID
  roleName: string; // 角色名称
  cross_role_flag: boolean; // 是否为层级交叉职位
  function_role_flag: boolean; // 是否为职能口角色
  manage_role_flag: boolean; // 是否为管理口角色
  description: string; // 描述
  punchIn_flag: number; // 0: 不需要打卡 1: 需要打卡
  canSetByUser: number; // 0: 不能咨询设置 1: 是否可以自行设置
}

// 查询单个角色
export const getRole = (s_rid: string) => {
  return http.request<{ code: number; data: ResultTableListItem }>(
    "get",
    `/system/role/${s_rid}`
  );
};

// 查询角色列表
export const getRoleList = (data: object) => {
  return http.request<RoleResponse>("post", "/system/role/page", { data });
};

// 创建角色
export const createRole = (data: createRoleParams) => {
  return http.request("post", "/system/role", { data });
};

// 删除角色
export const deleteRole = (s_rid: string) => {
  return http.request("delete", `/system/role/${s_rid}`);
};

// 更新角色
export const updateRole = (s_rid: string, data: createRoleParams) => {
  return http.request("put", `/system/role/${s_rid}`, { data });
};
