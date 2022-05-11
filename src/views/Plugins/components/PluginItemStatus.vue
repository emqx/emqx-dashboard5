<template>
  <StatusDetailsOfEachNode :status-data="statusData" :is-tag="isTag" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PluginItemStatus',
})
</script>

<script setup lang="ts">
import { defineProps, PropType, computed } from 'vue'
import StatusDetailsOfEachNode from '@/components/StatusDetailsOfEachNode.vue'
import { PluginItem } from '@/types/plugin'
import usePluginItem from '@/hooks/Plugins/usePluginItem'
import { NodeStatusClass, PluginStatus } from '@/types/enum'
import useI18nTl from '@/hooks/useI18nTl'

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
  }[status] || NodeStatusClass.Danger)

const statusText = (status: PluginStatus) =>
  ({
    [PluginStatus.Running]: tl('active'),
    [PluginStatus.Stopped]: tl('inactive'),
  }[status] || 'unknown')

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
