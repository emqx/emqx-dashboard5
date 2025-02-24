<template>
  <div class="background-circle">
    <svg :width="SVGSideLength" :height="SVGSideLength">
      <path
        class="background-ring"
        @click="clickRing"
        v-click-outside="onClickRingOutside"
        :fill="backgroundCircle"
        :d="ringPath"
        :stroke-width="ACTIVE_RING_STROKE_WIDTH"
        :stroke="isRingActivated ? 'rgba(0, 177, 115, 0.35)' : undefined"
      />
      <circle :r="BACKGROUND_CIRCLE_RADIUS" fill="#f0eeff" :cx="SVGCenter" :cy="SVGCenter" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import {
  ACTIVE_RING_STROKE_WIDTH,
  BACKGROUND_CIRCLE_INNER_RADIUS,
  BACKGROUND_CIRCLE_OUTER_RADIUS,
  BACKGROUND_CIRCLE_RADIUS,
  useBackgroundCircle,
} from '@/hooks/Overview/useNodesGraph'
import { ClickOutside as vClickOutside } from 'element-plus'

const emit = defineEmits(['showPopover'])
const store = useStore()

const { SVGSideLength } = useBackgroundCircle()
const SVGCenter = SVGSideLength / 2

const backgroundCircle = computed(() => {
  const { theme } = store.state
  return theme === 'dark' ? '#469cf71a' : '#E7F7FF'
})

const ringPath = computed(() => {
  const innerRadius = BACKGROUND_CIRCLE_INNER_RADIUS
  const outerRadius = BACKGROUND_CIRCLE_OUTER_RADIUS
  const center = SVGCenter
  return `M ${center} ${center - outerRadius}
A ${outerRadius} ${outerRadius} 0 0 1 ${center + outerRadius} ${center}
A ${outerRadius} ${outerRadius} 0 0 1 ${center} ${center + outerRadius}
A ${outerRadius} ${outerRadius} 0 0 1 ${center - outerRadius} ${center}
A ${outerRadius} ${outerRadius} 0 0 1 ${center} ${center - outerRadius}
M ${center} ${center - innerRadius}
A ${innerRadius} ${innerRadius} 0 0 0 ${center - innerRadius} ${center}
A ${innerRadius} ${innerRadius} 0 0 0 ${center} ${center + innerRadius}
A ${innerRadius} ${innerRadius} 0 0 0 ${center + innerRadius} ${center}
A ${innerRadius} ${innerRadius} 0 0 0 ${center} ${center - innerRadius}`
})

const isRingActivated = ref(false)
const clickRing = () => {
  isRingActivated.value = true
  emit('showPopover')
}
const onClickRingOutside = () => {
  isRingActivated.value = false
}
</script>

<style lang="scss">
.background-circle {
  position: relative;
  svg {
    stroke: transparent;
    stroke-width: 0px;
  }
  .background-ring {
    pointer-events: auto !important;
    cursor: default;
  }
}
</style>
