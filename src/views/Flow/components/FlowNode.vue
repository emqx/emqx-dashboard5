<template>
  <Handle v-if="data.type !== FlowNodeType.Input" type="target" :position="Position.Left">
    <el-icon class="icon-add" :size="10"><Plus /></el-icon>
  </Handle>
  <div class="flow-node">
    <img :src="getIconSrc()" alt="node-img" class="node-icon" :class="iconClass" />
    <div class="node-bd">
      <p class="label">{{ data.label }}</p>
      <p class="desc">{{ data.data.desc }}</p>
    </div>
  </div>
  <Handle v-if="showSourceHandle" type="source" :position="Position.Right">
    <el-icon class="icon-add" :size="10"><Plus /></el-icon>
  </Handle>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { Handle, Position } from '@vue-flow/core'

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

const withFallbackNodes = computed(() => {
  if (props.data?.type !== FlowNodeType.Output || !isBridgerNode(props.data || {})) {
    return false
  }
  const fallbackActions = props.data?.data?.formData?.fallback_actions ?? []
  return fallbackActions.length > 0
})

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
  }
  .desc {
    color: rgba(101, 107, 125, 1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
