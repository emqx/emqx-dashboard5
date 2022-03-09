<template>
  <el-tooltip
    placement="right"
    popper-class="tooltip-node-status-list"
    :disabled="!(statusData.details && Array.isArray(statusData.details))"
  >
    <span class="node-status" :class="{ tag: isTag }">
      <el-badge is-dot :type="statusData.statusClass" />
      <span class="text-status" :class="statusData.statusClass">
        {{ statusData.statusLabel }}
      </span>
    </span>
    <template #content>
      <div class="status-detail" v-if="Array.isArray(statusData.details)">
        <ul class="node-status-list">
          <li
            class="node-status-item"
            v-for="{ node, statusClass, statusLabel } in statusData.details"
            :key="node"
          >
            <span class="text-status" :class="statusClass">
              {{ statusLabel }}
            </span>
            <span class="node-name">{{ node }}</span>
          </li>
        </ul>
      </div>
    </template>
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StatusDetailsOfEachNode',
})
</script>

<script setup lang="ts">
import { defineProps, PropType } from 'vue'
import { TargetStatusWithDetail } from '@/types/common'

const props = defineProps({
  statusData: {
    type: Object as PropType<TargetStatusWithDetail>,
    default: () => ({
      detail: [],
    }),
  },
  /**
   * with tag style
   */
  isTag: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
:deep(.el-badge__content--success) {
  background-color: var(--el-color-primary);
}
.node-status {
  cursor: default;
  &.tag {
    display: inline-flex;
    align-items: center;
    height: 20px;
    padding-left: 16px;
    padding-right: 16px;
    font-size: 12px;
    color: #8d96a2;
    background: #e7edf8;
    border-radius: 12px;

    .el-badge {
      padding-top: 5px;
      margin-right: 4px;
      line-height: 1;
    }
    :deep(.el-badge__content) {
      border: none;
    }
  }
}
</style>
