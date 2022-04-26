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
import useI18nTl from '@/hooks/useI18nTl'
import { ExhookStatus, NodeStatusClass } from '@/types/enum'

const { t, tl } = useI18nTl('Exhook')

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

const statusText = (status: ExhookStatus) =>
  ({
    [ExhookStatus.Connected]: t('RuleEngine.connected'),
    [ExhookStatus.Connecting]: t('RuleEngine.connecting'),
    [ExhookStatus.Unconnected]: t('RuleEngine.disconnected'),
    [ExhookStatus.Disable]: tl('disabled'),
    [ExhookStatus.Error]: tl('error'),
  }[status] || 'unknown')

const statusTextClass = (status: ExhookStatus): NodeStatusClass =>
  ({
    [ExhookStatus.Connected]: NodeStatusClass.Success,
    [ExhookStatus.Connecting]: NodeStatusClass.Warning,
    [ExhookStatus.Unconnected]: NodeStatusClass.Danger,
    [ExhookStatus.Disable]: NodeStatusClass.Danger,
    [ExhookStatus.Error]: NodeStatusClass.Danger,
  }[status] || NodeStatusClass.Danger)

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
    statusClass: exhook.enable ? NodeStatusClass.Success : NodeStatusClass.Danger,
    statusLabel: t(`Base.${exhook.enable ? 'enable' : 'disable'}`),
  }
})
</script>
