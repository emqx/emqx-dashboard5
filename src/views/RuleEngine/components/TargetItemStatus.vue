<!-- Target can be bridge, connector or action -->
<template>
  <StatusDetailsOfEachNode
    :status-data="statusData"
    :is-tag="isTag"
    :show-status-detail="showDetailList"
  >
    <template #extra-content v-if="needShowStatusReason">
      <p class="reason-title">{{ tl('statusReason') }}</p>
      <p class="reason-content">{{ target?.status_reason }}</p>
    </template>
  </StatusDetailsOfEachNode>
</template>

<script setup lang="ts">
import { ConnectionStatus } from '@/types/enum'
import { BridgeItem } from '@/types/rule'

const props = defineProps({
  target: {
    type: Object as PropType<BridgeItem>,
  },
  type: {
    type: String as PropType<'connector' | 'action'>,
  },
  isTag: {
    type: Boolean,
    default: false,
  },
})

const { tl } = useI18nTl('RuleEngine')
const { getStatusLabel: getConnectorStatusLabel, getStatusClass } = useCommonConnectionStatus()
const { getActionStatusLabel } = useActionAndSourceStatus()

const statusData = computed(() => {
  const { target } = props
  const details =
    target?.node_status && Array.isArray(target?.node_status)
      ? target?.node_status.map(({ node, status }) => ({
          node,
          statusLabel: getConnectorStatusLabel(status),
          statusClass: getStatusClass(status),
        }))
      : []

  let statusLabel = ''
  if (props.type === 'connector') {
    statusLabel = getConnectorStatusLabel(target?.status)
  } else {
    statusLabel = getActionStatusLabel(target?.status)
  }

  const statusClass = getStatusClass(target?.status)
  return { details, statusLabel, statusClass }
})

const showDetailList = computed(() => props.target?.status === ConnectionStatus.Inconsistent)
const abnormalStatuses = [
  ConnectionStatus.Inconsistent,
  ConnectionStatus.Connecting,
  ConnectionStatus.Disconnected,
]
const needShowStatusReason = computed(() => {
  const { target } = props
  return target?.status && abnormalStatuses.includes(target.status)
})
</script>
