<template>
  <div class="core-node">
    <Handle />
    <svg :width="coreNodeWidth" :height="coreNodeHeight" overflow="visible">
      <defs>
        <linearGradient :id="id" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" :stop-color="gradientColor[0]" />
          <stop offset="100%" :stop-color="gradientColor[1]" />
        </linearGradient>
      </defs>
      <g>
        <g v-if="isSelected">
          <polygon :points="getPoints(INNER_SIDE_MULTIPLES)" :fill="`url(#${id})`" opacity="0.6" />
        </g>
        <polygon :points="getPoints()" :fill="`url(#${id})`" @mouseenter="selectNode" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { createRandomString, numToFixed } from '@/common/tools'
import { useCoreNodeSize } from '@/hooks/Overview/useNodesGraph'
import { Handle } from '@vue-flow/core'
import { NodeStatus } from '@/types/enum'

const { INNER_SIDE_MULTIPLES, coreNodeHeight, coreNodeWidth, setCoreNodeHeight } = useCoreNodeSize()

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

const emit = defineEmits(['select'])

// for diff defs
const id = createRandomString()

const gradientColor = computed(() =>
  props.status === NodeStatus.Running ? ['#00b299', '#45e3c9'] : ['#dcdcdc', '#cdcdcd'],
)

const getPoints = (multiple = 1) => {
  const r = (coreNodeHeight.value / 2) * multiple
  const x0 = coreNodeWidth.value / 2
  const y0 = coreNodeHeight.value / 2
  const angle = (2 * Math.PI) / 6
  const points = []
  for (let i = 0; i < 6; i++) {
    const x = numToFixed(r * Math.sin(i * angle) + x0, 3)
    const y = numToFixed(r * Math.cos(i * angle) + y0, 3)
    points.push(`${x},${y}`)
  }
  return points.join(' ')
}

const selectNode = () => {
  emit('select')
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
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 1px;
    min-height: 1px;
    height: 1px;
    width: 1px;
    visibility: hidden;
  }
}
</style>
