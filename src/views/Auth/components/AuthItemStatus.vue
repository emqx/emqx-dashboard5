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
import { ConnectionStatus } from '@/types/enum'
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
