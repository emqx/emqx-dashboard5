<template>
  <StatusDetailsOfEachNode :status-data="statusData" :is-tag="isTag" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
export default defineComponent({
  name: 'ExhookItemStatus',
})
</script>

<script setup lang="ts">
import { PropType, defineProps } from 'vue'
import { Exhook } from '@/types/systemModule'
import StatusDetailsOfEachNode from '@/components/StatusDetailsOfEachNode.vue'
import useExhookItemStatus from '@/hooks/Exhook/useExhookItemStatus'

const props = defineProps({
  exhook: {
    type: Object as PropType<Exhook>,
    required: true,
  },
  isTag: {
    type: Boolean,
    default: false,
  },
})

const { statusText, statusTextClass, getTheWorstStatus } = useExhookItemStatus()

const statusData = computed(() => {
  const { exhook } = props
  const details =
    exhook.node_status && Array.isArray(exhook.node_status)
      ? exhook.node_status.map(({ node, status }) => {
          return {
            node,
            statusLabel: statusText(status),
            statusClass: statusTextClass(status),
          }
        })
      : []
  const worstStatus = getTheWorstStatus(exhook)
  return {
    details,
    statusClass: statusTextClass(worstStatus),
    statusLabel: statusText(worstStatus),
  }
})
</script>
