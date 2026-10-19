<template>
  <StatusDetailsOfEachNode :status-data="statusData" />
</template>

<script setup lang="ts">
import { NodeStatusClass } from '@/types/enum'
import { ListenerSimpleInfo, ListenerStatus } from '@/types/listener'

const props = defineProps<{
  listener: ListenerSimpleInfo
}>()

const { t, tl } = useI18nTl('Gateway')

const getStatusDisplay = (running?: ListenerStatus['running']) => {
  switch (running) {
    case true:
      return { statusLabel: t('Dashboard.running'), statusClass: NodeStatusClass.Success }
    case false:
      return { statusLabel: tl('notRunning'), statusClass: NodeStatusClass.Danger }
    case 'inconsistent':
      return { statusLabel: t('Base.inconsistent'), statusClass: NodeStatusClass.Warning }
    default:
      return { statusLabel: t('RuleEngine.unknown'), statusClass: NodeStatusClass.Warning }
  }
}

const statusData = computed(() => {
  const { listener } = props
  const details = Array.isArray(listener.node_status)
    ? listener.node_status.map(({ node, status }) => ({
        node,
        ...getStatusDisplay(status?.running),
      }))
    : []

  return { ...getStatusDisplay(listener.status?.running), details }
})
</script>
