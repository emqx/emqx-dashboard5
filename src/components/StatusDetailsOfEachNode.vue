<template>
  <el-tooltip
    placement="right"
    popper-class="tooltip-node-status-list"
    :disabled="isTooltipDisabled"
  >
    <span class="node-status" :class="{ tag: isTag }">
      <CheckIcon v-show="statusData.statusLabel" :status="statusForIcon" />
      <span class="text-status" :class="statusData.statusClass">
        {{ statusData.statusLabel }}
      </span>
    </span>
    <template #content>
      <div class="status-detail">
        <ul class="node-status-list" v-if="Array.isArray(statusData.details)">
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
import { defineProps, PropType, computed } from 'vue'
import { TargetStatusWithDetail } from '@/types/common'
import { NodeStatusClass, CheckStatus } from '@/types/enum'
import CheckIcon from '@/components/CheckIcon.vue'

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

const isTooltipDisabled = computed(() => {
  const { statusData } = props
  return !(statusData.details && Array.isArray(statusData.details) && statusData.details.length > 0)
})

const statusForIcon = computed(() => {
  const map: Record<NodeStatusClass, CheckStatus> = {
    [NodeStatusClass.Success]: CheckStatus.Check,
    [NodeStatusClass.Warning]: CheckStatus.Warning,
    [NodeStatusClass.Danger]: CheckStatus.Close,
  }
  return map[props.statusData.statusClass || NodeStatusClass.Danger]
})
</script>

<style lang="scss" scoped>
:deep(.el-badge__content--success) {
  background-color: var(--el-color-primary);
}
.node-status {
  cursor: default;
  display: inline-flex;
  align-items: center;
  &.tag {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding-left: 16px;
    padding-right: 16px;
    font-size: 12px;
    color: #8d96a2;
    background: var(--color-bg-split);
    border: 1px solid var(--color-border-primary);
    border-radius: 8px;
    .text-status {
      font-weight: normal;
    }
    :deep(.el-badge__content) {
      border: none;
    }
  }
}
</style>

<style lang="scss">
.el-popper.is-dark {
  background: #282e38;

  &.tooltip-node-status-list {
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .node-status-list {
    margin-top: 0;
    margin-bottom: 0;
    list-style: none;
    padding-left: 0;
    width: 200px;
  }

  .node-status-item {
    display: flex;
    justify-content: space-between;
    margin: 12px 0;
    .text-status {
      flex-shrink: 0;
      margin-right: 20px;
    }
    .node-name {
      word-break: break-all;
    }
  }
}
</style>
