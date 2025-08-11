<template>
  <Handle
    v-if="data.type !== FlowNodeType.Input"
    type="target"
    :position="Position.Left"
    :class="{ 'is-error': isDisconnectedActionOrSource }"
  >
    <el-icon class="icon-add" :size="10"><Plus /></el-icon>
  </Handle>
  <div class="flow-node">
    <img :src="getIconSrc()" alt="node-img" class="node-icon" :class="iconClass" />
    <div class="node-bd" :title="data.data.desc">
      <p class="label vertical-align-center">
        <span>
          {{ data.label }}
        </span>
        <span class="extra" v-if="isDisconnectedActionOrSource">
          (<OverflowTooltip class="common-overflow-tooltip">
            <span class="status-label">{{
              getActionStatusLabel(data?.data?.formData?.status)
            }}</span>
            <template #content>
              <span class="status-label">{{
                getActionStatusLabel(data?.data?.formData?.status)
              }}</span>
            </template> </OverflowTooltip
          >)
        </span>
      </p>
      <p class="desc" v-if="!isAIType(data.data.specificType)">
        {{ data.data.desc }}
      </p>
      <template v-else-if="data.data.desc">
        <CommonOverflowTooltip :content="data.data.desc" class="desc" />
      </template>
    </div>
  </div>
  <Handle
    v-if="showSourceHandle"
    type="source"
    :position="Position.Right"
    :class="{ 'is-error': isDisconnectedActionOrSource }"
  >
    <el-icon class="icon-add" :size="10"><Plus /></el-icon>
  </Handle>
</template>

<script setup lang="ts">
import { ConnectionStatus } from '@/types/enum'
import { Plus } from '@element-plus/icons-vue'
import { Handle, Node, Position } from '@vue-flow/core'

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

const { getNodeIcon, getIconClass, isBridgerNode, isWithFallbackNodes, isAIType } = useFlowNode()

const isDisconnectedActionOrSource = computed(() => {
  const isActionOrSource = isBridgerNode(props.data || {})
  const isDisconnected =
    isActionOrSource && props.data?.data?.formData?.status === ConnectionStatus.Disconnected
  return isDisconnected
})
const { getActionStatusLabel } = useActionAndSourceStatus()

const getIconSrc = (): string => {
  return getNodeIcon(props.data?.data?.specificType)
}

const iconClass = computed(() => getIconClass(props.data?.data?.specificType))

const withFallbackNodes = computed(() => isWithFallbackNodes(props.data as Node))

const isActionNodeButNotFallback = computed(() => {
  if (props.data?.type !== FlowNodeType.Output) {
    return false
  }
  return isBridgerNode(props.data || {}) && !props.data?.data?.isFallback
})

const showSourceHandle = computed(() => {
  if (props.data?.type !== FlowNodeType.Output) {
    return true
  }
  if (!props.isEdit) {
    return withFallbackNodes.value
  }
  return isActionNodeButNotFallback.value
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
