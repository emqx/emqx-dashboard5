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
import useExhookStatus from '@/hooks/Exhook/useExhookStatus'
import { useI18n } from 'vue-i18n'
import { Exhook } from '@/types/systemModule'
import StatusDetailsOfEachNode from '@/components/StatusDetailsOfEachNode.vue'

const { t } = useI18n()

const tl = (key: string, moduleName = 'Exhook') => t(`${moduleName}.${key}`)

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
const { getTheWorstStatus, dotClass, statusText, statusTextClass } = useExhookStatus(tl)

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
  return {
    details,
    statusClass: statusTextClass(getTheWorstStatus(exhook)),
    statusLabel: statusText(getTheWorstStatus(exhook)),
  }
})
</script>
