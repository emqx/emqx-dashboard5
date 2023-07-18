<template>
  <Handle v-if="data.type !== FlowNodeType.Input" type="target" :position="Position.Left" />
  <div class="flow-node">
    <i class="node-icon"></i>
    <div class="node-bd">
      <p class="label">{{ data.label }}</p>
      <p class="desc">{{ data.data.desc }}</p>
    </div>
  </div>
  <Handle v-if="data.type !== FlowNodeType.Output" type="source" :position="Position.Right" />
</template>

<script setup lang="ts">
import { FlowNodeType } from '@/hooks/Flow/useFlowNode'
import { Handle, Position } from '@vue-flow/core'
import { defineProps } from 'vue'

defineProps({
  data: {
    type: Object,
    required: true,
  },
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
    width: 28px;
    height: 28px;
    margin-right: 12px;
    flex-shrink: 0;
    background-color: khaki;
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
