<template>
  <el-tooltip :content="tooltipCon" placement="top" :hide-after="0">
    <IconButton class="delete-button" :icon="Delete" :disabled="disableButton" v-bind="$attrs" />
  </el-tooltip>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'

const props = defineProps<{
  disabled?: boolean
  tooltipContent?: string
}>()

const { tl } = useI18nTl('Base')

const app = getCurrentInstance()
const hasPermission = app?.appContext.config.globalProperties.$hasPermission

const disableButton = computed(() => {
  if (props.disabled) {
    return props.disabled
  }
  if (hasPermission) {
    return !hasPermission('delete')
  }
  return false
})

const tooltipCon = computed(() => {
  return props.tooltipContent ?? tl('delete')
})
</script>

<style lang="scss">
.el-button.is-plain.delete-button {
  --el-button-hover-text-color: var(--el-color-danger);
  &:hover {
    --el-button-hover-border-color: var(--el-color-danger);
  }
}
</style>
