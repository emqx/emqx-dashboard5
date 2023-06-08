<template>
  <svg :width="activatedOuterRadius * 2" :height="activatedOuterRadius * 2">
    <circle
      :cx="activatedOuterRadius"
      :cy="activatedOuterRadius"
      :r="nonactivatedRadius"
      :fill="dotNonactivatedColor"
      @mouseenter="selectNode"
    />
    <g v-if="isSelected">
      <circle
        :cx="activatedOuterRadius"
        :cy="activatedOuterRadius"
        :r="activatedOuterRadius"
        :fill="dotActivatedColor"
        opacity="0.35"
      />
      <circle
        :cx="activatedOuterRadius"
        :cy="activatedOuterRadius"
        :r="activatedInnerRadius"
        :fill="dotActivatedColor"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { useRepCodeNodeSize } from '@/hooks/Overview/useNodesGraph'
import { NodeStatus } from '@/types/enum'
import { PropType, computed, defineEmits, defineProps } from 'vue'

const { nonactivatedRadius, activatedInnerRadius, activatedOuterRadius } = useRepCodeNodeSize()

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
const emit = defineEmits(['select'])

const isRunning = computed(() => props.status === NodeStatus.Running)

const dotNonactivatedColor = computed(() => (isRunning.value ? '#1890ff' : '#bac1cd'))

const dotActivatedColor = computed(() => (isRunning.value ? '#469cf7' : '#bac1cd'))

const selectNode = () => {
  emit('select')
}
</script>
