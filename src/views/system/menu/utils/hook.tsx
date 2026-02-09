import editForm from "../form.vue";
import permitForm from "../permit.vue";
import { message } from "@/utils/message";
import {
  getMenuTree,
  createMenu,
  updateMenu,
  deleteMenu
} from "@/api/system/menus";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "../utils/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { cloneDeep, isAllEmpty, deviceDetection } from "@pureadmin/utils";

export function useMenu() {
  const form = reactive({
    menu_name: ""
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  const getMenuType = (type, text = false) => {
    switch (type) {
      case 0:
        return text ? "菜单" : "primary";
      case 1:
        return text ? "iframe" : "warning";
      case 2:
        return text ? "外链" : "danger";
      case 3:
        return text ? "按钮" : "info";
    }
  };

  const columns: TableColumnList = [
    {
      label: "菜单名称",
      prop: "menu_name",
      align: "left",
      cellRenderer: ({ row }) => (
        <>
          <span class="inline-block mr-1">
            {h(useRenderIcon(row.icon), {
              style: { paddingTop: "1px" }
            })}
          </span>
          <span>{transformI18n(row.menu_name)}</span>
        </>
      )
    },
    {
      label: "菜单类型",
      prop: "flag",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} type={getMenuType(row.flag)} effect="plain">
          {getMenuType(row.flag, true)}
        </el-tag>
      )
    },
    {
      label: "路由路径",
      prop: "path"
    },
    {
      label: "组件路径",
      prop: "url",
      formatter: ({ path, url }) => (isAllEmpty(url) ? path : url)
    },
    {
      label: "权限标识",
      prop: "data_permits"
    },
    {
      label: "排序",
      prop: "order_index",
      width: 100
    },
    {
      label: "隐藏",
      prop: "disabled_flag",
      formatter: ({ disabled_flag }) => (disabled_flag === 1 ? "是" : "否"),
      width: 100
    },
    {
      label: "操作",
      fixed: "right",
      width: 320,
      slot: "operation"
    }
  ];

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getMenuTree();
    let newData = data;

    if (!isAllEmpty(form.menu_name)) {
      const filterNode = (nodes: any[], query: string): any[] => {
        return nodes.reduce((permits, node) => {
          const titleMatches = transformI18n(node.menu_name).includes(query);
          const children = node.children
            ? filterNode(node.children, query)
            : [];

          if (titleMatches || children.length > 0) {
            permits.push({
              ...node,
              children: children.length > 0 ? children : node.children
            });
          }
          return permits;
        }, []);
      };
      newData = filterNode(newData, form.menu_name);
    }

    dataList.value = newData;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  function formatHigherMenuOptions(treeList) {
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].title = transformI18n(treeList[i].menu_name);
      formatHigherMenuOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", row?: any) {
    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: {
          flag: row?.flag ?? 0,
          higherMenuOptions: formatHigherMenuOptions(cloneDeep(dataList.value)),
          pid: row?.pid ?? 0,
          menu_name: row?.menu_name ?? "",
          path: row?.path ?? "",
          database_name: row?.database_name ?? "",
          order_index: row?.order_index ?? undefined,
          icon: row?.icon ?? "",
          url: row?.url ?? "",
          data_permits: row?.data_permits
            ? typeof row.data_permits === "string"
              ? JSON.parse(row.data_permits)
              : row.data_permits
            : [],
          keep_alive: row?.keep_alive ?? false,
          disabled_flag: row?.disabled_flag ?? 0
        }
      },
      width: "45%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(
            `您${title}了菜单名称为${transformI18n(curData.menu_name)}的这条数据`,
            {
              type: "success"
            }
          );
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            const { higherMenuOptions: _, ...restData } = curData;
            if (title === "新增") {
              await createMenu(restData);
              chores();
            } else {
              await updateMenu(row.s_mid, restData);
              chores();
            }
          }
        });
      }
    });
  }

  function openPermitDialog(row: any) {
    addDialog({
      title: `权限配置 - ${transformI18n(row.menu_name)}`,
      width: "55%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => h(permitForm, { menuRow: row })
    });
  }

  async function handleDelete(row) {
    await deleteMenu(row.s_mid);
    message(`您删除了菜单名称为${transformI18n(row.menu_name)}的这条数据`, {
      type: "success"
    });
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改菜单 */
    openDialog,
    /** 删除菜单 */
    handleDelete,
    openPermitDialog,
    handleSelectionChange
  };
}
