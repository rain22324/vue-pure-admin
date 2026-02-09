import { http } from "@/utils/http";

export interface addPermitParams {
  s_mid: number; // 菜单id
  permit_code: string; // 权限编码，以菜单树上的database_name开头，用:分隔
  permit_name: string; // 权限名称
  description?: string; // 权限描述
}

export interface permitItem extends addPermitParams {
  s_pid: number;
  create_time: string;
  update_time: string;
}

// 根据菜单id查询系统功能权限
export const getPermitByMenuId = (s_mid: number) => {
  return http.request<permitItem[]>(
    "get",
    `/system/permit/menu/${s_mid}/permits`
  );
};

// 添加系统功能权限
export const addPermit = (data: addPermitParams) => {
  return http.request("post", `/system/permit`, { data });
};

// 删除系统功能权限
export const deletePermit = (s_pid: number) => {
  return http.request("delete", `/system/permit/${s_pid}`);
};

// 修改系统功能权限
export const updatePermit = (s_pid: number, data: addPermitParams) => {
  return http.request("put", `/system/permit/${s_pid}`, { data });
};

type serviceDetailsResponseItem = {
  module: string; // 如：系统管理
  predicates: string; // 如：system
  id: string; // 如：dtsp-service-system
  uri: string; // 如：lb://dtsp-service-system
  filters: string[]; // 如：["[[StripPrefix parts = 1], order = 1]"]
};

// 查询所有系统服务
export const getServiceDetails = () => {
  return http.request<serviceDetailsResponseItem[]>(
    "get",
    "/common/service-details"
  );
};

// const a = {
//   msg: "success",
//   code: 0,
//   data: {
//     数据权限配置: {},
//     数据权限明细: {},
//     系统菜单: {
//       "system:menu:update": { 更新: "" },
//       "system:menu:delete": { 删除: "" },
//       "system:menu:create": { 创建: "" },
//       "system:menu:query": { 查询: "", 根据ids查询: "", 查询列表: "" }
//     },
//     系统功能权限: {
//       "system:permit:update": { 更新: "需要权限:【system:permit:update】" },
//       "system:permit:delete": { 删除: "需要权限:【system:permit:delete】" },
//       "system:permit:create": { 创建: "需要权限:【system:permit:create】" },
//       "system:permit:query": {
//         查询: "需要权限:【system:permit:query】",
//         "查询-根据菜单": "需要权限:【system:permit:query】",
//         查询列表: "需要权限:【system:permit:query】"
//       }
//     },
//     岗位类别: {},
//     系统角色: {
//       "system:role:query": { 根据ids查询: "根据ids查询,返回 List<Role>" }
//     },
//     角色菜单关系: {},
//     角色功能权限关系: {},
//     用户菜单关系: {},
//     用户权限关系: {},
//     用户权限组关系: {},
//     用户角色关系: {},
//     用户状态: {},
//     用户类型: {},
//     通用接口: {}
//   }
// };

type interfaceListResponse = {
  msg: string;
  code: number;
  data: {
    name: string;
    children: {
      name: string;
      code: string;
      children: {
        name: string;
        code: string;
      }[];
    }[];
  }[];
};

export const interfaceList: interfaceListResponse = {
  msg: "success",
  code: 0,
  data: [
    {
      name: "系统菜单",
      children: [
        {
          name: "更新",
          code: "system:menu:update",
          children: [
            {
              name: "更新",
              code: "system:menu:update"
            }
          ]
        },
        {
          name: "删除",
          code: "system:menu:delete",
          children: [
            {
              name: "删除",
              code: "system:menu:delete"
            }
          ]
        },
        {
          name: "创建",
          code: "system:menu:create",
          children: [
            {
              name: "创建",
              code: "system:menu:create"
            }
          ]
        },
        {
          name: "查询",
          code: "system:menu:query",
          children: [
            {
              name: "查询",
              code: "system:menu:query"
            },
            {
              name: "查询-根据菜单",
              code: "system:menu:query"
            },
            {
              name: "查询列表",
              code: "system:menu:query"
            }
          ]
        }
      ]
    },
    {
      name: "系统功能权限",
      children: [
        {
          name: "更新",
          code: "system:permit:update",
          children: [
            {
              name: "更新",
              code: "system:permit:update"
            }
          ]
        },
        {
          name: "删除",
          code: "system:permit:delete",
          children: [
            {
              name: "删除",
              code: "system:permit:delete"
            }
          ]
        },
        {
          name: "创建",
          code: "system:permit:create",
          children: [
            {
              name: "创建",
              code: "system:permit:create"
            }
          ]
        },
        {
          name: "查询",
          code: "system:permit:query",
          children: [
            {
              name: "查询",
              code: "system:permit:query"
            },
            {
              name: "查询-根据菜单",
              code: "system:permit:query"
            },
            {
              name: "查询列表",
              code: "system:permit:query"
            }
          ]
        }
      ]
    }
  ]
};

// 查询服务下的所有接口
export const getInterfaceList = (predicates: string) => {
  return http.request<interfaceListResponse>(
    "get",
    `/${predicates}/scanner-pre-authorize`
  );
};
