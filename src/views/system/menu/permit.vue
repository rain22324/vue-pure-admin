<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getPermitByMenuId,
  addPermit,
  updatePermit,
  deletePermit,
  getServiceDetails,
  getInterfaceList
} from "@/api/system/permit";
import { message } from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "~icons/ri/add-circle-line";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";

export interface PermitProps {
  menuRow: any;
}

const props = defineProps<PermitProps>();

const loading = ref(true);
const dataList = ref([]);
const dialogVisible = ref(false);
const formRef = ref();
const isEdit = ref(false);

const serviceOptions = ref([]);
const interfaceOptions = ref([]);
const selectedService = ref("");
const selectedInterface = ref([]);

const permitForm = ref({
  s_pid: null,
  s_mid: props.menuRow.s_mid,
  permit_name: "",
  permit_code: ""
});

const rules = {
  permit_name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
  permit_code: [{ required: true, message: "请输入权限编码", trigger: "blur" }]
};

async function fetchServices() {
  const res: any = await getServiceDetails();
  if (res.code === 0) {
    serviceOptions.value = res.data || [];
  }
}

async function handleServiceChange(val) {
  selectedInterface.value = [];
  interfaceOptions.value = [];
  permitForm.value.permit_name = "";
  permitForm.value.permit_code = "";
  if (val) {
    const service = serviceOptions.value.find(s => s.id === val);
    if (service && service.predicates) {
      const res: any = await getInterfaceList(service.predicates);
      if (res.code === 0) {
        interfaceOptions.value = formatInterfaceData(res.data || []);
      }
    }
  }
}

function formatInterfaceData(data) {
  return data.map(item => {
    const newItem = {
      ...item,
      value: item.code || item.name,
      label: item.name
    };
    if (item.children && item.children.length > 0) {
      newItem.children = formatInterfaceData(item.children);
    }
    return newItem;
  });
}

function handleInterfaceChange(val) {
  if (val && val.length > 0) {
    // Find the leaf node
    let currentOptions = interfaceOptions.value;
    let selectedNode = null;
    for (const value of val) {
      selectedNode = currentOptions.find(item => item.value === value);
      if (selectedNode && selectedNode.children) {
        currentOptions = selectedNode.children;
      }
    }
    if (selectedNode) {
      permitForm.value.permit_name = selectedNode.name;
      permitForm.value.permit_code = selectedNode.code;
    }
  }
}

async function fetchPermits() {
  loading.value = true;
  try {
    const res: any = await getPermitByMenuId(props.menuRow.s_mid);
    if (res.code === 0) {
      dataList.value = res.data || [];
    } else {
      message(res.msg, { type: "error" });
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function handleAdd() {
  isEdit.value = false;
  selectedService.value = "";
  selectedInterface.value = [];
  interfaceOptions.value = [];
  permitForm.value = {
    s_pid: null,
    s_mid: props.menuRow.s_mid,
    permit_name: "",
    permit_code: ""
  };
  dialogVisible.value = true;
  fetchServices();
}

function handleEdit(row) {
  isEdit.value = true;
  selectedService.value = "";
  selectedInterface.value = [];
  interfaceOptions.value = [];
  permitForm.value = { ...row };
  dialogVisible.value = true;
}

async function handleDelete(row) {
  try {
    await deletePermit(row.s_pid);
    message("删除成功", { type: "success" });
    fetchPermits();
  } catch (error) {
    console.error(error);
  }
}

async function submitForm() {
  formRef.value.validate(async valid => {
    if (valid) {
      try {
        if (isEdit.value) {
          await updatePermit(permitForm.value.s_pid, permitForm.value);
          message("修改成功", { type: "success" });
        } else {
          await addPermit(permitForm.value);
          message("新增成功", { type: "success" });
        }
        dialogVisible.value = false;
        fetchPermits();
      } catch (error) {
        console.error(error);
      }
    }
  });
}

onMounted(() => {
  fetchPermits();
});
</script>

<template>
  <div class="permit-container">
    <div class="mb-4">
      <el-button
        type="primary"
        :icon="useRenderIcon(AddFill)"
        @click="handleAdd"
      >
        新增权限
      </el-button>
    </div>

    <el-table v-loading="loading" :data="dataList" border style="width: 100%">
      <el-table-column prop="permit_name" label="权限名称" min-width="150" />
      <el-table-column prop="permit_code" label="权限编码" min-width="200" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            :icon="useRenderIcon(EditPen)"
            @click="handleEdit(row)"
          >
            修改
          </el-button>
          <el-popconfirm
            :title="`是否确认删除权限 ${row.permit_name}？`"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button link type="danger" :icon="useRenderIcon(Delete)">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '修改权限' : '新增权限'"
      width="400px"
      append-to-body
    >
      <el-form
        ref="formRef"
        :model="permitForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="系统服务">
          <el-select
            v-model="selectedService"
            placeholder="请选择系统服务"
            class="w-full"
            clearable
            @change="handleServiceChange"
          >
            <el-option
              v-for="item in serviceOptions"
              :key="item.id"
              :label="`${item.module} (${item.id})`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="接口选择">
          <el-cascader
            v-model="selectedInterface"
            :options="interfaceOptions"
            :props="{ label: 'label', value: 'value', children: 'children' }"
            placeholder="请选择接口"
            class="w-full"
            clearable
            filterable
            @change="handleInterfaceChange"
          />
        </el-form-item>
        <el-form-item label="权限名称" prop="permit_name">
          <el-input
            v-model="permitForm.permit_name"
            placeholder="选择接口后自动填充"
            disabled
          />
        </el-form-item>
        <el-form-item label="权限编码" prop="permit_code">
          <el-input
            v-model="permitForm.permit_code"
            placeholder="选择接口后自动填充"
            disabled
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.permit-container {
  padding: 10px;
}
</style>
