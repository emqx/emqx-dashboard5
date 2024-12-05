<template>
  <el-icon class="check-icon" :class="status" :style="{ 'font-size': fontSize, top: `${top}px` }">
    <Check v-if="[CheckStatus.Check, CheckStatus.Good].includes(status)" />
    <Close
      v-else-if="[CheckStatus.Close, CheckStatus.Disable, CheckStatus.Info].includes(status)"
    />
    <Warning v-else-if="status === CheckStatus.Warning" />
    <InfoFilled v-else-if="status === CheckStatus.Info" />
  </el-icon>
</template>

<script lang="ts" setup>
import { defineProps, PropType, computed } from 'vue'
import { Check, Close, Warning, InfoFilled } from '@element-plus/icons-vue'
import { CheckStatus } from '@/types/enum'

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
    type: String as PropType<CheckStatus>,
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
    background: var(--el-color-success);
  }
  &.close {
    background: #e44242;
  }
  &.warning {
    background-color: var(--el-color-warning);
  }
  &.disable {
    background-color: var(--el-disabled-bg-color);
  }
  &.info {
    background-color: var(--el-color-info);
  }
  &.good {
    background-color: var(--color-common-blue);
  }
}
</style>
