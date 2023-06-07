<template>
  <svg :width="activatedOuterRadius * 2" :height="activatedOuterRadius * 2">
    <circle
      :cx="activatedOuterRadius"
      :cy="activatedOuterRadius"
      :r="nonactivatedRadius"
      stroke-width="0"
      fill="#1890FF"
    />
    <g v-if="isSelected">
      <circle
        :cx="activatedOuterRadius"
        :cy="activatedOuterRadius"
        :r="activatedOuterRadius"
        stroke-width="0"
        fill="#469CF7"
        opacity="0.35"
      />
      <circle
        :cx="activatedOuterRadius"
        :cy="activatedOuterRadius"
        :r="activatedInnerRadius"
        fill="#469CF7"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import {
  BACKGROUND_CIRCLE_INNER_RADIUS,
  BACKGROUND_CIRCLE_OUTER_RADIUS,
} from '@/hooks/Overview/useNodesGraph'
import { NodeStatus } from '@/types/enum'
import { PropType, computed, defineProps } from 'vue'

const rightWidth = BACKGROUND_CIRCLE_OUTER_RADIUS - BACKGROUND_CIRCLE_INNER_RADIUS
const nonactivatedRadius = rightWidth / 5 / 2
const activatedInnerRadius = rightWidth / 3 / 2
const activatedOuterRadius = activatedInnerRadius * 2

const props = defineProps({
  isSelected: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String as PropType<NodeStatus>,
    default: NodeStatus.Running,
  },
})

// TODO:color
const dotColor = computed(() =>
  props.status === NodeStatus.Running ? ['#00b299', '#45e3c9'] : ['#dcdcdc', '#cdcdcd'],
)
</script>
