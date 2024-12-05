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
  [StreamingConsumerGroupState.PreparingRebalance]: NodeStatusClass.Good,
  [StreamingConsumerGroupState.CompletingRebalance]: NodeStatusClass.Good,
  [StreamingConsumerGroupState.Stable]: NodeStatusClass.Success,
  [StreamingConsumerGroupState.Dead]: NodeStatusClass.Danger,
  [StreamingConsumerGroupState.Empty]: NodeStatusClass.Info,
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
