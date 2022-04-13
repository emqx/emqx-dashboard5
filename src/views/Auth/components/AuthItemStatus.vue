<template>
  <StatusDetailsOfEachNode :status-data="statusData" :is-tag="isTag" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthItemStatus',
})
</script>

<script setup lang="ts">
import { defineProps, PropType, computed } from 'vue'
import { ConnectionStatus, NodeStatusClass } from '@/types/enum'
import useI18nTl from '@/hooks/useI18nTl'
import useCommonConnectionStatus from '@/hooks/useCommonConnectionStatus'
import { Metrics } from 'src/types/auth'
import StatusDetailsOfEachNode from '@/components/StatusDetailsOfEachNode.vue'

const props = defineProps({
  enable: {
    type: Boolean,
  },
  metrics: {
    type: Object as PropType<Metrics>,
  },
  isTag: {
    type: Boolean,
    default: false,
  },
})

const { tl } = useI18nTl('Base')
const { getStatusClass: getConnectionStatusClass, getStatusLabel: getConnectionLabel } =
  useCommonConnectionStatus()

const getStatusClass = (enable: boolean, status: ConnectionStatus) => {
  if (status === ConnectionStatus.Connecting) {
    return getConnectionStatusClass(status)
  }
  return enable ? NodeStatusClass.Success : NodeStatusClass.Danger
}

const getStatusText = (enable: boolean, status: ConnectionStatus) => {
  if (status === ConnectionStatus.Connecting) {
    return getConnectionLabel(status)
  }
  return enable ? tl('enable') : tl('disable')
}

const statusData = computed(() => {
  const { enable, metrics } = props
  const status: ConnectionStatus =
    (metrics?.status as ConnectionStatus) || ConnectionStatus.Disconnected
  const details =
    metrics?.node_status && Array.isArray(metrics?.node_status)
      ? metrics?.node_status.map(({ node, status }) => ({
          node,
          statusLabel: getConnectionLabel(status as ConnectionStatus),
          statusClass: getConnectionStatusClass(status as ConnectionStatus),
        }))
      : []

  const statusLabel = getStatusText(enable, status)
  const statusClass = getStatusClass(enable, status)
  return { details, statusLabel, statusClass }
})
</script>

<style lang="scss"></style>
