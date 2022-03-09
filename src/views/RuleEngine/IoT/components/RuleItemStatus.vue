<template>
  <StatusDetailsOfEachNode :status-data="statusData" :is-tag="isTag" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RuleItemStatus',
})
</script>

<script setup lang="ts">
import { PropType, defineProps, computed } from 'vue'
import StatusDetailsOfEachNode from '@/components/StatusDetailsOfEachNode.vue'
import { RuleItem } from '@/types/rule'
import useRuleStatus from '@/hooks/Rule/rule/useRuleStatus'

const props = defineProps({
  rule: { type: Object as PropType<RuleItem> },
  isTag: { type: Boolean, default: false },
})

const { getStatusLabel, getStatusClass } = useRuleStatus()
const statusData = computed(() => {
  const { rule } = props
  const details =
    rule?.node_status && Array.isArray(rule?.node_status)
      ? rule?.node_status.map(({ node, enable }) => ({
          node,
          statusLabel: getStatusLabel(enable),
          statusClass: getStatusClass(enable),
        }))
      : []
  return {
    details,
    statusLabel: getStatusLabel(rule?.enable),
    statusClass: getStatusClass(rule?.enable),
  }
})
</script>

<style lang="scss"></style>
