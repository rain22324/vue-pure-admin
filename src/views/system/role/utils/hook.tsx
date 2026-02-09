import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole
} from "@/api/system/role";
import { getMenuTree } from "@/api/system/menus";
import {
  getRoleMenu,
  updateRoleMenu,
  deleteRoleMenu,
  createRoleMenu
} from "@/api/system/roleMenu";
import {
  getRolePermitByRoleId,
  createRolePermit,
  deleteRolePermitByRoleId
} from "@/api/system/rolePermit";
import { dataPermitOptions } from "../../utils/enums";
import { type Ref, reactive, ref, onMounted, h, toRaw, watch } from "vue";

export function useRole(treeRef: Ref) {
  const form = reactive({
    roleName: ""
  });
  const curRow = ref();
  const formRef = ref();
  const dataList = ref([]);
  const treeData = ref([]);
  const isShow = ref(false);
  const loading = ref(true);
  const isLinkage = ref(false);
  const treeSearchValue = ref();
  const isExpandAll = ref(true);
  const treeProps = {
    value: "s_mid",
    label: "menu_name",
    children: "children"
  };
  const rolePermissions = ref<Record<string, number>>({});
  const roleMenuIds = ref<Record<string, string>>({});
  const roleFunctionPermissions = ref<Record<string, number[]>>({});
  const roleFunctionPermitIds = ref<Record<string, number>>({}); // key: mid-pid
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "角色名称",
      prop: "roleName"
    },
    {
      label: "层级交叉职位",
      prop: "cross_role_flag",
      cellRenderer: ({ row }) => (
        <span>{row.cross_role_flag ? "是" : "否"}</span>
      )
    },
    {
      label: "职能口角色",
      prop: "function_role_flag",
      cellRenderer: ({ row }) => (
        <span>{row.function_role_flag ? "是" : "否"}</span>
      )
    },
    {
      label: "管理口角色",
      prop: "manage_role_flag",
      cellRenderer: ({ row }) => (
        <span>{row.manage_role_flag ? "是" : "否"}</span>
      )
    },
    {
      label: "需要打卡",
      prop: "punchIn_flag",
      cellRenderer: ({ row }) => (
        <span>{row.punchIn_flag === 1 ? "是" : "否"}</span>
      )
    },
    {
      label: "是否可以自行设置",
      prop: "canSetByUser",
      cellRenderer: ({ row }) => (
        <span>{row.canSetByUser === 1 ? "是" : "否"}</span>
      )
    },
    {
      label: "描述",
      prop: "description"
    },
    {
      label: "创建时间",
      prop: "create_time",
      minWidth: 160,
      formatter: ({ create_time }) =>
        dayjs(create_time).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  async function handleDelete(row) {
    try {
      const result = (await deleteRole(row.s_rid)) as any;
      if (result.code === 0) {
        message(`删除角色"${row.roleName}"成功`, {
          type: "success"
        });
        onSearch();
      } else {
        message(`删除失败: ${result.msg || "未知错误"}`, {
          type: "error"
        });
      }
    } catch (e) {
      console.error(e);
      message("删除失败，请稍后重试", {
        type: "error"
      });
    }
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getRoleList({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        ...toRaw(form)
      });
      dataList.value = data.list;
      pagination.total = data.totalCount;
      pagination.pageSize = data.pageSize;
      pagination.currentPage = data.currPage;
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: any) {
    addDialog({
      title: `${title}角色`,
      props: {
        formInline: {
          s_rid: row?.s_rid ?? "",
          sys_post_type_id: row?.sys_post_type_id ?? null,
          roleName: row?.roleName ?? "",
          cross_role_flag: row?.cross_role_flag ?? false,
          function_role_flag: row?.function_role_flag ?? false,
          manage_role_flag: row?.manage_role_flag ?? false,
          description: row?.description ?? "",
          punchIn_flag: row?.punchIn_flag ?? 0,
          canSetByUser: row?.canSetByUser ?? 0
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: ({ options }) =>
        h(editForm, {
          ref: formRef,
          formInline: options.props.formInline
        }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        FormRef.validate(async valid => {
          if (valid) {
            try {
              let result;
              if (title === "新增") {
                result = (await createRole(toRaw(curData))) as any;
              } else {
                result = (await updateRole(
                  curData.s_rid,
                  toRaw(curData)
                )) as any;
              }

              if (result.code === 0) {
                message(`${title}角色成功`, {
                  type: "success"
                });
                done(); // 关闭弹框
                if (title === "新增") {
                  pagination.currentPage = 1;
                }
                onSearch(); // 刷新表格数据
              } else {
                message(`${title}角色失败: ${result.msg || "未知错误"}`, {
                  type: "error"
                });
              }
            } catch (e) {
              console.error(e);
              message(`${title}角色失败，请稍后重试`, {
                type: "error"
              });
            }
          }
        });
      }
    });
  }

  /** 菜单权限 */
  async function handleMenu(row?: any) {
    const { s_rid } = row;
    if (s_rid) {
      curRow.value = row;
      isShow.value = true;
      const { data } = await getRoleMenu(s_rid);
      const permissions = {};
      const ids = {};
      data.forEach(item => {
        permissions[item.s_mid] = item.data_permit_type;
        ids[item.s_mid] = item.id;
      });
      rolePermissions.value = permissions;
      roleMenuIds.value = ids;
      treeRef.value.setCheckedKeys(data.map(item => item.s_mid));

      // 获取当前角色的功能权限
      const { data: rolePermits } = (await getRolePermitByRoleId(s_rid)) as any;
      const functionPerms = {};
      const functionPermitIds = {};
      rolePermits.forEach(item => {
        if (!functionPerms[item.s_mid]) functionPerms[item.s_mid] = [];
        functionPerms[item.s_mid].push(item.s_pid);
        functionPermitIds[`${item.s_mid}-${item.s_pid}`] = item.id;
      });
      roleFunctionPermissions.value = functionPerms;
      roleFunctionPermitIds.value = functionPermitIds;
    } else {
      curRow.value = null;
      isShow.value = false;
    }
  }

  /** 点击菜单复选框 */
  async function handleCheck(data, { checkedKeys }) {
    const { s_rid } = curRow.value;
    const s_mid = data.s_mid;
    const isChecked = checkedKeys.includes(s_mid);

    if (isLinkage.value) {
      // 如果开启了父子联动，因为接口改为单条更新，这里需要循环处理或全量对比
      // 为了符合“每点一下调用一下接口”的选择，我们更新所有选中的节点状态
      const allSelected = [...checkedKeys];

      // 更新本地权限 Map 并调用接口 (注意：频繁调用建议后端支持批量，这里先按单条逻辑改)
      for (const mid of allSelected) {
        if (rolePermissions.value[mid] === undefined) {
          const res = (await createRoleMenu({
            s_rid,
            s_mid: mid,
            data_permit_type: 100
          })) as any;
          if (res.code === 0) {
            rolePermissions.value[mid] = 100;
            roleMenuIds.value[mid] = res.data.id;
          }
        }
      }

      // 处理取消勾选的节点
      const currentPermitKeys = Object.keys(rolePermissions.value);
      for (const mid of currentPermitKeys) {
        if (!allSelected.includes(mid)) {
          const id = roleMenuIds.value[mid];
          if (id) {
            const res = (await deleteRoleMenu(id)) as any;
            if (res.code === 0) {
              delete rolePermissions.value[mid];
              delete roleMenuIds.value[mid];
              // 同时也删除该菜单下的所有功能权限缓存
              delete roleFunctionPermissions.value[mid];
              Object.keys(roleFunctionPermitIds.value).forEach(key => {
                if (key.startsWith(`${mid}-`)) {
                  delete roleFunctionPermitIds.value[key];
                }
              });
            }
          }
        }
      }
    } else {
      // 未开启联动，仅处理当前节点
      if (isChecked) {
        const res = (await createRoleMenu({
          s_rid,
          s_mid,
          data_permit_type: 100
        })) as any;
        if (res.code === 0) {
          rolePermissions.value[s_mid] = 100;
          roleMenuIds.value[s_mid] = res.data.id;
          message(`已开启菜单 "${transformI18n(data.menu_name)}" 的权限`, {
            type: "success"
          });
        }
      } else {
        const id = roleMenuIds.value[s_mid];
        if (id) {
          const res = (await deleteRoleMenu(id)) as any;
          if (res.code === 0) {
            delete rolePermissions.value[s_mid];
            delete roleMenuIds.value[s_mid];
            delete roleFunctionPermissions.value[s_mid];
            Object.keys(roleFunctionPermitIds.value).forEach(key => {
              if (key.startsWith(`${s_mid}-`)) {
                delete roleFunctionPermitIds.value[key];
              }
            });
            message(`已关闭菜单 "${transformI18n(data.menu_name)}" 的权限`, {
              type: "success"
            });
          }
        }
      }
    }
  }

  /** 数据权限下拉改变 */
  async function handleDataPermitChange(nodeData) {
    const { s_rid } = curRow.value;
    const s_mid = nodeData.s_mid;
    const data_permit_type = rolePermissions.value[s_mid];

    const res = (await updateRoleMenu({
      id: roleMenuIds.value[s_mid],
      s_rid,
      s_mid,
      data_permit_type
    })) as any;
    if (res.code === 0) {
      message(`已更新菜单 "${transformI18n(nodeData.menu_name)}" 的数据权限`, {
        type: "success"
      });
    }
  }

  /** 点击功能权限复选框 */
  async function handleRoleFunctionPermitChange(
    nodeData: any,
    s_pid: number,
    checked: boolean
  ) {
    const { s_rid } = curRow.value;
    const s_mid = nodeData.s_mid;
    const key = `${s_mid}-${s_pid}`;

    if (checked) {
      const res = (await createRolePermit({
        s_rid: Number(s_rid),
        s_mid: Number(s_mid),
        s_pid: s_pid
      })) as any;
      if (res.code === 0) {
        roleFunctionPermitIds.value[key] = res.data.id;
        if (!roleFunctionPermissions.value[s_mid]) {
          roleFunctionPermissions.value[s_mid] = [];
        }
        roleFunctionPermissions.value[s_mid].push(s_pid);
        message(`已分配功能权限: ${res.data.permit_name || "成功"}`, {
          type: "success"
        });
      }
    } else {
      const id = roleFunctionPermitIds.value[key];
      if (id) {
        const res = (await deleteRolePermitByRoleId(String(id))) as any;
        if (res.code === 0) {
          delete roleFunctionPermitIds.value[key];
          const index = roleFunctionPermissions.value[s_mid]?.indexOf(s_pid);
          if (index > -1) {
            roleFunctionPermissions.value[s_mid].splice(index, 1);
          }
          message(`已取消功能权限`, { type: "success" });
        }
      }
    }
  }

  /** 高亮当前权限选中行 */
  function rowStyle({ row: { s_rid } }) {
    return {
      cursor: "pointer",
      background:
        s_rid === curRow.value?.s_rid ? "var(--el-fill-color-light)" : ""
    };
  }

  /** 获取当前节点可选的数据权限选项 */
  function getAvailableDataPermitOptions(data: any) {
    if (!data.data_permits) return [];
    try {
      const availableValues = JSON.parse(data.data_permits);
      if (!Array.isArray(availableValues)) return [];
      return dataPermitOptions.filter(option =>
        availableValues.includes(option.value)
      );
    } catch (e) {
      console.error("解析 data_permits 失败:", e);
      return [];
    }
  }

  const onQueryChanged = (query: string) => {
    treeRef.value!.filter(query);
  };

  const filterMethod = (query: string, node) => {
    return transformI18n(node.menu_name)!.includes(query);
  };

  watch(isExpandAll, val => {
    const nodes = treeRef.value.store.nodesMap;
    for (const i in nodes) {
      nodes[i].expanded = val;
    }
  });

  onMounted(async () => {
    onSearch();
    const { data } = await getMenuTree();
    treeData.value = data;
  });

  return {
    form,
    isShow,
    curRow,
    loading,
    columns,
    rowStyle,
    dataList,
    treeData,
    treeProps,
    isLinkage,
    pagination,
    isExpandAll,
    treeSearchValue,
    onSearch,
    resetForm,
    openDialog,
    handleMenu,
    handleDelete,
    filterMethod,
    transformI18n,
    onQueryChanged,
    handleCheck,
    roleMenuIds,
    rolePermissions,
    roleFunctionPermissions,
    handleRoleFunctionPermitChange,
    dataPermitOptions,
    handleDataPermitChange,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    getAvailableDataPermitOptions
  };
}
