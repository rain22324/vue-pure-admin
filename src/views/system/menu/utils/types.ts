interface FormItemProps {
  /** 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）*/
  flag: number;
  higherMenuOptions: Record<string, unknown>[];
  pid: number;
  menu_name: string;
  path: string;
  database_name: string;
  order_index: number;
  icon: string;
  url: string;
  data_permits: number[];
  keep_alive: boolean;
  disabled_flag: number;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
