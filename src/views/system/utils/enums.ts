const dataPermitOptions: Array<{ label: string; value: number }> = [
  { label: "无", value: 0 },
  { label: "仅本人数据", value: 1 },
  { label: "本人所在一级项目中的二级项目", value: 10 },
  { label: "本人所在的二级项目", value: 20 },
  { label: "本人所在部门中的二级项目", value: 30 },
  { label: "本人所在部门及下级部门中的二级项目", value: 40 },
  { label: "本人所在一级部门及下级部门中的二级项目", value: 50 },
  { label: "本人所在二级部门及下级部门中的二级项目", value: 60 },
  { label: "本人所在三级部门及下级部门中的二级项目", value: 70 },
  { label: "职能口所管理的二级项目", value: 80 },
  { label: "所在公司中的二级项目", value: 90 },
  { label: "全部数据", value: 100 }
];

export { dataPermitOptions };
