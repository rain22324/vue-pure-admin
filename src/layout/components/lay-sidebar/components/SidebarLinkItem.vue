<script setup lang="ts">
import { computed } from "vue";
import { menuType } from "@/layout/types";

const props = defineProps<{
  to: menuType;
}>();

const isExternalLink = computed(() => /^http(s?):\/\//.test(props.to.name));
const getLinkProps = (item: menuType) => {
  if (isExternalLink.value) {
    return {
      href: item.name,
      target: "_blank",
      rel: "noopener"
    };
  }
  return {
    to: item
  };
};
</script>

<template>
  <component
    :is="isExternalLink ? 'a' : 'router-link'"
    v-bind="getLinkProps(to)"
  >
    <slot />
  </component>
</template>
