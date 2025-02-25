<template>
  <BaseEdge :id="id" :style="style" :path="path[0]" :marker-end="markerEnd" v-bind="$attrs" />

  <EdgeLabelRenderer>
    <div
      v-show="data?.isHover"
      :style="{ transform: `translate(-50%, -95%) translate(${path[1]}px,${path[2]}px)` }"
      class="nodrag nopan btn-edge-del"
      @click="removeEdges(id)"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <el-icon :size="18"><Delete /></el-icon>
    </div>
  </EdgeLabelRenderer>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useVueFlow } from '@vue-flow/core'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  sourceX: {
    type: Number,
    required: true,
  },
  sourceY: {
    type: Number,
    required: true,
  },
  targetX: {
    type: Number,
    required: true,
  },
  targetY: {
    type: Number,
    required: true,
  },
  sourcePosition: {
    type: String,
    required: true,
  },
  targetPosition: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: false,
  },
  markerEnd: {
    type: String,
    required: false,
  },
  style: {
    type: Object,
    required: false,
  },
})

const emit = defineEmits(['mouse-enter', 'mouse-leave'])

const { removeEdges } = useVueFlow()

const path = computed(() => getBezierPath(props))

const handleMouseEnter = () => emit('mouse-enter')

const handleMouseLeave = () => emit('mouse-leave')
</script>

<style lang="scss">
.btn-edge-del {
  position: absolute;
  z-index: 3;
  padding: 8px;
  cursor: pointer;
  pointer-events: all;
  svg {
    stroke-width: 2;
  }
  &:hover {
    svg {
      color: var(--color-primary);
    }
  }
}
</style>
