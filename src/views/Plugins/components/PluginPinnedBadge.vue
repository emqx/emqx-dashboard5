<template>
  <el-tooltip v-if="pluginData.pinned === true" :content="hint" placement="top">
    <el-tag :size="size" type="info" effect="light">{{ tl('pinned') }}</el-tag>
  </el-tooltip>
</template>

<script setup lang="ts">
import type { PluginItem } from '@/types/plugin'
import type { TagProps } from 'element-plus'

const props = withDefaults(defineProps<{ pluginData: PluginItem; size?: TagProps['size'] }>(), {
  size: 'small',
})
const { tl } = useI18nTl('Plugins')
const hint = computed(() =>
  tl('pinnedPluginHint', {
    nameVsn: `${props.pluginData.name}-${props.pluginData.rel_vsn}`,
  }),
)
</script>
