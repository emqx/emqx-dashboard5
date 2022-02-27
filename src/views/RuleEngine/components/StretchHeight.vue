<template>
  <div id="stretch-height" class="stretch-height" @mousedown="handleMousedown">
    <el-icon><More /></el-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StretchHeight',
})
</script>

<script setup lang="ts">
import { defineProps, onMounted, defineEmits } from 'vue'
import { More } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    required: true,
    type: Number,
  },
})

const emit = defineEmits(['update:modelValue'])

const handleMousedown = (downEvent: MouseEvent) => {
  let yDown = downEvent.y
  document.onmousemove = (moveEvent) => {
    const yMove = moveEvent.y
    const offset = yMove - yDown
    yDown = moveEvent.y
    emit('update:modelValue', props.modelValue + offset)
  }
}

onMounted(() => {
  document.onmouseup = () => {
    document.onmousemove = null
  }
})
</script>

<style lang="scss" scoped>
.stretch-height {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 10px;
  background: #e6e6e6;
  cursor: row-resize;
}
</style>
