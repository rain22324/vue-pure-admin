<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { transformI18n } from "@/plugins/i18n";
import { IconSelect } from "@/components/ReIcon";
import Segmented from "@/components/ReSegmented";
import { onMounted } from "vue";
import { getDataBaseList } from "@/api/common";
import {
  menuTypeOptions,
  showLinkOptions,
  keepAliveOptions
} from "./utils/enums";
import { dataPermitOptions } from "../utils/enums";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    flag: 0,
    higherMenuOptions: [],
    pid: 0,
    menu_name: "",
    path: "",
    database_name: "",
    order_index: undefined,
    icon: "",
    url: "",
    data_permits: [],
    keep_alive: false,
    disabled_flag: 0
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const dataBaseList = ref([]);

function getRef() {
  return ruleFormRef.value;
}

onMounted(async () => {
  const { data } = await getDataBaseList();
  dataBaseList.value = data.map(item => ({ label: item, value: item }));
});

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="菜单类型">
          <Segmented v-model="newFormInline.flag" :options="menuTypeOptions" />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="上级菜单">
          <el-cascader
            v-model="newFormInline.pid"
            class="w-full"
            :options="newFormInline.higherMenuOptions"
            :props="{
              value: 's_mid',
              label: 'title',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级菜单"
          >
            <template #default="{ node, data }">
              <span>{{ transformI18n(data.title) }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input
            v-model="newFormInline.menu_name"
            clearable
            placeholder="请输入菜单名称"
          />
        </el-form-item>
      </re-col>

      <re-col v-if="newFormInline.flag !== 3" :value="12" :xs="24" :sm="24">
        <el-form-item label="路由路径" prop="path">
          <el-input
            v-model="newFormInline.path"
            clearable
            placeholder="请输入路由路径"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="数据库名" prop="database_name">
          <el-select
            v-model="newFormInline.database_name"
            clearable
            placeholder="请选择数据库名"
          >
            <el-option
              v-for="item in dataBaseList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col
        v-show="newFormInline.flag === 0 || newFormInline.flag === 1"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item
          :label="newFormInline.flag === 1 ? '链接地址' : '组件路径'"
        >
          <el-input
            v-model="newFormInline.url"
            clearable
            :placeholder="
              newFormInline.flag === 1 ? '请输入链接地址' : '请输入组件路径'
            "
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单排序">
          <el-input-number
            v-model="newFormInline.order_index"
            class="w-full!"
            :min="0"
            :max="9999"
            controls-position="right"
            placeholder="请输入菜单排序"
          />
        </el-form-item>
      </re-col>

      <re-col v-show="newFormInline.flag !== 3" :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单图标">
          <IconSelect v-model="newFormInline.icon" class="w-full" />
        </el-form-item>
      </re-col>

      <re-col v-if="newFormInline.flag === 0" :value="12" :xs="24" :sm="24">
        <!-- 按钮级别权限设置 -->
        <el-form-item label="权限标识" prop="data_permits">
          <el-select
            v-model="newFormInline.data_permits"
            multiple
            filterable
            default-first-option
            placeholder="请输入权限标识ID"
          >
            <el-option
              v-for="item in dataPermitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col v-show="newFormInline.flag !== 3" :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单">
          <Segmented
            :modelValue="newFormInline.disabled_flag === 0"
            :options="showLinkOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.disabled_flag = value ? 0 : 1;
              }
            "
          />
        </el-form-item>
      </re-col>

      <re-col v-show="newFormInline.flag < 2" :value="12" :xs="24" :sm="24">
        <el-form-item label="缓存页面">
          <Segmented
            :modelValue="newFormInline.keep_alive"
            :options="keepAliveOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.keep_alive = value;
              }
            "
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
