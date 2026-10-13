<template>
  <span class="node-status-label">
    <i class="node-status-dot" :class="`is-${isNodeStatus(status) ? status : 'unknown'}`"></i>
    <span>{{ isNodeStatus(status) ? t(`Dashboard.${status}`) : t('RuleEngine.unknown') }}</span>
  </span>
</template>

<script setup lang="ts">
import { isNodeStatus } from '@/common/nodeStatus'

defineProps<{ status?: string }>()
const { t } = useI18n()
</script>

<style scoped lang="scss">
.node-status-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  .node-status-dot {
    flex-shrink: 0;
  }
}
</style>
