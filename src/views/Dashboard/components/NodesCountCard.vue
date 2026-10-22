<template>
  <el-card class="nodes-count-card">
    <div class="content">
      <div class="count-item" v-for="status in NODE_STATUSES" :key="status">
        <NodeStatusLabel :status="status" />
        <span>{{ t('Dashboard.node', { n: nodesCountData[status] }) }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { NODE_STATUSES, type NodeCounts } from '@/common/nodeStatus'
import NodeStatusLabel from '@/components/NodeStatusLabel.vue'

defineProps({
  nodesCountData: {
    type: Object as PropType<NodeCounts>,
    required: true,
  },
})

const { t } = useI18nTl('Dashboard')
</script>

<style lang="scss">
.nodes-count-card {
  cursor: default;
  min-width: 190px;
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
    justify-content: space-between;
    gap: 12px;
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
