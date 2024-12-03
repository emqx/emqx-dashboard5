<template>
  <StatusDetailsOfEachNode :status-data="statusData" />
</template>

<script setup lang="ts">
import StatusDetailsOfEachNode from '@/components/StatusDetailsOfEachNode.vue'
import { NodeStatusClass, StreamingConsumerGroupState } from '@/types/enum'
import { StreamingConsumerGroup } from '@/types/typeAlias'
import { defineProps, computed } from 'vue'

const props = defineProps<{
  group: StreamingConsumerGroup
}>()
const classMap = {
  [StreamingConsumerGroupState.PreparingRebalance]: NodeStatusClass.Success,
  [StreamingConsumerGroupState.CompletingRebalance]: NodeStatusClass.Warning,
  [StreamingConsumerGroupState.Stable]: NodeStatusClass.Info,
  [StreamingConsumerGroupState.Dead]: NodeStatusClass.Danger,
  [StreamingConsumerGroupState.Empty]: NodeStatusClass.Danger,
}
const statusData = computed(() => {
  const state = props.group.state as StreamingConsumerGroupState
  return {
    statusLabel: state,
    statusClass: state ? classMap[state] : NodeStatusClass.Info,
  }
})
</script>

<style lang="scss"></style>
