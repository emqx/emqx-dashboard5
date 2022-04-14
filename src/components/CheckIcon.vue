<template>
  <el-icon
    v-if="status === 'check'"
    class="check-icon check"
    :style="{ 'font-size': fontSize, top: `${top}px` }"
    ><Check
  /></el-icon>
  <el-icon
    v-else-if="status === 'close'"
    class="check-icon close"
    :style="{ 'font-size': fontSize, top: `${top}px` }"
    ><Close
  /></el-icon>
</template>

<script lang="ts" setup>
import { defineProps, PropType, computed } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'

const props = defineProps({
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'medium',
  },
  top: {
    type: Number,
    default: 0,
  },
  status: {
    type: String as PropType<'check' | 'close'>,
    default: 'check',
  },
})

const fontSize = computed(() => {
  const sizeMap = {
    small: '12px',
    medium: '14px',
    large: '18px',
  }
  return sizeMap[props.size]
})
</script>

<style lang="scss">
.el-icon.check-icon {
  border-radius: 50%;
  margin-right: 6px;
  position: relative;
  color: #fff;
  &.check {
    background: var(--color-primary);
  }
  &.close {
    background: #e44242;
  }
}
</style>
