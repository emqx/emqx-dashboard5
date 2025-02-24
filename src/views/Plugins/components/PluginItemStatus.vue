<template>
  <StatusDetailsOfEachNode :status-data="statusData" :is-tag="isTag" />
</template>

<script lang="ts">
export default defineComponent({
  name: 'PluginItemStatus',
})
</script>

<script setup lang="ts">
import { PluginItem } from '@/types/plugin'
import { NodeStatusClass, PluginStatus } from '@/types/enum'

const props = defineProps({
  pluginData: {
    type: Object as PropType<PluginItem>,
    required: true,
  },
  isTag: {
    type: Boolean,
    default: false,
  },
})

const { tl } = useI18nTl('Plugins')
const dotClass = (status: PluginStatus) =>
  ({
    [PluginStatus.Running]: NodeStatusClass.Success,
    [PluginStatus.Stopped]: NodeStatusClass.Danger,
  })[status] || NodeStatusClass.Danger

const statusText = (status: PluginStatus) =>
  ({
    [PluginStatus.Running]: tl('active'),
    [PluginStatus.Stopped]: tl('inactive'),
  })[status] || 'unknown'

const { getTheWorstStatus } = usePluginItem()

const statusData = computed(() => {
  const { pluginData } = props
  const details =
    pluginData?.running_status && Array.isArray(pluginData?.running_status)
      ? pluginData?.running_status.map(({ node, status }) => ({
          node,
          statusLabel: statusText(status),
          statusClass: dotClass(status),
        }))
      : []

  const statusLabel = statusText(getTheWorstStatus(pluginData))
  const statusClass = dotClass(getTheWorstStatus(pluginData))
  return { details, statusLabel, statusClass }
})
</script>
