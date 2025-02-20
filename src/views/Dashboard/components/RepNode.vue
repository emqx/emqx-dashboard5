<template>
  <svg :width="nonactivatedRadius * 2" :height="nonactivatedRadius * 2" overflow="visible">
    <circle
      :cx="nonactivatedRadius"
      :cy="nonactivatedRadius"
      :r="nonactivatedRadius"
      :fill="dotNonactivatedColor"
      @mouseenter="selectNode"
    />
    <g v-if="isSelected">
      <circle
        :cx="nonactivatedRadius"
        :cy="nonactivatedRadius"
        :r="activatedOuterRadius"
        :fill="dotActivatedColor"
        opacity="0.35"
      />
      <circle
        :cx="nonactivatedRadius"
        :cy="nonactivatedRadius"
        :r="activatedInnerRadius"
        :fill="dotActivatedColor"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { useRepCodeNodeSize } from '@/hooks/Overview/useNodesGraph'
import { NodeStatus } from '@/types/enum'

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
