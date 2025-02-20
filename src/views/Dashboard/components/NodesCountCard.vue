<template>
  <el-card class="nodes-count-card">
    <div class="content">
      <div class="count-item">
        <i class="node-status-dot is-running"></i>
        <span>{{ t('Dashboard.node', { n: nodesCountData[NodeStatus.Running] }) }}</span>
      </div>
      <div class="count-item">
        <i class="node-status-dot is-stopped"></i>
        <span>{{ t('Dashboard.node', { n: nodesCountData[NodeStatus.Stopped] }) }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { NodeStatus } from '@/types/enum'

defineProps({
  nodesCountData: {
    type: Object as PropType<{ [NodeStatus.Running]: number; [NodeStatus.Stopped]: number }>,
    required: true,
  },
})

const { t } = useI18nTl('Dashboard')
</script>

<style lang="scss">
.nodes-count-card {
  cursor: default;
  width: 90px;
  pointer-events: auto !important;
  &.is-active {
    box-shadow: 0 0 0 6px rgba(0, 177, 115, 0.24);
  }
  .content {
    padding: 6px 8px;
  }
  .count-item {
    display: flex;
    align-items: center;
    span {
      color: var(--color-primary);
    }
  }
  .node-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 3px;
    margin-right: 8px;
  }
}
</style>
