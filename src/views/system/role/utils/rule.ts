import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  roleName: [{ required: true, message: "角色名称为必填项", trigger: "blur" }],
  sys_post_type_id: [
    { required: true, message: "岗位类别为必选项", trigger: "change" }
  ]
});
