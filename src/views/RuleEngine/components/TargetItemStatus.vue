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
import StatusDetailsOfEachNode from '@/components/StatusDetailsOfEachNode.vue'
import useCommonConnectionStatus from '@/hooks/useCommonConnectionStatus'
import useI18nTl from '@/hooks/useI18nTl'
import { ConnectionStatus } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { computed, defineProps, PropType } from 'vue'

const props = defineProps({
  target: {
    type: Object as PropType<BridgeItem>,
  },
  isTag: {
    type: Boolean,
    default: false,
  },
})

const { tl } = useI18nTl('RuleEngine')

const { getStatusLabel, getStatusClass } = useCommonConnectionStatus()
const statusData = computed(() => {
  const { target } = props
  const details =
    target?.node_status && Array.isArray(target?.node_status)
      ? target?.node_status.map(({ node, status }) => ({
          node,
          statusLabel: getStatusLabel(status),
          statusClass: getStatusClass(status),
        }))
      : []

  const statusLabel = getStatusLabel(target?.status)
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

<style lang="scss">
.reason-title {
  opacity: 0.6;
  margin: 4px 0 0;
}
.reason-content {
  margin: 4px 0;
}
</style>
