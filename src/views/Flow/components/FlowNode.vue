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
  <Handle v-if="data.type !== FlowNodeType.Output" type="source" :position="Position.Right">
    <el-icon class="icon-add" :size="10"><Plus /></el-icon>
  </Handle>
</template>

<script setup lang="ts">
import useFlowNode, { FlowNodeType } from '@/hooks/Flow/useFlowNode'
import { Plus } from '@element-plus/icons-vue'
import { Handle, Position } from '@vue-flow/core'
import { computed, defineProps } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const { getNodeIcon, getIconClass } = useFlowNode()

const getIconSrc = (): string => {
  return getNodeIcon(props.data?.data?.specificType)
}

const iconClass = computed(() => getIconClass(props.data?.data?.specificType))
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
