<template>
  <div class="core-node">
    <Handle :x="5" :y="5" />
    <svg :width="SVGWidth" :height="SVGHeight">
      <defs>
        <linearGradient :id="id" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" :stop-color="gradientColor[0]" />
          <stop offset="100%" :stop-color="gradientColor[1]" />
        </linearGradient>
      </defs>
      <g>
        <g v-if="isSelected">
          <polygon
            v-if="nodesNum === 1"
            :points="getPoints(OUTER_SIDE_MULTIPLES)"
            :fill="`url(#${id})`"
            opacity="0.3"
          />
          <polygon :points="getPoints(INNER_SIDE_MULTIPLES)" :fill="`url(#${id})`" opacity="0.6" />
        </g>
        <polygon :points="getPoints()" :fill="`url(#${id})`" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { createRandomString, numToFixed } from '@/common/tools'
import { useCoreNodeSize } from '@/hooks/Overview/useNodesGraph'
import { PropType, computed, defineProps, watch } from 'vue'
import { Handle } from '@vue-flow/core'
import { NodeStatus } from '@/types/enum'

const {
  OUTER_SIDE_MULTIPLES,
  INNER_SIDE_MULTIPLES,
  coreNodeHeight,
  SVGHeight,
  SVGWidth,
  setCoreNodeHeight,
} = useCoreNodeSize()

// Just to mark it, there is no actual control over the height.
const handleHeight = 6
const handleTop = computed(() => `${SVGHeight.value / 2 + handleHeight / 2}px`)

const props = defineProps({
  height: {
    type: Number,
    default: 20,
  },
  isSelected: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String as PropType<NodeStatus>,
    default: NodeStatus.Running,
  },
  nodesNum: {
    type: Number,
    default: 1,
  },
})

// for diff defs
const id = createRandomString()

const gradientColor = computed(() =>
  props.status === NodeStatus.Running ? ['#00b299', '#45e3c9'] : ['#dcdcdc', '#cdcdcd'],
)

const getPoints = (multiple = 1) => {
  const r = (coreNodeHeight.value / 2) * multiple
  const x0 = SVGWidth.value / 2
  const y0 = SVGHeight.value / 2
  const angle = (2 * Math.PI) / 6
  const points = []
  for (let i = 0; i < 6; i++) {
    const x = numToFixed(r * Math.sin(i * angle) + x0, 3)
    const y = numToFixed(r * Math.cos(i * angle) + y0, 3)
    points.push(`${x},${y}`)
  }
  return points.join(' ')
}

watch(
  () => props.height,
  (val: number) => setCoreNodeHeight(val),
)

setCoreNodeHeight(props.height)
</script>

<style lang="scss">
.core-node {
  .vue-flow__handle {
    visibility: hidden;
    position: relative;
    top: v-bind('handleTop');
  }
}
</style>
