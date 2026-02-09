interface FormItemProps {
  s_rid?: string;
  /** 岗位类别ID */
  sys_post_type_id: number;
  /** 角色名称 */
  roleName: string;
  /** 是否为层级交叉职位 */
  cross_role_flag: boolean;
  /** 是否为职能口角色 */
  function_role_flag: boolean;
  /** 是否为管理口角色 */
  manage_role_flag: boolean;
  /** 描述 */
  description: string;
  /** 0: 不需要打卡 1: 需要打卡 */
  punchIn_flag: number;
  /** 0: 不能自行设置 1: 是否可以自行设置 */
  canSetByUser: number;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
