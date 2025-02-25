<template>
  <div class="flow-guide-node" :class="{ 'is-source': nodeType === NodeType.Source }">
    <Handle v-if="nodeType !== NodeType.Source" :position="Position.Left" type="target" />
    <Handle v-if="nodeType !== NodeType.Sink" :position="Position.Right" type="source" />
    <div class="square"></div>
    <p class="label">{{ data?.label }}</p>
    <p class="desc">{{ data?.data?.desc }}</p>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

const props = defineProps({
  data: {
    type: Object,
  },
})

const nodeType = computed(() => {
  return props.data?.data?.type
})
</script>

<style lang="scss">
@use 'sass:math';

.flow-guide-node {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  // After the fit view, the position of the node on the upper side of the page..
  padding-bottom: 260px;
  $square-size: 60px;
  $node-width: 168px;
  .square {
    width: $square-size;
    height: $square-size;
    margin-bottom: 14px;
    border: 1px dashed var(--color-border-primary);
    border-radius: 4px;
  }
  .label {
    margin-bottom: 4px;
    font-size: 16px;
    line-height: 22px;
    color: var(--color-text-primary);
  }
  .desc {
    width: $node-width;
    line-height: 22px;
    color: var(--color-text-secondary);
    opacity: 0.6;
  }
  &.is-source {
    .square {
      border: 2px dashed var(--color-text-secondary);
    }
    .label {
      color: var(--color-primary);
    }
    .desc {
      opacity: 1;
    }
  }
  .vue-flow__handle-right {
    right: math.div($node-width - $square-size, 2) - 2px;
  }
  .vue-flow__handle-left {
    left: math.div($node-width - $square-size, 2) - 2px;
  }
  .vue-flow__handle-right,
  .vue-flow__handle-left {
    top: math.div($square-size, 2);
  }
}
</style>
