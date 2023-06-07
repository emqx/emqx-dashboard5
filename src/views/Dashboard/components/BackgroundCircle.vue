<template>
  <svg :width="outerRadius * 2" :height="outerRadius * 2">
    <circle
      :cx="outerRadius"
      :cy="outerRadius"
      :r="ringRadius"
      :stroke-width="outerRadius - innerRadius"
      stroke="#E7F7FF"
      fill="none"
    />
    <circle :r="radius" fill="#E3FFF5" :cx="outerRadius" :cy="outerRadius" />
  </svg>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  radius: {
    type: Number,
    required: true,
  },
  innerRadius: {
    type: Number,
    required: true,
  },
  outerRadius: {
    type: Number,
    required: true,
  },
})

const ringWidth = computed(() => props.outerRadius - props.innerRadius)
const ringRadius = computed(() => props.outerRadius - ringWidth.value / 2)
</script>
