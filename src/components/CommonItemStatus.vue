<template>
  <StatusDetailsOfEachNode :status-data="statusData" :is-tag="isTag" />
</template>

<script setup lang="ts">
import { ConnectionStatus } from '@/types/enum'

const props = defineProps<{
  metrics: {
    status?: ConnectionStatus
    node_status?: Array<{ node: string; status: ConnectionStatus }>
  }
  isTag?: boolean
}>()

const { getStatusClass, getStatusLabel } = useCommonConnectionStatus()

const statusData = computed(() => {
  const { metrics } = props
  const details =
    metrics?.node_status && Array.isArray(metrics?.node_status)
      ? metrics?.node_status.map(({ node, status }) => ({
          node,
          statusLabel: getStatusLabel(status as ConnectionStatus),
          statusClass: getStatusClass(status as ConnectionStatus),
        }))
      : []

  const statusLabel = getStatusLabel(metrics?.status)
  const statusClass = getStatusClass(metrics?.status)
  return { details, statusLabel, statusClass }
})
</script>
