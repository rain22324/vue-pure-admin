<script setup lang="ts">
import { ref, onMounted } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { getAllPostTypeList } from "@/api/system/postType";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    sys_post_type_id: null,
    roleName: "",
    cross_role_flag: false,
    function_role_flag: false,
    manage_role_flag: false,
    description: "",
    punchIn_flag: 0,
    canSetByUser: 0
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const postTypeList = ref([]);

function getRef() {
  return ruleFormRef.value;
}

onMounted(async () => {
  const { data } = await getAllPostTypeList();
  postTypeList.value = data;
});

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="130px"
  >
    <el-form-item label="角色名称" prop="roleName">
      <el-input
        v-model="newFormInline.roleName"
        clearable
        placeholder="请输入角色名称"
      />
    </el-form-item>

    <el-form-item label="岗位类别" prop="sys_post_type_id">
      <el-select
        v-model="newFormInline.sys_post_type_id"
        placeholder="请选择岗位类别"
        class="w-full"
        clearable
      >
        <el-option
          v-for="item in postTypeList"
          :key="item.sys_post_type_id"
          :label="item.name"
          :value="item.sys_post_type_id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="层级交叉职位">
      <el-switch
        v-model="newFormInline.cross_role_flag"
        inline-prompt
        active-text="是"
        inactive-text="否"
      />
    </el-form-item>

    <el-form-item label="职能口角色">
      <el-switch
        v-model="newFormInline.function_role_flag"
        inline-prompt
        active-text="是"
        inactive-text="否"
      />
    </el-form-item>

    <el-form-item label="管理口角色">
      <el-switch
        v-model="newFormInline.manage_role_flag"
        inline-prompt
        active-text="是"
        inactive-text="否"
      />
    </el-form-item>

    <el-form-item label="需要打卡">
      <el-switch
        v-model="newFormInline.punchIn_flag"
        :active-value="1"
        :inactive-value="0"
        inline-prompt
        active-text="是"
        inactive-text="否"
      />
    </el-form-item>

    <el-form-item label="是否可以自行设置">
      <el-switch
        v-model="newFormInline.canSetByUser"
        :active-value="1"
        :inactive-value="0"
        inline-prompt
        active-text="是"
        inactive-text="否"
      />
    </el-form-item>

    <el-form-item label="描述">
      <el-input
        v-model="newFormInline.description"
        placeholder="请输入描述内容"
        type="textarea"
      />
    </el-form-item>
  </el-form>
</template>
