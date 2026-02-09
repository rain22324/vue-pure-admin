import { http } from "@/utils/http";
import type { permitItem } from "./permit";

type menuItem = {
  children: null | menuItem[];
  create_time: string;
  data_permits: string;
  database_name: string;
  disabled_flag: number;
  flag: number;
  icon: string;
  level: number;
  menu_name: string;
  order_index: number;
  path: string;
  permits: permitItem[];
  pid: number;
  s_mid: number;
  update_time: string;
  url: string;
};

type MenuResponse = {
  code: number;
  data: {
    currPage: number;
    list: menuItem[];
    pageSize: number;
    totalCount: number;
    totalPage: number;
  };
};

// 查询所有菜单
export const getMenus = () => {
  return http.request<MenuResponse>("get", "/system/menu/ids");
};

type MenuTreeResponse = {
  msg: string;
  code: number;
  data: menuItem[];
};

// 查询菜单树
export const getMenuTree = () => {
  return http.request<MenuTreeResponse>("get", "/system/menu/tree");
};

type createMenuData = {
  menu_name: string;
  pid: number;
  path: string;
  database_name: string;
  disabled_flag: number;
  icon: string;
  order_index: number;
  url: string;
  flag: number;
  data_permits: number[];
  keep_alive: boolean;
};

// 创建菜单
export const createMenu = (data?: createMenuData) => {
  return http.request("post", "/system/menu/create", { data });
};

// 删除菜单
export const deleteMenu = (s_mid: string) => {
  return http.request("delete", `/system/menu/${s_mid}`);
};

// 更新菜单
export const updateMenu = (s_mid: string, data?: createMenuData) => {
  return http.request("put", `/system/menu/${s_mid}`, { data });
};
