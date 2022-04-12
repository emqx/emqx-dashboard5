<template>
  <StatusDetailsOfEachNode :status-data="statusData" :is-tag="isTag" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BridgeItemStatus',
})
</script>

<script setup lang="ts">
import { computed, defineProps, PropType } from 'vue'
import StatusDetailsOfEachNode from '@/components/StatusDetailsOfEachNode.vue'
import { BridgeItem } from '@/types/rule'
import useCommonConnectionStatus from '@/hooks/useCommonConnectionStatus'
import { ConnectionStatus, NodeStatusClass } from '@/types/enum'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  bridge: {
    type: Object as PropType<BridgeItem>,
  },
  isTag: {
    type: Boolean,
    default: false,
  },
})

const { getStatusLabel, getStatusClass } = useCommonConnectionStatus()
const { t } = useI18n()
const statusData = computed(() => {
  const { bridge } = props
  const details =
    bridge?.node_status && Array.isArray(bridge?.node_status)
      ? bridge?.node_status.map(({ node, status }) => ({
          node,
          statusLabel: getStatusLabel(status),
          statusClass: getStatusClass(status),
        }))
      : []

  const statusLabel = !bridge?.enable
    ? t('Base.disable')
    : getStatusLabel(bridge?.status || ConnectionStatus.Disconnected)

  const statusClass = !bridge?.enable
    ? NodeStatusClass.Danger
    : getStatusClass(bridge?.status || ConnectionStatus.Disconnected)
  return { details, statusLabel, statusClass }
})
</script>
