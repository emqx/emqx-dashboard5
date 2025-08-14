<template>
  <FlowNode
    :data="data"
    :is-edit="isEdit"
    :node-label="data.label"
    :node-icon-src="getIconSrc()"
    :support-fallback-actions="isActionNodeButNotFallback"
    :icon-class="iconClass"
    :overflow-tooltip-component="OverflowTooltip"
  />
</template>

<script setup lang="ts">
import OverflowTooltip from '@/components/OverflowTooltip.vue'
import { FlowNode } from '@emqx/shared-ui-components'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const { getNodeIcon, getIconClass, isBridgerNode } = useFlowNode()

const getIconSrc = (): string => {
  return getNodeIcon(props.data?.data?.specificType)
}

const iconClass = computed(() => getIconClass(props.data?.data?.specificType))

const isActionNodeButNotFallback = computed(() => {
  if (props.data?.type !== FlowNodeType.Output) {
    return false
  }
  return isBridgerNode(props.data || {}) && !props.data?.data?.isFallback
})
</script>

<style lang="scss">
.flow-node {
  display: flex;
  width: 160px;
  align-items: center;
  p {
    margin: 0;
  }
  .node-icon {
    display: block;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    flex-shrink: 0;
  }
  .node-bd {
    flex-grow: 1;
  }
  .node-bd {
    line-height: 24px;
    overflow: hidden;
  }
  .label {
    font-weight: 600;
    .extra {
      display: flex;
      font-weight: normal;
      margin-left: 4px;
      min-width: 0;
    }
    .overflow-tooltip {
      color: var(--el-color-danger);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .desc {
    color: rgba(101, 107, 125, 1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .status {
    .el-tooltip__trigger {
      line-height: 1;
    }
    .status-label {
      margin-right: 4px;
    }
  }
}
.vue-flow__handle {
  &.is-error {
    --vf-handle: var(--el-color-danger);
  }
}
.overflow-tooltip-popper {
  .status-label {
    color: var(--el-color-danger);
    margin-right: 12px;
  }
}
</style>
