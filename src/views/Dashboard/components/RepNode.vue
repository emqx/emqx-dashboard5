<template>
  <svg :width="nonactivatedRadius * 2" :height="nonactivatedRadius * 2" overflow="visible">
    <circle
      :cx="nonactivatedRadius"
      :cy="nonactivatedRadius"
      :r="nonactivatedRadius"
      fill="transparent"
      :stroke="dotStrokeColor"
      stroke-width="2"
      @mouseenter="selectNode"
    />
    <circle
      v-if="isSelected"
      :cx="nonactivatedRadius"
      :cy="nonactivatedRadius"
      :r="activatedOuterRadius"
      :fill="dotActivatedColor"
      opacity="0.15"
    />
  </svg>
</template>

<script setup lang="ts">
import { NodeStatus } from '@/types/enum'

const { nonactivatedRadius, activatedOuterRadius } = useRepCodeNodeSize()

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

const dotStrokeColor = computed(() => (isRunning.value ? '#6366f1' : '#bac1cd'))

const dotActivatedColor = computed(() => (isRunning.value ? '#6366f1' : '#bac1cd'))

const selectNode = () => {
  emit('select')
}
</script>
