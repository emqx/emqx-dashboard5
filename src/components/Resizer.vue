<template>
  <div ref="ResizerRef" class="resizer" />
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, withDefaults, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    /**
     * Whether the resizer is forward or not
     */
    isForward?: boolean
  }>(),
  {
    min: 40,
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'resize', value: number): void
}>()

const ResizerRef = ref()

let lastYPosition = 0

function setWidth(width: number) {
  emit('update:modelValue', width)
}

const resize = (event: MouseEvent) => {
  const max = props.max || Number.MAX_SAFE_INTEGER
  const yDiff = Math.floor(event.pageY) - lastYPosition
  let targetHeight = props.modelValue + (props.isForward ? yDiff : -yDiff)
  if (targetHeight <= props.min) {
    targetHeight = props.min
  } else if (targetHeight >= max) {
    targetHeight = max
  }
  setWidth(targetHeight)
  lastYPosition = Math.floor(event.pageY)
}

const handleMouseUp = () => {
  window.removeEventListener('mousemove', resize)
  window.removeEventListener('mouseup', handleMouseUp)
  emit('resize', props.modelValue)
}

const handleMouseDown = (event: MouseEvent) => {
  lastYPosition = Math.floor(event.pageY)
  window.addEventListener('mousemove', resize)
  window.addEventListener('mouseup', handleMouseUp)
  event.preventDefault()
}

onMounted(() => {
  ResizerRef.value?.addEventListener('mousedown', handleMouseDown)
})

onUnmounted(() => {
  ResizerRef.value?.removeEventListener('mousedown', handleMouseDown)
  window.removeEventListener('mousemove', resize)
})
</script>

<style lang="scss">
.resizer {
  position: relative;
  z-index: 1;
  height: 8px;
  padding-left: 16px;
  padding-right: 16px;
  cursor: row-resize;
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    border-bottom: 1px solid var(--color-border-primary);
    border-top: 1px solid var(--color-border-primary);
  }
  &::before {
    top: -2px;
    height: 2px;
  }
  &::after {
    top: 4px;
    border-bottom: none;
  }
}
</style>
